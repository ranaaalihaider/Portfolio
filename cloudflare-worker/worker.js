/**
 * COMPLETE CLOUDFLARE WORKER
 */

function base64UrlEncode(str) { return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad) {
    base64 += '='.repeat(4 - pad);
  }
  return atob(base64);
}

async function signJWT(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`));
  const encodedSignature = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

async function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const signatureBytes = new Uint8Array(base64UrlDecode(signature).split('').map(c => c.charCodeAt(0)));
    const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, new TextEncoder().encode(`${header}.${payload}`));
    if (!isValid) return null;
    return JSON.parse(base64UrlDecode(payload));
  } catch (e) { return null; }
}

async function hashApiKey(key) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateRandomKey() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return 'cust_' + Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getKarachiDateStr(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

function getKarachiTimeStr() {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());
}

function getKarachiStartOfMonth() {
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit' });
  const parts = formatter.formatToParts(new Date());
  let y = '', m = '';
  for (const p of parts) {
    if (p.type === 'year') y = p.value;
    if (p.type === 'month') m = p.value;
  }
  return `${y}-${m}-01`;
}

function isValidPeriod(p) {
  return ['today', '7', '30'].includes(p);
}

function validateSql(sql) {
  let cleanSql = sql.replace(/```sql/ig, '').replace(/```/g, '').trim();
  const upperSql = cleanSql.toUpperCase();

  if (!upperSql.startsWith('SELECT') && !upperSql.startsWith('WITH')) {
    return { isValid: false, error: 'SQL must start with SELECT or WITH.' };
  }

  if (cleanSql.includes('--') || cleanSql.includes('/*')) {
    return { isValid: false, error: 'SQL comments are not allowed.' };
  }

  const segments = cleanSql.split(';');
  if (segments.length > 2 || (segments.length === 2 && segments[1].trim() !== '')) {
    return { isValid: false, error: 'Multiple SQL statements are not allowed.' };
  }

  const dangerousKeywords = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'TRUNCATE', 'REPLACE', 'GRANT', 'REVOKE'];
  const tokens = upperSql.split(/[\s,();]+/);
  for (const token of tokens) {
    if (dangerousKeywords.includes(token)) {
      return { isValid: false, error: `Dangerous SQL keyword detected: ${token}` };
    }
  }

  return { isValid: true, cleanSql };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = [
      'https://alihaider.site',
      'https://www.alihaider.site',
      'http://localhost:3000'
    ];
    let corsHeaders = {
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (origin) {
      corsHeaders['Access-Control-Allow-Origin'] = origin;
    } else {
      corsHeaders['Access-Control-Allow-Origin'] = '*';
    }

    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

    const respondJSON = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    const errorResponse = (msg, status = 400) => respondJSON({ success: false, error: msg }, status);

    if (pathname === '/api/ai/sql' && request.method === 'POST') {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) return errorResponse('Missing API Key', 401);

      const rawKey = authHeader.split(' ')[1];
      const customer = await env.DB.prepare('SELECT id, name, status, monthly_limit FROM customers WHERE api_key_hash = ?').bind(rawKey).first();
      if (!customer) return errorResponse('Invalid API Key', 401);
      if (customer.status !== 'active') return errorResponse('Account is blocked', 403);

      const startOfMonth = getKarachiStartOfMonth();
      const usageResult = await env.DB.prepare('SELECT COUNT(*) as count FROM request_logs WHERE customer_id = ? AND status = "success" AND request_date >= ?')
        .bind(customer.id, startOfMonth).first();

      if (usageResult.count >= customer.monthly_limit) return errorResponse('Monthly AI request limit reached.', 429);

      const body = await request.json().catch(() => ({}));
      const question = body.question;
      if (!question) return errorResponse('Missing question');

      try {
        const groqRes = await fetch(
          'https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            temperature: 0.1,
            messages: [
              {
                role: "system",
                content: `Convert the user's request into MySQL SELECT SQL. Use only tables and columns provided in the schema:\ncustomers(id, name, phone, balance)\nReturn SQL only. No markdown. No explanation. Never generate INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, TRUNCATE, REPLACE, GRANT or REVOKE. Generate exactly one read-only statement.`
              },
              { role: "user", content: question }
            ]
          })
        });

        if (!groqRes.ok) {
          return errorResponse('AI Generation Failed to respond properly.', 502);
        }

        const groqData = await groqRes.json();
        const sql = groqData.choices?.[0]?.message?.content || "";
        const usage = groqData.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

        if (!sql) {
          return errorResponse('No SQL generated.', 500);
        }

        const validation = validateSql(sql);

        if (!validation.isValid) {
          await env.DB.prepare('INSERT INTO request_logs (customer_id, request_date, request_time, status) VALUES (?, ?, ?, "error_unsafe")').bind(customer.id, getKarachiDateStr(), getKarachiTimeStr()).run();
          return errorResponse(validation.error || 'Generated SQL is unsafe.', 403);
        }

        await env.DB.prepare('INSERT INTO request_logs (customer_id, request_date, request_time, input_tokens, output_tokens, total_tokens, status) VALUES (?, ?, ?, ?, ?, ?, "success")')
          .bind(customer.id, getKarachiDateStr(), getKarachiTimeStr(), usage.prompt_tokens, usage.completion_tokens, usage.total_tokens).run();

        return respondJSON({ success: true, sql: validation.cleanSql });
      } catch (e) {
        return errorResponse('AI Generation Failed', 500);
      }
    }

    if (pathname === '/api/admin/login' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (body.username === env.ADMIN_USERNAME && body.password === env.ADMIN_PASSWORD) {
        const token = await signJWT({ role: 'admin', exp: Math.floor(Date.now() / 1000) + 86400 }, env.JWT_SECRET);
        return respondJSON({ token });
      }
      return errorResponse('Invalid credentials', 401);
    }

    if (pathname === '/api/admin/logout' && request.method === 'POST') {
      return respondJSON({ success: true });
    }

    if (pathname.startsWith('/api/admin/')) {
      const token = (request.headers.get('Authorization') || '').split(' ')[1];
      if (!token) return errorResponse('Unauthorized', 401);
      const payload = await verifyJWT(token, env.JWT_SECRET);
      if (!payload || payload.role !== 'admin' || payload.exp < Date.now() / 1000) return errorResponse('Unauthorized', 401);

      if (pathname === '/api/admin/dashboard' && request.method === 'GET') {
        const totalCust = await env.DB.prepare('SELECT COUNT(*) as count FROM customers').first();
        const activeCust = await env.DB.prepare('SELECT COUNT(*) as count FROM customers WHERE status="active"').first();
        const blockCust = await env.DB.prepare('SELECT COUNT(*) as count FROM customers WHERE status="blocked"').first();
        const dateToday = getKarachiDateStr();
        const reqToday = await env.DB.prepare('SELECT COUNT(*) as count FROM request_logs WHERE request_date=? AND status="success"').bind(dateToday).first();

        const startOfMonth = getKarachiStartOfMonth();
        const monthStats = await env.DB.prepare('SELECT COUNT(*) as count, SUM(input_tokens) as in_tok, SUM(output_tokens) as out_tok, SUM(total_tokens) as tot_tok FROM request_logs WHERE request_date >= ? AND status="success"').bind(startOfMonth).first();

        const recent = await env.DB.prepare('SELECT request_date, COUNT(*) as count FROM request_logs WHERE status="success" GROUP BY request_date ORDER BY request_date DESC LIMIT 7').all();

        return respondJSON({
          totalCustomers: totalCust?.count || 0,
          activeCustomers: activeCust?.count || 0,
          blockedCustomers: blockCust?.count || 0,
          requestsToday: reqToday?.count || 0,
          requestsThisMonth: monthStats?.count || 0,
          inputTokensThisMonth: monthStats?.in_tok || 0,
          outputTokensThisMonth: monthStats?.out_tok || 0,
          totalTokensThisMonth: monthStats?.tot_tok || 0,
          recentUsage: recent.results.map(r => ({ date: r.request_date, requests: r.count })).reverse()
        });
      }

      if (pathname === '/api/admin/customers' && request.method === 'GET') {
        const startOfMonth = getKarachiStartOfMonth();
        const dateToday = getKarachiDateStr();
        const query = `
          SELECT c.id, c.name, c.status, c.monthly_limit, c.created_at, c.api_key_hash as api_key,
            CAST(IFNULL(SUM(CASE WHEN r.request_date >= ? THEN 1 ELSE 0 END), 0) AS INTEGER) as requests_month,
            CAST(IFNULL(SUM(CASE WHEN r.request_date = ? THEN 1 ELSE 0 END), 0) AS INTEGER) as requests_today,
            CAST(IFNULL(SUM(CASE WHEN r.request_date >= ? THEN r.total_tokens ELSE 0 END), 0) AS INTEGER) as tokens_month
          FROM customers c
          LEFT JOIN request_logs r ON c.id = r.customer_id AND r.status = 'success'
          GROUP BY c.id
          ORDER BY c.id DESC
        `;
        const { results } = await env.DB.prepare(query).bind(startOfMonth, dateToday, startOfMonth).all();
        return respondJSON(results);
      }

      if (pathname === '/api/admin/customers' && request.method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const name = body.name;
        const monthly_limit = body.monthly_limit;
        if (!name || typeof name !== 'string' || name.trim() === '') return errorResponse('Name is required', 400);
        if (!Number.isInteger(monthly_limit) || monthly_limit <= 0) return errorResponse('Monthly limit must be a positive integer', 400);

        const rawKey = generateRandomKey();
        await env.DB.prepare('INSERT INTO customers (name, api_key_hash, monthly_limit, status) VALUES (?, ?, ?, "active")')
          .bind(name.trim(), rawKey, monthly_limit).run();
        return respondJSON({ success: true, api_key: rawKey });
      }

      const custMatch = pathname.match(/^\/api\/admin\/customers\/(\d+)$/);
      if (custMatch) {
        const id = custMatch[1];
        const cust = await env.DB.prepare('SELECT id, name, status, monthly_limit, api_key_hash as api_key, created_at FROM customers WHERE id=?').bind(id).first();
        if (!cust) return errorResponse('Not found', 404);

        if (request.method === 'GET') {
          const dateToday = getKarachiDateStr();
          const reqToday = await env.DB.prepare('SELECT COUNT(*) as count FROM request_logs WHERE customer_id=? AND request_date=? AND status="success"').bind(id, dateToday).first();

          const startOfMonth = getKarachiStartOfMonth();
          const mStats = await env.DB.prepare('SELECT COUNT(*) as count, SUM(total_tokens) as tok FROM request_logs WHERE customer_id=? AND request_date >= ? AND status="success"').bind(id, startOfMonth).first();
          const dUsage = await env.DB.prepare('SELECT request_date as date, COUNT(*) as requests, SUM(input_tokens) as input_tokens, SUM(output_tokens) as output_tokens, SUM(total_tokens) as total_tokens FROM request_logs WHERE customer_id=? AND status="success" GROUP BY request_date ORDER BY request_date DESC LIMIT 30').bind(id).all();

          return respondJSON({
            ...cust,
            requests_today: reqToday?.count || 0,
            requests_month: mStats?.count || 0,
            tokens_month: mStats?.tok || 0,
            daily_usage: dUsage.results
          });
        }
        if (request.method === 'PATCH') {
          const body = await request.json().catch(() => ({}));
          if (body.status !== undefined) {
            if (body.status !== 'active' && body.status !== 'blocked') return errorResponse('Invalid status', 400);
            await env.DB.prepare('UPDATE customers SET status=? WHERE id=?').bind(body.status, id).run();
          }
          if (body.monthly_limit !== undefined) {
            if (!Number.isInteger(body.monthly_limit) || body.monthly_limit <= 0) return errorResponse('Invalid limit', 400);
            await env.DB.prepare('UPDATE customers SET monthly_limit=? WHERE id=?').bind(body.monthly_limit, id).run();
          }
          return respondJSON({ success: true });
        }
      }

      const rotateMatch = pathname.match(/^\/api\/admin\/customers\/(\d+)\/rotate-key$/);
      if (rotateMatch && request.method === 'POST') {
        const id = rotateMatch[1];
        const cust = await env.DB.prepare('SELECT id FROM customers WHERE id=?').bind(id).first();
        if (!cust) return errorResponse('Not found', 404);

        const rawKey = generateRandomKey();
        await env.DB.prepare('UPDATE customers SET api_key_hash=? WHERE id=?').bind(rawKey, id).run();
        return respondJSON({ success: true, api_key: rawKey });
      }

      if (pathname === '/api/admin/usage' && request.method === 'GET') {
        const urlParams = new URLSearchParams(url.search);
        let p = urlParams.get('period') || '30';
        if (!isValidPeriod(p)) return errorResponse('Invalid period', 400);

        let since = getKarachiDateStr();
        if (p !== 'today') {
          const dateOffset = (24 * 60 * 60 * 1000) * (parseInt(p) - 1);
          const kDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
          const targetDate = new Date(kDate.getTime() - dateOffset);
          since = getKarachiDateStr(targetDate);
        }

        const cid = urlParams.get('customer') || 'all';

        let q = 'SELECT SUM(input_tokens) as i, SUM(output_tokens) as o, SUM(total_tokens) as t, COUNT(*) as c FROM request_logs WHERE request_date >= ? AND status="success"';
        let dq = 'SELECT request_date as date, COUNT(*) as requests, SUM(total_tokens) as tokens FROM request_logs WHERE request_date >= ? AND status="success" GROUP BY request_date ORDER BY request_date ASC';

        let b = [since];
        if (cid !== 'all') {
          q = 'SELECT SUM(input_tokens) as i, SUM(output_tokens) as o, SUM(total_tokens) as t, COUNT(*) as c FROM request_logs WHERE request_date >= ? AND customer_id = ? AND status="success"';
          dq = 'SELECT request_date as date, COUNT(*) as requests, SUM(total_tokens) as tokens FROM request_logs WHERE request_date >= ? AND customer_id = ? AND status="success" GROUP BY request_date ORDER BY request_date ASC';
          b.push(cid);
        }

        const totals = await env.DB.prepare(q).bind(...b).first();
        const daily = await env.DB.prepare(dq).bind(...b).all();

        return respondJSON({
          totalRequests: totals?.c || 0,
          inputTokens: totals?.i || 0,
          outputTokens: totals?.o || 0,
          totalTokens: totals?.t || 0,
          daily: daily.results
        });
      }
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
};
