import { Env, jsonResponse, errorResponse } from '../../utils/db';
import { generateRandomHex, hashPassword, generatePermanentToken } from '../../utils/crypto';

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500);
    }

    const body: any = await request.json().catch(() => null);
    if (!body || !body.username || !body.password) {
      return errorResponse('Username and password are required.');
    }

    const username = body.username.trim();
    const password = body.password;

    if (username.length < 3) {
      return errorResponse('Username must be at least 3 characters.');
    }
    if (password.length < 4) {
      return errorResponse('Password must be at least 4 characters.');
    }

    // 1. Check if user already exists
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE username = ? COLLATE NOCASE'
    )
      .bind(username)
      .first<{ id: string }>();

    if (existingUser) {
      return errorResponse('Username is already taken. Please choose another or login.');
    }

    // 2. Create new user credentials
    const userId = `usr_${Date.now()}_${generateRandomHex(8)}`;
    const salt = generateRandomHex(16);
    const passwordHash = await hashPassword(password, salt);
    const permanentToken = generatePermanentToken();

    // Initial state (use guest state if provided, or empty)
    const initialCompleted = JSON.stringify(body.initialState?.completedItems || {});
    const initialPins = JSON.stringify(body.initialState?.customPins || []);
    const initialSettings = JSON.stringify(body.initialState?.settings || {});

    // 3. Insert user & state
    await env.DB.batch([
      env.DB.prepare(
        'INSERT INTO users (id, username, password_hash, salt, token) VALUES (?, ?, ?, ?, ?)'
      ).bind(userId, username, passwordHash, salt, permanentToken),
      env.DB.prepare(
        'INSERT INTO user_states (user_id, completed_items, custom_pins, settings) VALUES (?, ?, ?, ?)'
      ).bind(userId, initialCompleted, initialPins, initialSettings),
    ]);

    return jsonResponse({
      success: true,
      token: permanentToken,
      user: {
        id: userId,
        username,
      },
      state: {
        completedItems: JSON.parse(initialCompleted),
        customPins: JSON.parse(initialPins),
        settings: JSON.parse(initialSettings),
      },
      message: 'Account created successfully!',
    });
  } catch (err: any) {
    return errorResponse(`Server error: ${err.message || err}`, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({ status: 'ok' });
}
