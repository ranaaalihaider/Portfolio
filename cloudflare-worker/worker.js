/**
 * COMPLETE CLOUDFLARE WORKER
 *
 * AI flow:
 * Laravel -> Worker -> Groq -> SQL -> Laravel
 *
 * Important:
 * - Worker NEVER executes customer SQL.
 * - Full customer schema remains stored in D1.
 * - Only a compact schema is sent to Groq.
 * - Groq 429 gets exactly ONE retry after 1 second.
 * - Internal Groq errors are NOT exposed to customers.
 */


/* =========================================================
 * BASE64 / JWT HELPERS
 * ========================================================= */

function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str) {
  let base64 = str
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const pad = base64.length % 4;

  if (pad) {
    base64 += '='.repeat(4 - pad);
  }

  return atob(base64);
}

async function signJWT(payload, secret) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const encodedHeader =
    base64UrlEncode(JSON.stringify(header));

  const encodedPayload =
    base64UrlEncode(JSON.stringify(payload));

  const key =
    await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      {
        name: 'HMAC',
        hash: 'SHA-256'
      },
      false,
      ['sign']
    );

  const signature =
    await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(
        `${encodedHeader}.${encodedPayload}`
      )
    );

  const encodedSignature =
    base64UrlEncode(
      String.fromCharCode(
        ...new Uint8Array(signature)
      )
    );

  return (
    `${encodedHeader}.` +
    `${encodedPayload}.` +
    `${encodedSignature}`
  );
}

async function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');

    if (parts.length !== 3) {
      return null;
    }

    const [
      header,
      payload,
      signature
    ] = parts;

    const key =
      await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        {
          name: 'HMAC',
          hash: 'SHA-256'
        },
        false,
        ['verify']
      );

    const signatureBytes =
      new Uint8Array(
        base64UrlDecode(signature)
          .split('')
          .map(
            c => c.charCodeAt(0)
          )
      );

    const isValid =
      await crypto.subtle.verify(
        'HMAC',
        key,
        signatureBytes,
        new TextEncoder().encode(
          `${header}.${payload}`
        )
      );

    if (!isValid) {
      return null;
    }

    return JSON.parse(
      base64UrlDecode(payload)
    );

  } catch (e) {
    return null;
  }
}


/* =========================================================
 * HASH HELPERS
 * ========================================================= */

/*
 * Kept for future API-key hashing migration.
 *
 * Current customer authentication behavior is intentionally
 * preserved because existing keys are currently stored
 * directly in api_key_hash.
 */
async function hashApiKey(key) {
  const hashBuffer =
    await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(key)
    );

  return Array
    .from(new Uint8Array(hashBuffer))
    .map(
      b => b
        .toString(16)
        .padStart(2, '0')
    )
    .join('');
}


/*
 * Used for uploaded schema hashes.
 */
async function sha256Hex(str) {
  const hashBuffer =
    await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(str)
    );

  return Array
    .from(new Uint8Array(hashBuffer))
    .map(
      b => b
        .toString(16)
        .padStart(2, '0')
    )
    .join('');
}


/* =========================================================
 * CUSTOMER KEY GENERATION
 * ========================================================= */

function generateRandomKey() {
  const array =
    new Uint8Array(32);

  crypto.getRandomValues(array);

  return (
    'cust_' +
    Array
      .from(array)
      .map(
        b => b
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
}


/* =========================================================
 * DATE / TIME HELPERS
 * ========================================================= */

function getKarachiDateStr(dateInput) {
  const d =
    dateInput
      ? new Date(dateInput)
      : new Date();

  return new Intl.DateTimeFormat(
    'en-CA',
    {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }
  ).format(d);
}

function getKarachiTimeStr() {
  return new Intl.DateTimeFormat(
    'en-GB',
    {
      timeZone: 'Asia/Karachi',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }
  ).format(new Date());
}

function getKarachiStartOfMonth() {
  const formatter =
    new Intl.DateTimeFormat(
      'en-CA',
      {
        timeZone: 'Asia/Karachi',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
    );

  const parts =
    formatter.formatToParts(
      new Date()
    );

  let y = '';
  let m = '';

  for (const p of parts) {
    if (p.type === 'year') {
      y = p.value;
    }

    if (p.type === 'month') {
      m = p.value;
    }
  }

  return `${y}-${m}-01`;
}

function isValidPeriod(p) {
  return [
    'today',
    '7',
    '30'
  ].includes(p);
}


/* =========================================================
 * SLEEP HELPER
 * Used ONLY for one Groq 429 retry.
 * ========================================================= */

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}


/* =========================================================
 * COMPACT DATABASE SCHEMA
 * =========================================================
 *
 * Full schema stays stored in D1.
 *
 * Example full schema:
 *
 * {
 *   tables: {
 *     customers: {
 *       columns: [
 *         { name: "id", type: "bigint" },
 *         { name: "name", type: "varchar" },
 *         { name: "balance", type: "decimal" }
 *       ]
 *     }
 *   },
 *   relationships: [...]
 * }
 *
 * Becomes:
 *
 * customers(id,name,balance)
 *
 * RELATIONSHIPS:
 * sales.customer_id->customers.id
 *
 * This significantly reduces tokens sent to Groq.
 * ========================================================= */

function compactSchema(schema) {
  const lines = [];

  if (
    schema &&
    schema.tables &&
    typeof schema.tables === 'object'
  ) {

    for (
      const [
        tableName,
        tableData
      ]
      of Object.entries(schema.tables)
    ) {

      const columns =
        Array.isArray(
          tableData?.columns
        )
          ? tableData.columns
            .map(
              column =>
                typeof column === 'string'
                  ? column
                  : column?.name
            )
            .filter(Boolean)
          : [];

      /*
       * Keep the table even if columns happen
       * to be empty.
       */
      lines.push(
        `${tableName}(${columns.join(',')})`
      );
    }
  }


  /*
   * Preserve foreign-key / relationship
   * information because it is important
   * for JOIN generation.
   */
  if (
    Array.isArray(
      schema?.relationships
    ) &&
    schema.relationships.length > 0
  ) {

    lines.push('');
    lines.push('RELATIONSHIPS:');

    for (
      const rel
      of schema.relationships
    ) {

      if (
        rel?.from_table &&
        rel?.from_column &&
        rel?.to_table &&
        rel?.to_column
      ) {

        lines.push(
          `${rel.from_table}.` +
          `${rel.from_column}` +
          '->' +
          `${rel.to_table}.` +
          `${rel.to_column}`
        );
      }
    }
  }

  return lines.join('\n');
}


/* =========================================================
 * SQL VALIDATION
 * ========================================================= */

function validateSql(sql) {
  let cleanSql =
    sql
      .replace(/```sql/ig, '')
      .replace(/```/g, '')
      .trim();

  const upperSql =
    cleanSql.toUpperCase();

  if (
    !upperSql.startsWith('SELECT') &&
    !upperSql.startsWith('WITH')
  ) {
    return {
      isValid: false,
      error:
        'SQL must start with SELECT or WITH.'
    };
  }

  if (
    cleanSql.includes('--') ||
    cleanSql.includes('/*')
  ) {
    return {
      isValid: false,
      error:
        'SQL comments are not allowed.'
    };
  }

  const segments =
    cleanSql.split(';');

  if (
    segments.length > 2 ||
    (
      segments.length === 2 &&
      segments[1].trim() !== ''
    )
  ) {
    return {
      isValid: false,
      error:
        'Multiple SQL statements are not allowed.'
    };
  }

  const dangerousKeywords = [
    'INSERT',
    'UPDATE',
    'DELETE',
    'DROP',
    'ALTER',
    'CREATE',
    'TRUNCATE',
    'REPLACE',
    'GRANT',
    'REVOKE'
  ];

  const tokens =
    upperSql.split(
      /[\s,();]+/
    );

  for (const token of tokens) {
    if (
      dangerousKeywords.includes(
        token
      )
    ) {
      return {
        isValid: false,
        error:
          `Dangerous SQL keyword detected: ${token}`
      };
    }
  }

  return {
    isValid: true,
    cleanSql
  };
}


/* =========================================================
 * GROQ REQUEST
 * =========================================================
 *
 * Makes ONE normal request.
 *
 * If Groq returns HTTP 429:
 * - wait ~1 second
 * - retry exactly ONCE
 *
 * No infinite retry.
 * ========================================================= */

async function callGroq(
  env,
  compactCustomerSchema,
  question
) {

  const requestBody = {
    model:
      'openai/gpt-oss-20b',

    temperature: 0.1,

    messages: [
      {
        role: 'system',

        content:
          `You generate read-only MySQL queries.

Use ONLY the database schema provided below.

Never invent tables or columns.

Generate exactly one read-only SELECT or WITH query.

Never generate INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, TRUNCATE, REPLACE, GRANT or REVOKE.

Return SQL only.

No markdown.
No explanation.

DATABASE SCHEMA:
${compactCustomerSchema}`
      },

      {
        role: 'user',
        content: question.trim()
      }
    ]
  };


  const makeRequest =
    async () => {

      return fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',

          headers: {
            'Authorization':
              `Bearer ${env.GROQ_API_KEY}`,

            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(
              requestBody
            )
        }
      );
    };


  /*
   * FIRST ATTEMPT
   */

  let response =
    await makeRequest();


  /*
   * ONLY retry HTTP 429.
   *
   * Exactly one retry.
   */

  if (response.status === 429) {

    /*
     * Consume response body before retrying.
     */
    try {
      await response.text();
    } catch (e) {
      // Ignore body-reading failure.
    }

    /*
     * Wait approximately one second.
     */
    await sleep(1000);


    /*
     * SECOND AND FINAL ATTEMPT
     */
    response =
      await makeRequest();
  }


  /*
   * No further retries.
   */

  return response;
}


/* =========================================================
 * WORKER
 * ========================================================= */

export default {

  async fetch(request, env, ctx) {

    const url =
      new URL(request.url);

    const pathname =
      url.pathname;


    /* =====================================================
     * CORS
     * ===================================================== */

    const origin =
      request.headers.get(
        'Origin'
      ) || '';

    const allowedOrigins = [
      'https://alihaider.site',
      'https://www.alihaider.site',
      'http://localhost:3000'
    ];

    const corsHeaders = {
      'Access-Control-Allow-Methods':
        'GET, POST, PATCH, OPTIONS',

      'Access-Control-Allow-Headers':
        'Content-Type, Authorization',

      'Cache-Control':
        'no-store, no-cache, must-revalidate, proxy-revalidate'
    };

    if (
      origin &&
      allowedOrigins.includes(
        origin
      )
    ) {
      corsHeaders[
        'Access-Control-Allow-Origin'
      ] = origin;
    }


    /*
     * Browser preflight.
     */
    if (
      request.method === 'OPTIONS'
    ) {

      if (
        origin &&
        !allowedOrigins.includes(
          origin
        )
      ) {
        return new Response(
          null,
          {
            status: 403
          }
        );
      }

      return new Response(
        null,
        {
          status: 204,
          headers: corsHeaders
        }
      );
    }


    /* =====================================================
     * RESPONSE HELPERS
     * ===================================================== */

    const respondJSON = (
      data,
      status = 200
    ) => {

      return new Response(
        JSON.stringify(data),
        {
          status,

          headers: {
            'Content-Type':
              'application/json',

            ...corsHeaders
          }
        }
      );
    };


    const errorResponse = (
      msg,
      status = 400
    ) => {

      return respondJSON(
        {
          success: false,
          error: msg
        },
        status
      );
    };


    /* =====================================================
     * AI SCHEMA UPLOAD
     *
     * POST /api/ai/schema
     * ===================================================== */

    if (
      pathname ===
      '/api/ai/schema' &&
      request.method === 'POST'
    ) {

      const authHeader =
        request.headers.get(
          'Authorization'
        );

      if (
        !authHeader ||
        !authHeader.startsWith(
          'Bearer '
        )
      ) {
        return errorResponse(
          'Missing API Key',
          401
        );
      }

      const rawKey =
        authHeader
          .slice(7)
          .trim();

      if (!rawKey) {
        return errorResponse(
          'Missing API Key',
          401
        );
      }


      /*
       * Existing customer-key behavior
       * intentionally preserved.
       */
      const customer =
        await env.DB
          .prepare(`
            SELECT
              id,
              name,
              status
            FROM customers
            WHERE api_key_hash = ?
          `)
          .bind(rawKey)
          .first();


      if (!customer) {
        return errorResponse(
          'Invalid API Key',
          401
        );
      }


      if (
        customer.status !==
        'active'
      ) {
        return errorResponse(
          'Account is blocked',
          403
        );
      }


      const body =
        await request
          .json()
          .catch(
            () => ({})
          );


      if (
        !body.schema ||
        typeof body.schema !==
        'object' ||
        Array.isArray(
          body.schema
        )
      ) {
        return errorResponse(
          'Invalid schema format',
          400
        );
      }


      let schemaStr;

      try {

        schemaStr =
          JSON.stringify(
            body.schema
          );

      } catch (e) {

        return errorResponse(
          'Schema could not be serialized',
          400
        );
      }


      /*
       * Maximum schema size:
       * 500 KB
       */

      const schemaBytes =
        new TextEncoder()
          .encode(
            schemaStr
          )
          .length;


      if (
        schemaBytes >
        500 * 1024
      ) {
        return errorResponse(
          'Schema size exceeds 500 KB',
          400
        );
      }


      const schemaHash =
        await sha256Hex(
          schemaStr
        );


      /*
       * Full schema is stored in D1.
       *
       * We DO NOT compact it here.
       */

      await env.DB
        .prepare(`
          INSERT INTO customer_schemas
          (
            customer_id,
            schema_json,
            schema_hash,
            updated_at
          )
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)

          ON CONFLICT(customer_id)

          DO UPDATE SET
            schema_json =
              excluded.schema_json,

            schema_hash =
              excluded.schema_hash,

            updated_at =
              CURRENT_TIMESTAMP
        `)
        .bind(
          customer.id,
          schemaStr,
          schemaHash
        )
        .run();


      return respondJSON({
        success: true,
        message:
          'Schema synced',
        schema_hash:
          schemaHash
      });
    }


    /* =====================================================
     * AI SCHEMA STATUS
     *
     * GET /api/ai/schema/status
     * ===================================================== */

    if (
      pathname ===
      '/api/ai/schema/status' &&
      request.method === 'GET'
    ) {

      const authHeader =
        request.headers.get(
          'Authorization'
        );


      if (
        !authHeader ||
        !authHeader.startsWith(
          'Bearer '
        )
      ) {
        return errorResponse(
          'Missing API Key',
          401
        );
      }


      const rawKey =
        authHeader
          .slice(7)
          .trim();


      if (!rawKey) {
        return errorResponse(
          'Missing API Key',
          401
        );
      }


      const customer =
        await env.DB
          .prepare(`
            SELECT
              id,
              name,
              status
            FROM customers
            WHERE api_key_hash = ?
          `)
          .bind(rawKey)
          .first();


      if (!customer) {
        return errorResponse(
          'Invalid API Key',
          401
        );
      }


      if (
        customer.status !==
        'active'
      ) {
        return errorResponse(
          'Account is blocked',
          403
        );
      }


      const schemaRecord =
        await env.DB
          .prepare(`
            SELECT
              schema_hash,
              updated_at
            FROM customer_schemas
            WHERE customer_id = ?
          `)
          .bind(
            customer.id
          )
          .first();


      if (!schemaRecord) {

        return respondJSON({
          success: true,
          configured: false,
          schema_hash: null,
          updated_at: null
        });
      }


      return respondJSON({
        success: true,
        configured: true,

        schema_hash:
          schemaRecord.schema_hash,

        updated_at:
          schemaRecord.updated_at
      });
    }


    /* =====================================================
     * AI SQL GENERATION
     *
     * POST /api/ai/sql
     * ===================================================== */

    if (
      pathname ===
      '/api/ai/sql' &&
      request.method === 'POST'
    ) {

      /* ---------------------------------------------------
       * Customer Authentication
       * --------------------------------------------------- */

      const authHeader =
        request.headers.get(
          'Authorization'
        );


      if (
        !authHeader ||
        !authHeader.startsWith(
          'Bearer '
        )
      ) {
        return errorResponse(
          'Missing API Key',
          401
        );
      }


      const rawKey =
        authHeader
          .slice(7)
          .trim();


      if (!rawKey) {
        return errorResponse(
          'Missing API Key',
          401
        );
      }


      const customer =
        await env.DB
          .prepare(`
            SELECT
              id,
              name,
              status,
              monthly_limit
            FROM customers
            WHERE api_key_hash = ?
          `)
          .bind(rawKey)
          .first();


      if (!customer) {
        return errorResponse(
          'Invalid API Key',
          401
        );
      }


      if (
        customer.status !==
        'active'
      ) {
        return errorResponse(
          'Account is blocked',
          403
        );
      }


      /* ---------------------------------------------------
       * Monthly Usage Limit
       * --------------------------------------------------- */

      const startOfMonth =
        getKarachiStartOfMonth();


      const usageResult =
        await env.DB
          .prepare(`
            SELECT
              COUNT(*) as count

            FROM request_logs

            WHERE customer_id = ?
              AND status = "success"
              AND request_date >= ?
          `)
          .bind(
            customer.id,
            startOfMonth
          )
          .first();


      if (
        (usageResult?.count || 0) >=
        customer.monthly_limit
      ) {

        return errorResponse(
          'Monthly AI request limit reached.',
          429
        );
      }


      /* ---------------------------------------------------
       * Load Full Customer Schema
       * --------------------------------------------------- */

      const schemaRecord =
        await env.DB
          .prepare(`
            SELECT
              schema_json

            FROM customer_schemas

            WHERE customer_id = ?
          `)
          .bind(
            customer.id
          )
          .first();


      if (
        !schemaRecord ||
        !schemaRecord.schema_json
      ) {

        return errorResponse(
          'Database schema not configured',
          400
        );
      }


      let customerSchema;

      try {

        customerSchema =
          JSON.parse(
            schemaRecord.schema_json
          );

      } catch (e) {

        return errorResponse(
          'Stored database schema is invalid',
          500
        );
      }


      /* ---------------------------------------------------
       * COMPACT SCHEMA
       * ---------------------------------------------------
       *
       * Full D1 schema remains unchanged.
       *
       * Only this compact representation goes
       * to Groq.
       */

      const compactCustomerSchema =
        compactSchema(
          customerSchema
        );


      if (
        !compactCustomerSchema.trim()
      ) {

        return errorResponse(
          'Database schema is empty',
          500
        );
      }


      /* ---------------------------------------------------
       * User Question
       * --------------------------------------------------- */

      const body =
        await request
          .json()
          .catch(
            () => ({})
          );


      const question =
        body.question;


      if (
        !question ||
        typeof question !==
        'string' ||
        !question.trim()
      ) {

        return errorResponse(
          'Missing question',
          400
        );
      }


      /* ---------------------------------------------------
       * GROQ
       * --------------------------------------------------- */

      try {

        /*
         * callGroq:
         *
         * attempt 1
         *
         * if 429:
         * wait 1 second
         *
         * attempt 2
         *
         * STOP.
         */

        const groqRes =
          await callGroq(
            env,
            compactCustomerSchema,
            question
          );


        /*
         * Read response once.
         */

        const groqRaw =
          await groqRes.text();


        /* -------------------------------------------------
         * Groq still rate limited after retry
         * ------------------------------------------------- */

        if (
          groqRes.status === 429
        ) {

          /*
           * Internal diagnostic only.
           * Do NOT expose Groq organization,
           * token limits, etc. to customer.
           */

          console.error(
            'Groq rate limit remained after retry',
            {
              status:
                groqRes.status
            }
          );


          return respondJSON(
            {
              success: false,

              error:
                'AI service is temporarily busy. Please try again shortly.'
            },
            503
          );
        }


        /* -------------------------------------------------
         * Other Groq HTTP Error
         * ------------------------------------------------- */

        if (!groqRes.ok) {

          /*
           * We log only safe metadata.
           *
           * Do not return raw Groq response
           * to customer.
           */

          console.error(
            'Groq API request failed',
            {
              status:
                groqRes.status
            }
          );


          return respondJSON(
            {
              success: false,

              error:
                'AI service is temporarily unavailable. Please try again.'
            },
            502
          );
        }


        /* -------------------------------------------------
         * Parse Groq JSON
         * ------------------------------------------------- */

        let groqData;

        try {

          groqData =
            JSON.parse(
              groqRaw
            );

        } catch (e) {

          console.error(
            'Groq returned invalid JSON'
          );


          return respondJSON(
            {
              success: false,

              error:
                'AI service returned an invalid response. Please try again.'
            },
            502
          );
        }


        /* -------------------------------------------------
         * Extract SQL
         * ------------------------------------------------- */

        const sql =
          groqData
            ?.choices?.[0]
            ?.message
            ?.content
            ?.trim() || '';


        const finishReason =
          groqData
            ?.choices?.[0]
            ?.finish_reason ||
          null;


        const usage =
          groqData?.usage || {
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0
          };


        /* -------------------------------------------------
         * No SQL generated
         * ------------------------------------------------- */

        if (!sql) {

          console.error(
            'Groq returned no SQL',
            {
              finish_reason:
                finishReason,

              choices_count:
                Array.isArray(
                  groqData?.choices
                )
                  ? groqData
                    .choices
                    .length
                  : 0
            }
          );


          return respondJSON(
            {
              success: false,

              error:
                'AI could not generate a database query for that request.'
            },
            422
          );
        }


        /* -------------------------------------------------
         * SQL Safety Validation
         * ------------------------------------------------- */

        const validation =
          validateSql(sql);


        if (
          !validation.isValid
        ) {

          await env.DB
            .prepare(`
              INSERT INTO request_logs
              (
                customer_id,
                request_date,
                request_time,
                status
              )
              VALUES (
                ?,
                ?,
                ?,
                "error_unsafe"
              )
            `)
            .bind(
              customer.id,
              getKarachiDateStr(),
              getKarachiTimeStr()
            )
            .run();


          return errorResponse(
            validation.error ||
            'Generated SQL is unsafe.',
            403
          );
        }


        /* -------------------------------------------------
         * Successful Request Log
         * ------------------------------------------------- */

        await env.DB
          .prepare(`
            INSERT INTO request_logs
            (
              customer_id,
              request_date,
              request_time,
              input_tokens,
              output_tokens,
              total_tokens,
              status
            )
            VALUES (
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              "success"
            )
          `)
          .bind(
            customer.id,

            getKarachiDateStr(),

            getKarachiTimeStr(),

            usage.prompt_tokens || 0,

            usage.completion_tokens || 0,

            usage.total_tokens || 0
          )
          .run();


        /* -------------------------------------------------
         * SUCCESS
         *
         * Worker returns SQL ONLY.
         *
         * Laravel executes locally through
         * ai_readonly.
         * ------------------------------------------------- */

        return respondJSON({
          success: true,
          sql:
            validation.cleanSql
        });


      } catch (e) {

        /*
         * Network / runtime / unexpected error.
         *
         * Internal error detail is intentionally
         * NOT returned to customer.
         */

        console.error(
          'AI generation exception',
          {
            message:
              e instanceof Error
                ? e.message
                : 'Unknown error'
          }
        );


        return respondJSON(
          {
            success: false,

            error:
              'AI service is temporarily unavailable. Please try again.'
          },
          500
        );
      }
    }


    /* =====================================================
     * ADMIN LOGIN
     * ===================================================== */

    if (
      pathname ===
      '/api/admin/login' &&
      request.method === 'POST'
    ) {

      const body =
        await request
          .json()
          .catch(
            () => ({})
          );


      if (
        body.username ===
        env.ADMIN_USERNAME &&
        body.password ===
        env.ADMIN_PASSWORD
      ) {

        const token =
          await signJWT(
            {
              role: 'admin',

              exp:
                Math.floor(
                  Date.now() / 1000
                ) +
                86400
            },

            env.JWT_SECRET
          );


        return respondJSON({
          token
        });
      }


      return errorResponse(
        'Invalid credentials',
        401
      );
    }


    /* =====================================================
     * ADMIN LOGOUT
     * ===================================================== */

    if (
      pathname ===
      '/api/admin/logout' &&
      request.method === 'POST'
    ) {

      return respondJSON({
        success: true
      });
    }


    /* =====================================================
     * PROTECTED ADMIN ROUTES
     * ===================================================== */

    if (
      pathname.startsWith(
        '/api/admin/'
      )
    ) {

      const token =
        (
          request.headers
            .get(
              'Authorization'
            ) || ''
        )
          .split(' ')[1];


      if (!token) {

        return errorResponse(
          'Unauthorized',
          401
        );
      }


      const payload =
        await verifyJWT(
          token,
          env.JWT_SECRET
        );


      if (
        !payload ||
        payload.role !== 'admin' ||
        payload.exp <
        Date.now() / 1000
      ) {

        return errorResponse(
          'Unauthorized',
          401
        );
      }


      /* ===================================================
       * ADMIN DASHBOARD
       * =================================================== */

      if (
        pathname ===
        '/api/admin/dashboard' &&
        request.method === 'GET'
      ) {

        const totalCust =
          await env.DB
            .prepare(`
              SELECT
                COUNT(*) as count
              FROM customers
            `)
            .first();


        const activeCust =
          await env.DB
            .prepare(`
              SELECT
                COUNT(*) as count
              FROM customers
              WHERE status="active"
            `)
            .first();


        const blockCust =
          await env.DB
            .prepare(`
              SELECT
                COUNT(*) as count
              FROM customers
              WHERE status="blocked"
            `)
            .first();


        const dateToday =
          getKarachiDateStr();


        const reqToday =
          await env.DB
            .prepare(`
              SELECT
                COUNT(*) as count

              FROM request_logs

              WHERE request_date=?
                AND status="success"
            `)
            .bind(
              dateToday
            )
            .first();


        const startOfMonth =
          getKarachiStartOfMonth();


        const monthStats =
          await env.DB
            .prepare(`
              SELECT
                COUNT(*) as count,
                SUM(input_tokens) as in_tok,
                SUM(output_tokens) as out_tok,
                SUM(total_tokens) as tot_tok

              FROM request_logs

              WHERE request_date >= ?
                AND status="success"
            `)
            .bind(
              startOfMonth
            )
            .first();


        const recent =
          await env.DB
            .prepare(`
              SELECT
                request_date,
                COUNT(*) as count

              FROM request_logs

              WHERE status="success"

              GROUP BY request_date

              ORDER BY
                request_date DESC

              LIMIT 7
            `)
            .all();


        return respondJSON({

          totalCustomers:
            totalCust?.count || 0,

          activeCustomers:
            activeCust?.count || 0,

          blockedCustomers:
            blockCust?.count || 0,

          requestsToday:
            reqToday?.count || 0,

          requestsThisMonth:
            monthStats?.count || 0,

          inputTokensThisMonth:
            monthStats?.in_tok || 0,

          outputTokensThisMonth:
            monthStats?.out_tok || 0,

          totalTokensThisMonth:
            monthStats?.tot_tok || 0,

          recentUsage:
            (
              recent.results ||
              []
            )
              .map(
                r => ({
                  date:
                    r.request_date,

                  requests:
                    r.count
                })
              )
              .reverse()

        });
      }


      /* ===================================================
       * CUSTOMER LIST
       * =================================================== */

      if (
        pathname ===
        '/api/admin/customers' &&
        request.method === 'GET'
      ) {

        const startOfMonth =
          getKarachiStartOfMonth();

        const dateToday =
          getKarachiDateStr();


        const query = `
          SELECT
            c.id,
            c.name,
            c.status,
            c.monthly_limit,
            c.created_at,
            c.api_key_hash as api_key,

            CAST(
              IFNULL(
                SUM(
                  CASE
                    WHEN r.request_date >= ?
                    THEN 1
                    ELSE 0
                  END
                ),
                0
              )
              AS INTEGER
            ) as requests_month,

            CAST(
              IFNULL(
                SUM(
                  CASE
                    WHEN r.request_date = ?
                    THEN 1
                    ELSE 0
                  END
                ),
                0
              )
              AS INTEGER
            ) as requests_today,

            CAST(
              IFNULL(
                SUM(
                  CASE
                    WHEN r.request_date >= ?
                    THEN r.total_tokens
                    ELSE 0
                  END
                ),
                0
              )
              AS INTEGER
            ) as tokens_month

          FROM customers c

          LEFT JOIN request_logs r
            ON c.id =
              r.customer_id
            AND r.status =
              'success'

          GROUP BY c.id

          ORDER BY c.id DESC
        `;


        const { results } =
          await env.DB
            .prepare(query)
            .bind(
              startOfMonth,
              dateToday,
              startOfMonth
            )
            .all();


        return respondJSON(
          results || []
        );
      }


      /* ===================================================
       * CREATE CUSTOMER
       * =================================================== */

      if (
        pathname ===
        '/api/admin/customers' &&
        request.method === 'POST'
      ) {

        const body =
          await request
            .json()
            .catch(
              () => ({})
            );


        const name =
          body.name;

        const monthly_limit =
          body.monthly_limit;


        if (
          !name ||
          typeof name !==
          'string' ||
          name.trim() === ''
        ) {

          return errorResponse(
            'Name is required',
            400
          );
        }


        if (
          !Number.isInteger(
            monthly_limit
          ) ||
          monthly_limit <= 0
        ) {

          return errorResponse(
            'Monthly limit must be a positive integer',
            400
          );
        }


        const rawKey =
          generateRandomKey();


        /*
         * Existing raw-key storage behavior
         * intentionally preserved.
         */

        await env.DB
          .prepare(`
            INSERT INTO customers
            (
              name,
              api_key_hash,
              monthly_limit,
              status
            )
            VALUES (
              ?,
              ?,
              ?,
              "active"
            )
          `)
          .bind(
            name.trim(),
            rawKey,
            monthly_limit
          )
          .run();


        return respondJSON({
          success: true,
          api_key:
            rawKey
        });
      }


      /* ===================================================
       * CUSTOMER DETAIL / UPDATE
       * =================================================== */

      const custMatch =
        pathname.match(
          /^\/api\/admin\/customers\/(\d+)$/
        );


      if (custMatch) {

        const id =
          custMatch[1];


        const cust =
          await env.DB
            .prepare(`
              SELECT
                id,
                name,
                status,
                monthly_limit,
                api_key_hash as api_key,
                created_at

              FROM customers

              WHERE id=?
            `)
            .bind(id)
            .first();


        if (!cust) {

          return errorResponse(
            'Not found',
            404
          );
        }


        /* -----------------------------------------------
         * Customer Detail
         * ----------------------------------------------- */

        if (
          request.method === 'GET'
        ) {

          const dateToday =
            getKarachiDateStr();


          const reqToday =
            await env.DB
              .prepare(`
                SELECT
                  COUNT(*) as count

                FROM request_logs

                WHERE customer_id=?
                  AND request_date=?
                  AND status="success"
              `)
              .bind(
                id,
                dateToday
              )
              .first();


          const startOfMonth =
            getKarachiStartOfMonth();


          const mStats =
            await env.DB
              .prepare(`
                SELECT
                  COUNT(*) as count,
                  SUM(total_tokens) as tok

                FROM request_logs

                WHERE customer_id=?
                  AND request_date >= ?
                  AND status="success"
              `)
              .bind(
                id,
                startOfMonth
              )
              .first();


          const dUsage =
            await env.DB
              .prepare(`
                SELECT
                  request_date as date,

                  COUNT(*) as requests,

                  SUM(input_tokens)
                    as input_tokens,

                  SUM(output_tokens)
                    as output_tokens,

                  SUM(total_tokens)
                    as total_tokens

                FROM request_logs

                WHERE customer_id=?
                  AND status="success"

                GROUP BY request_date

                ORDER BY
                  request_date DESC

                LIMIT 30
              `)
              .bind(id)
              .all();


          return respondJSON({

            ...cust,

            requests_today:
              reqToday?.count || 0,

            requests_month:
              mStats?.count || 0,

            tokens_month:
              mStats?.tok || 0,

            daily_usage:
              dUsage.results || []

          });
        }


        /* -----------------------------------------------
         * Update Customer
         * ----------------------------------------------- */

        if (
          request.method === 'PATCH'
        ) {

          const body =
            await request
              .json()
              .catch(
                () => ({})
              );


          if (
            body.status !==
            undefined
          ) {

            if (
              body.status !==
              'active' &&
              body.status !==
              'blocked'
            ) {

              return errorResponse(
                'Invalid status',
                400
              );
            }


            await env.DB
              .prepare(`
                UPDATE customers

                SET status=?

                WHERE id=?
              `)
              .bind(
                body.status,
                id
              )
              .run();
          }


          if (
            body.monthly_limit !==
            undefined
          ) {

            if (
              !Number.isInteger(
                body.monthly_limit
              ) ||
              body.monthly_limit <= 0
            ) {

              return errorResponse(
                'Invalid limit',
                400
              );
            }


            await env.DB
              .prepare(`
                UPDATE customers

                SET monthly_limit=?

                WHERE id=?
              `)
              .bind(
                body.monthly_limit,
                id
              )
              .run();
          }


          return respondJSON({
            success: true
          });
        }
      }


      /* ===================================================
       * ROTATE CUSTOMER KEY
       * =================================================== */

      const rotateMatch =
        pathname.match(
          /^\/api\/admin\/customers\/(\d+)\/rotate-key$/
        );


      if (
        rotateMatch &&
        request.method === 'POST'
      ) {

        const id =
          rotateMatch[1];


        const cust =
          await env.DB
            .prepare(`
              SELECT id
              FROM customers
              WHERE id=?
            `)
            .bind(id)
            .first();


        if (!cust) {

          return errorResponse(
            'Not found',
            404
          );
        }


        const rawKey =
          generateRandomKey();


        await env.DB
          .prepare(`
            UPDATE customers

            SET api_key_hash=?

            WHERE id=?
          `)
          .bind(
            rawKey,
            id
          )
          .run();


        return respondJSON({
          success: true,
          api_key:
            rawKey
        });
      }


      /* ===================================================
       * USAGE
       * =================================================== */

      if (
        pathname ===
        '/api/admin/usage' &&
        request.method === 'GET'
      ) {

        const urlParams =
          new URLSearchParams(
            url.search
          );


        let p =
          urlParams.get(
            'period'
          ) || '30';


        if (
          !isValidPeriod(p)
        ) {

          return errorResponse(
            'Invalid period',
            400
          );
        }


        let since =
          getKarachiDateStr();


        if (
          p !== 'today'
        ) {

          const dateOffset =
            (
              24 *
              60 *
              60 *
              1000
            ) *
            (
              parseInt(p) - 1
            );


          const kDate =
            new Date(
              new Date()
                .toLocaleString(
                  'en-US',
                  {
                    timeZone:
                      'Asia/Karachi'
                  }
                )
            );


          const targetDate =
            new Date(
              kDate.getTime() -
              dateOffset
            );


          since =
            getKarachiDateStr(
              targetDate
            );
        }


        const cid =
          urlParams.get(
            'customer'
          ) || 'all';


        let q = `
          SELECT
            SUM(input_tokens) as i,
            SUM(output_tokens) as o,
            SUM(total_tokens) as t,
            COUNT(*) as c

          FROM request_logs

          WHERE request_date >= ?
            AND status="success"
        `;


        let dq = `
          SELECT
            request_date as date,
            COUNT(*) as requests,
            SUM(total_tokens) as tokens

          FROM request_logs

          WHERE request_date >= ?
            AND status="success"

          GROUP BY request_date

          ORDER BY request_date ASC
        `;


        let b = [
          since
        ];


        if (
          cid !== 'all'
        ) {

          q = `
            SELECT
              SUM(input_tokens) as i,
              SUM(output_tokens) as o,
              SUM(total_tokens) as t,
              COUNT(*) as c

            FROM request_logs

            WHERE request_date >= ?
              AND customer_id = ?
              AND status="success"
          `;


          dq = `
            SELECT
              request_date as date,
              COUNT(*) as requests,
              SUM(total_tokens) as tokens

            FROM request_logs

            WHERE request_date >= ?
              AND customer_id = ?
              AND status="success"

            GROUP BY request_date

            ORDER BY request_date ASC
          `;


          b.push(cid);
        }


        const totals =
          await env.DB
            .prepare(q)
            .bind(...b)
            .first();


        const daily =
          await env.DB
            .prepare(dq)
            .bind(...b)
            .all();


        return respondJSON({

          totalRequests:
            totals?.c || 0,

          inputTokens:
            totals?.i || 0,

          outputTokens:
            totals?.o || 0,

          totalTokens:
            totals?.t || 0,

          daily:
            daily.results || []

        });
      }
    }


    /* =====================================================
     * FALLBACK
     * ===================================================== */

    return new Response(
      'Not Found',
      {
        status: 404,
        headers:
          corsHeaders
      }
    );
  }
};