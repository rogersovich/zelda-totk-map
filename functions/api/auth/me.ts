import { Env, jsonResponse, errorResponse } from '../../utils/db';

export async function onRequestGet(context: { request: Request; env: Env }) {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500);
    }

    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return errorResponse('Unauthorized. Token is missing.', 401);
    }

    // 1. Fetch user by permanent token
    const user = await env.DB.prepare(
      'SELECT id, username, created_at FROM users WHERE token = ?'
    )
      .bind(token)
      .first<{
        id: string;
        username: string;
        created_at: string;
      }>();

    if (!user) {
      return errorResponse('Invalid or expired token.', 401);
    }

    // 2. Fetch user state
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
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.created_at,
      },
      state: {
        completedItems,
        customPins,
        settings,
        updatedAt: userState?.updated_at || null,
      },
    });
  } catch (err: any) {
    return errorResponse(`Server error: ${err.message || err}`, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({ status: 'ok' });
}
