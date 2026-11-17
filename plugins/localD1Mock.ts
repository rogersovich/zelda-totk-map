import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Hash password with salt using PBKDF2 with SHA-256 (matches Cloudflare Functions)
function hashPassword(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, key) => {
      if (err) reject(err);
      else resolve(key.toString('hex'));
    });
  });
}

function loadEnv(): { accountId?: string; dbId?: string; token?: string } {
  const envPath = path.resolve(process.cwd(), '.env.local');
  const result: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    lines.forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        result[match[1].trim()] = match[2].trim();
      }
    });
  }
  return {
    accountId: result.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID,
    dbId: result.CLOUDFLARE_D1_DATABASE_ID || process.env.CLOUDFLARE_D1_DATABASE_ID,
    token: result.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN,
  };
}

export function localD1MockPlugin(): Plugin {
  const env = loadEnv();
  const hasRealD1 = Boolean(env.accountId && env.dbId && env.token);

  async function queryRealD1(sql: string, params: any[] = []): Promise<any[]> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${env.accountId}/d1/database/${env.dbId}/query`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.errors?.[0]?.message || 'D1 query failed');
    }
    return data.result?.[0]?.results || [];
  }

  // Fallback local file if real D1 credentials aren't set
  const dbFile = path.resolve(process.cwd(), '.data/local_d1_mock.json');
  function getLocalDB() {
    try {
      if (fs.existsSync(dbFile)) {
        return JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
      }
    } catch (e) {}
    return { users: {}, states: {} };
  }
  function saveLocalDB(data: any) {
    try {
      const dir = path.dirname(dbFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
    } catch (e) {}
  }

  return {
    name: 'local-d1-mock',
    configureServer(server) {
      if (hasRealD1) {
        console.log('⚡ Connected directly to live Cloudflare D1 Database (totk-map-db)!');
      }

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          return res.end(JSON.stringify({ status: 'ok' }));
        }

        const readBody = async (): Promise<any> => {
          return new Promise((resolve) => {
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch (e) {
                resolve({});
              }
            });
          });
        };

        try {
          // ================= REAL CLOUDFLARE D1 HANDLERS =================
          if (hasRealD1) {
            // 1. REGISTER
            if (pathname === '/api/auth/register' && req.method === 'POST') {
              const body = await readBody();
              const username = (body.username || '').trim();
              const password = body.password || '';

              if (username.length < 3) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ success: false, error: 'Username minimal 3 karakter.' }));
              }
              if (password.length < 4) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ success: false, error: 'Password minimal 4 karakter.' }));
              }

              // Check existing
              const existing = await queryRealD1(
                'SELECT id FROM users WHERE username = ? COLLATE NOCASE',
                [username]
              );
              if (existing.length > 0) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ success: false, error: 'Username sudah digunakan.' }));
              }

              const userId = `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
              const salt = crypto.randomBytes(16).toString('hex');
              const passwordHash = await hashPassword(password, salt);
              const token = `totk_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;

              const initialCompleted = JSON.stringify(body.initialState?.completedItems || {});
              const initialPins = JSON.stringify(body.initialState?.customPins || []);
              const initialSettings = JSON.stringify(body.initialState?.settings || {});

              // Insert to Cloudflare D1
              await queryRealD1(
                'INSERT INTO users (id, username, password_hash, salt, token) VALUES (?, ?, ?, ?, ?)',
                [userId, username, passwordHash, salt, token]
              );
              await queryRealD1(
                'INSERT INTO user_states (user_id, completed_items, custom_pins, settings) VALUES (?, ?, ?, ?)',
                [userId, initialCompleted, initialPins, initialSettings]
              );

              res.statusCode = 200;
              return res.end(
                JSON.stringify({
                  success: true,
                  token,
                  user: { id: userId, username },
                  state: {
                    completedItems: JSON.parse(initialCompleted),
                    customPins: JSON.parse(initialPins),
                    settings: JSON.parse(initialSettings),
                  },
                  message: 'Akun berhasil dibuat langsung di Cloudflare D1!',
                })
              );
            }

            // 2. LOGIN
            if (pathname === '/api/auth/login' && req.method === 'POST') {
              const body = await readBody();
              const username = (body.username || '').trim();
              const password = body.password || '';

              const users = await queryRealD1(
                'SELECT id, username, password_hash, salt, token FROM users WHERE username = ? COLLATE NOCASE',
                [username]
              );

              if (users.length === 0) {
                res.statusCode = 401;
                return res.end(JSON.stringify({ success: false, error: 'Username atau password salah.' }));
              }

              const user = users[0];
              const computedHash = await hashPassword(password, user.salt);
              if (computedHash !== user.password_hash) {
                res.statusCode = 401;
                return res.end(JSON.stringify({ success: false, error: 'Username atau password salah.' }));
              }

              // Update last login
              queryRealD1('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]).catch(() => {});

              // Fetch state from D1
              const states = await queryRealD1(
                'SELECT completed_items, custom_pins, settings, updated_at FROM user_states WHERE user_id = ?',
                [user.id]
              );

              const stateRow = states[0] || {};
              const completedItems = stateRow.completed_items ? JSON.parse(stateRow.completed_items) : {};
              const customPins = stateRow.custom_pins ? JSON.parse(stateRow.custom_pins) : [];
              const settings = stateRow.settings ? JSON.parse(stateRow.settings) : {};

              res.statusCode = 200;
              return res.end(
                JSON.stringify({
                  success: true,
                  token: user.token,
                  user: { id: user.id, username: user.username },
                  state: {
                    completedItems,
                    customPins,
                    settings,
                    updatedAt: stateRow.updated_at || null,
                  },
                  message: 'Login berhasil! Data Cloudflare D1 dimuat.',
                })
              );
            }

            // 3. ME (Session Check)
            if (pathname === '/api/auth/me' && req.method === 'GET') {
              const authHeader = req.headers['authorization'] || '';
              const token = authHeader.replace(/^Bearer\s+/i, '').trim();

              const users = await queryRealD1(
                'SELECT id, username, created_at FROM users WHERE token = ?',
                [token]
              );
              if (users.length === 0) {
                res.statusCode = 401;
                return res.end(JSON.stringify({ success: false, error: 'Sesi tidak valid.' }));
              }

              const user = users[0];
              const states = await queryRealD1(
                'SELECT completed_items, custom_pins, settings, updated_at FROM user_states WHERE user_id = ?',
                [user.id]
              );

              const stateRow = states[0] || {};
              const completedItems = stateRow.completed_items ? JSON.parse(stateRow.completed_items) : {};
              const customPins = stateRow.custom_pins ? JSON.parse(stateRow.custom_pins) : [];
              const settings = stateRow.settings ? JSON.parse(stateRow.settings) : {};

              res.statusCode = 200;
              return res.end(
                JSON.stringify({
                  success: true,
                  user: { id: user.id, username: user.username, createdAt: user.created_at },
                  state: {
                    completedItems,
                    customPins,
                    settings,
                    updatedAt: stateRow.updated_at || null,
                  },
                })
              );
            }

            // 4. SYNC
            if (pathname === '/api/user/sync' && req.method === 'POST') {
              const authHeader = req.headers['authorization'] || '';
              const token = authHeader.replace(/^Bearer\s+/i, '').trim();

              const users = await queryRealD1('SELECT id FROM users WHERE token = ?', [token]);
              if (users.length === 0) {
                res.statusCode = 401;
                return res.end(JSON.stringify({ success: false, error: 'Unauthorized.' }));
              }

              const userId = users[0].id;
              const body = await readBody();

              const completedItems = JSON.stringify(body.completedItems || {});
              const customPins = JSON.stringify(body.customPins || []);
              const settings = JSON.stringify(body.settings || {});

              await queryRealD1(
                `INSERT INTO user_states (user_id, completed_items, custom_pins, settings, updated_at)
                 VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                 ON CONFLICT(user_id) DO UPDATE SET
                   completed_items = excluded.completed_items,
                   custom_pins = excluded.custom_pins,
                   settings = excluded.settings,
                   updated_at = CURRENT_TIMESTAMP`,
                [userId, completedItems, customPins, settings]
              );

              res.statusCode = 200;
              return res.end(
                JSON.stringify({
                  success: true,
                  updatedAt: new Date().toISOString(),
                  message: 'Data berhasil disinkronkan ke Cloudflare D1!',
                })
              );
            }
          }

          // Fallback to local mock file if no real D1
          const db = getLocalDB();
          if (pathname === '/api/auth/register' && req.method === 'POST') {
            const body = await readBody();
            const username = (body.username || '').trim();
            const password = body.password || '';
            const userId = `usr_${Date.now()}`;
            const token = `totk_local_${Date.now()}`;
            db.users[userId] = { id: userId, username, passwordHash: password, token, createdAt: new Date().toISOString() };
            db.states[userId] = { completedItems: body.initialState?.completedItems || {}, customPins: [], settings: {}, updatedAt: new Date().toISOString() };
            saveLocalDB(db);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, token, user: { id: userId, username }, state: db.states[userId] }));
          }

          next();
        } catch (err: any) {
          console.error('API Error:', err);
          res.statusCode = 500;
          return res.end(JSON.stringify({ success: false, error: err.message || 'Server error' }));
        }
      });
    },
  };
}
