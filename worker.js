const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
  });
}
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });
    if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);
    if (!env.GEMINI_API_KEY) return jsonResponse({ error: 'GEMINI_API_KEY not configured.' }, 500);
    let body;
    try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON.' }, 400); }
    try {
      const r = await fetch(`${GEMINI_URL}?key=${env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      return new Response(JSON.stringify(data), {
        status: r.status,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
      });
    } catch (err) {
      return jsonResponse({ error: 'Failed to reach Gemini API.', detail: err.message }, 502);
    }
  },
};
