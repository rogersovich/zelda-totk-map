import { Env, jsonResponse, errorResponse } from '../../utils/db';

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500);
    }

    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return errorResponse('Unauthorized.', 401);
    }

    // 1. Verify user token
    const user = await env.DB.prepare('SELECT id FROM users WHERE token = ?')
      .bind(token)
      .first<{ id: string }>();

    if (!user) {
      return errorResponse('Invalid token.', 401);
    }

    const body: any = await request.json().catch(() => null);
    if (!body) {
      return errorResponse('Payload is required.');
    }

    const completedItems = JSON.stringify(body.completedItems || {});
    const customPins = JSON.stringify(body.customPins || []);
    const settings = JSON.stringify(body.settings || {});

    // 2. Upsert user state into D1
    await env.DB.prepare(
      `INSERT INTO user_states (user_id, completed_items, custom_pins, settings, updated_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(user_id) DO UPDATE SET
         completed_items = excluded.completed_items,
         custom_pins = excluded.custom_pins,
         settings = excluded.settings,
         updated_at = CURRENT_TIMESTAMP`
    )
      .bind(user.id, completedItems, customPins, settings)
      .run();

    return jsonResponse({
      success: true,
      updatedAt: new Date().toISOString(),
      message: 'State synchronized with Cloudflare D1!',
    });
  } catch (err: any) {
    return errorResponse(`Server error: ${err.message || err}`, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({ status: 'ok' });
}
