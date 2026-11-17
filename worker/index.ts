// Cloudflare Worker Entrypoint with Static Assets & D1 Database
import { onRequestPost as handleRegister } from '../functions/api/auth/register';
import { onRequestPost as handleLogin } from '../functions/api/auth/login';
import { onRequestGet as handleMe } from '../functions/api/auth/me';
import { onRequestPost as handleSync } from '../functions/api/user/sync';

export interface Env {
  DB: any;
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // 1. API Routes
    if (url.pathname === '/api/auth/register' && request.method === 'POST') {
      return handleRegister({ request, env });
    }
    if (url.pathname === '/api/auth/login' && request.method === 'POST') {
      return handleLogin({ request, env });
    }
    if (url.pathname === '/api/auth/me' && request.method === 'GET') {
      return handleMe({ request, env });
    }
    if (url.pathname === '/api/user/sync' && request.method === 'POST') {
      return handleSync({ request, env });
    }

    // 2. Static Assets (React Vite bundle in ./dist)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
