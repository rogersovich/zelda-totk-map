import { Env, jsonResponse, errorResponse } from '../../utils/db';
import { hashPassword } from '../../utils/crypto';

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

    // 1. Fetch user by username
    const user = await env.DB.prepare(
      'SELECT id, username, password_hash, salt, token FROM users WHERE username = ? COLLATE NOCASE'
    )
      .bind(username)
      .first<{
        id: string;
        username: string;
        password_hash: string;
        salt: string;
        token: string;
      }>();

    if (!user) {
      return errorResponse('Invalid username or password.', 401);
    }

    // 2. Verify password hash
    const computedHash = await hashPassword(password, user.salt);
    if (computedHash !== user.password_hash) {
      return errorResponse('Invalid username or password.', 401);
    }

    // 3. Update last login timestamp
    await env.DB.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(user.id)
      .run();

    // 4. Fetch the user's stored state from D1
    const userState = await env.DB.prepare(
      'SELECT completed_items, custom_pins, settings, updated_at FROM user_states WHERE user_id = ?'
    )
      .bind(user.id)
      .first<{
        completed_items: string;
        custom_pins: string;
        settings: string;
        updated_at: string;
      }>();

    const completedItems = userState?.completed_items ? JSON.parse(userState.completed_items) : {};
    const customPins = userState?.custom_pins ? JSON.parse(userState.custom_pins) : [];
    const settings = userState?.settings ? JSON.parse(userState.settings) : {};

    return jsonResponse({
      success: true,
      token: user.token,
      user: {
        id: user.id,
        username: user.username,
      },
      // State from D1 to override client state
      state: {
        completedItems,
        customPins,
        settings,
        updatedAt: userState?.updated_at || null,
      },
      message: 'Login successful! Cloud state loaded.',
    });
  } catch (err: any) {
    return errorResponse(`Server error: ${err.message || err}`, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({ status: 'ok' });
}
