/**
 * COMPLETE CLOUDFLARE WORKER
 *
 * AI flow:
 * Laravel -> Worker -> Groq -> SQL -> Laravel
 *
 * Important:
 * - Worker NEVER executes customer SQL.
 * - Full customer schema + business definitions remain stored in D1.
 * - Only compact schema + compact semantic definitions are sent to Groq.
 * - VERIFIED business definitions override model assumptions.
 * - AMBIGUOUS metrics must never be guessed.
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

    const [header, payload, signature] = parts;

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
          .map(c => c.charCodeAt(0))
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
  const array = new Uint8Array(32);

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
    formatter.formatToParts(new Date());

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
 * SLEEP
 * ========================================================= */

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}


/* =========================================================
 * COMPACT RICH DATABASE SCHEMA + BUSINESS SEMANTICS
 * ========================================================= */

function compactSchema(schema) {
  const lines = [];

  /*
   * =======================================================
   * DATABASE TABLES / COLUMNS
   * =======================================================
   */

  if (
    schema &&
    schema.tables &&
    typeof schema.tables === 'object' &&
    !Array.isArray(schema.tables)
  ) {
    lines.push('DATABASE SCHEMA:');

    for (const [tableName, tableData] of Object.entries(schema.tables)) {
      const columns =
        Array.isArray(tableData?.columns)
          ? tableData.columns
            .map(column => {
              if (typeof column === 'string') {
                return column;
              }

              if (!column?.name) {
                return null;
              }

              const type =
                column.column_type ||
                column.type ||
                '';

              const flags = [];

              if (
                column.key === 'PRI' ||
                (
                  Array.isArray(tableData?.primary_keys) &&
                  tableData.primary_keys.includes(column.name)
                )
              ) {
                flags.push('PK');
              }

              return [
                column.name,
                type,
                ...flags
              ]
                .filter(Boolean)
                .join(':');
            })
            .filter(Boolean)
          : [];

      const tableType =
        tableData?.table_type === 'VIEW'
          ? ':VIEW'
          : '';

      lines.push(
        `${tableName}${tableType}(${columns.join(',')})`
      );

      /*
       * UNIQUE KEYS
       */

      if (
        Array.isArray(tableData?.unique_keys) &&
        tableData.unique_keys.length > 0
      ) {
        const uniqueGroups =
          tableData.unique_keys
            .filter(
              group =>
                Array.isArray(group) &&
                group.length > 0
            )
            .map(group => group.join('+'));

        if (uniqueGroups.length > 0) {
          lines.push(
            `UNIQUE ${tableName}: ${uniqueGroups.join(';')}`
          );
        }
      }
    }
  }


  /*
   * =======================================================
   * FOREIGN KEYS
   * =======================================================
   */

  if (
    Array.isArray(schema?.relationships) &&
    schema.relationships.length > 0
  ) {
    lines.push('');
    lines.push('FOREIGN KEYS:');

    for (const rel of schema.relationships) {
      if (
        rel?.from_table &&
        rel?.from_column &&
        rel?.to_table &&
        rel?.to_column
      ) {
        lines.push(
          `${rel.from_table}.${rel.from_column}` +
          '->' +
          `${rel.to_table}.${rel.to_column}`
        );
      }
    }
  }


  /*
   * =======================================================
   * BUSINESS DEFINITIONS
   * =======================================================
   */

  const businessDefinitions =
    schema?.business_definitions;

  if (
    businessDefinitions &&
    typeof businessDefinitions === 'object' &&
    !Array.isArray(businessDefinitions)
  ) {

    /*
     * =====================================================
     * VERIFIED / AMBIGUOUS METRICS
     * =====================================================
     */

    const metrics =
      businessDefinitions.metrics;

    if (
      metrics &&
      typeof metrics === 'object' &&
      !Array.isArray(metrics)
    ) {
      const verifiedMetrics = [];
      const ambiguousMetrics = [];

      for (
        const [metricName, metric]
        of Object.entries(metrics)
      ) {
        if (
          !metric ||
          typeof metric !== 'object'
        ) {
          continue;
        }

        const status =
          String(metric.status || '')
            .toUpperCase();


        /*
         * VERIFIED / DERIVED
         */

        if (
          status === 'VERIFIED' ||
          status === 'DERIVED'
        ) {
          const parts = [
            metricName,
            `status=${status}`
          ];

          if (metric.formula) {
            parts.push(
              `formula=${metric.formula}`
            );
          }

          if (metric.date_field) {
            parts.push(
              `date=${metric.date_field}`
            );
          }

          if (
            Array.isArray(metric.filters) &&
            metric.filters.length > 0
          ) {
            parts.push(
              `filters=${metric.filters.join(' AND ')}`
            );
          }

          if (
            Array.isArray(metric.tables) &&
            metric.tables.length > 0
          ) {
            parts.push(
              `tables=${metric.tables.join(',')}`
            );
          }

          /*
           * NEW:
           * Default dimension.
           */

          if (metric.default_dimension) {
            parts.push(
              `default_dimension=${metric.default_dimension}`
            );
          }

          /*
           * Keep meaning because it helps the model
           * understand what the metric represents.
           */

          if (metric.meaning) {
            parts.push(
              `meaning=${metric.meaning}`
            );
          }

          verifiedMetrics.push(
            parts.join(' | ')
          );


          /*
           * =================================================
           * METRIC-SPECIFIC SUPPORTED DIMENSIONS
           * =================================================
           */

          const supportedDimensions =
            metric.supported_dimensions;

          if (
            supportedDimensions &&
            typeof supportedDimensions === 'object' &&
            !Array.isArray(supportedDimensions) &&
            Object.keys(supportedDimensions).length > 0
          ) {
            for (
              const [dimensionName, dimension]
              of Object.entries(supportedDimensions)
            ) {
              if (
                !dimension ||
                typeof dimension !== 'object'
              ) {
                continue;
              }

              const dimensionParts = [
                `metric=${metricName}`,
                `dimension=${dimensionName}`
              ];

              if (dimension.table) {
                dimensionParts.push(
                  `table=${dimension.table}`
                );
              }

              if (dimension.join) {
                dimensionParts.push(
                  `join=${dimension.join}`
                );
              } else {
                dimensionParts.push(
                  'join=NONE'
                );
              }

              if (
                Array.isArray(dimension.group_by) &&
                dimension.group_by.length > 0
              ) {
                dimensionParts.push(
                  `group_by=${dimension.group_by.join(',')}`
                );
              }

              verifiedMetrics.push(
                `DIMENSION ${dimensionParts.join(' | ')}`
              );
            }
          }
        }


        /*
         * AMBIGUOUS
         */

        else if (
          status === 'AMBIGUOUS'
        ) {
          const parts = [
            metricName,
            'status=AMBIGUOUS',
            'formula=NOT_VERIFIED'
          ];

          if (metric.meaning) {
            parts.push(
              `reason=${metric.meaning}`
            );
          }

          ambiguousMetrics.push(
            parts.join(' | ')
          );
        }
      }


      if (verifiedMetrics.length > 0) {
        lines.push('');
        lines.push(
          'VERIFIED BUSINESS METRICS AND DIMENSIONS:'
        );

        for (const metricLine of verifiedMetrics) {
          lines.push(metricLine);
        }
      }


      if (ambiguousMetrics.length > 0) {
        lines.push('');
        lines.push(
          'AMBIGUOUS BUSINESS METRICS:'
        );

        for (const metricLine of ambiguousMetrics) {
          lines.push(metricLine);
        }
      }
    }


    /*
     * =====================================================
     * GLOBAL BUSINESS DIMENSIONS
     * =====================================================
     */

    const dimensions =
      businessDefinitions.dimensions;

    if (
      dimensions &&
      typeof dimensions === 'object' &&
      !Array.isArray(dimensions)
    ) {
      const dimensionLines = [];

      for (
        const [dimensionName, dimension]
        of Object.entries(dimensions)
      ) {
        if (
          !dimension ||
          typeof dimension !== 'object'
        ) {
          continue;
        }

        const parts = [
          dimensionName
        ];

        if (dimension.table) {
          parts.push(
            `table=${dimension.table}`
          );
        }

        if (dimension.id_column) {
          parts.push(
            `id=${dimension.id_column}`
          );
        }

        if (dimension.label_column) {
          parts.push(
            `label=${dimension.label_column}`
          );
        }

        if (dimension.meaning) {
          parts.push(
            `meaning=${dimension.meaning}`
          );
        }

        dimensionLines.push(
          parts.join(' | ')
        );
      }


      if (dimensionLines.length > 0) {
        lines.push('');
        lines.push(
          'BUSINESS DIMENSIONS:'
        );

        for (
          const dimensionLine
          of dimensionLines
        ) {
          lines.push(dimensionLine);
        }
      }
    }


    /*
     * =====================================================
     * GENERIC DIMENSION REASONING RULES
     * =====================================================
     */

    const dimensionRules =
      businessDefinitions.dimension_rules;

    if (
      Array.isArray(dimensionRules) &&
      dimensionRules.length > 0
    ) {
      lines.push('');
      lines.push(
        'METRIC DIMENSION RULES:'
      );

      for (const rule of dimensionRules) {
        if (
          typeof rule === 'string' &&
          rule.trim()
        ) {
          lines.push(
            `- ${rule.trim()}`
          );
        }
      }
    }


    /*
     * =====================================================
     * COLUMN SEMANTICS
     * =====================================================
     */

    const columnDefinitions =
      businessDefinitions.columns;

    if (
      columnDefinitions &&
      typeof columnDefinitions === 'object' &&
      !Array.isArray(columnDefinitions)
    ) {
      const semanticLines = [];

      for (
        const [columnName, definition]
        of Object.entries(columnDefinitions)
      ) {
        if (
          !definition ||
          typeof definition !== 'object'
        ) {
          continue;
        }

        const parts = [
          columnName
        ];

        if (definition.meaning) {
          parts.push(
            definition.meaning
          );
        }

        if (definition.warning) {
          parts.push(
            `WARNING: ${definition.warning}`
          );
        }

        if (parts.length > 1) {
          semanticLines.push(
            parts.join(' = ')
          );
        }
      }


      if (semanticLines.length > 0) {
        lines.push('');
        lines.push(
          'BUSINESS COLUMN SEMANTICS:'
        );

        for (
          const semanticLine
          of semanticLines
        ) {
          lines.push(semanticLine);
        }
      }
    }


    /*
     * =====================================================
     * GLOBAL BUSINESS RULES
     * =====================================================
     */

    const businessRules =
      businessDefinitions.rules;

    if (
      Array.isArray(businessRules) &&
      businessRules.length > 0
    ) {
      lines.push('');
      lines.push(
        'GLOBAL BUSINESS RULES:'
      );

      for (const rule of businessRules) {
        if (
          typeof rule === 'string' &&
          rule.trim()
        ) {
          lines.push(
            `- ${rule.trim()}`
          );
        }
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


  /*
   * Extra CTE check.
   *
   * WITH is allowed only when the statement ultimately
   * contains a SELECT.
   */

  if (
    upperSql.startsWith('WITH') &&
    !/\bSELECT\b/i.test(cleanSql)
  ) {
    return {
      isValid: false,
      error:
        'WITH statement must contain a SELECT query.'
    };
  }


  return {
    isValid: true,
    cleanSql
  };
}


/* =========================================================
 * GROQ REQUEST
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
          `You generate accurate read-only MySQL queries from natural-language business questions.

The user may write in English, Urdu, Roman Urdu, mixed language, and may use informal or imperfect spelling.

You are given:

1. DATABASE SCHEMA
2. FOREIGN-KEY RELATIONSHIPS
3. VERIFIED BUSINESS METRICS
4. BUSINESS COLUMN SEMANTICS
5. POSSIBLY AMBIGUOUS BUSINESS METRICS

These definitions come from the customer's actual application source code.

OUTPUT CONTRACT:

You are a SQL generator, not a conversational assistant.

Your response MUST start with SELECT or WITH.

Return exactly ONE valid read-only MySQL SELECT or WITH query.

Return ONLY SQL.

Never return:
- explanations
- apologies
- conversational answers
- markdown
- code fences
- comments
- "SQL:"
- "I cannot"
- "I don't know"
- any text before or after the SQL

IMPORTANT DATABASE LOOKUP RULE:

You do NOT need to know the actual values stored in the customer's database.

Your job is to generate SQL that retrieves the requested value from the customer's local database.

For example, requests such as:

"fasal rana ka number"
"fasal rana ka phone number"
"what is phone number of fasal rana"
"ali ka balance"
"ABC product ki price kia hai"
"ABC ka stock kitna hai"

are DATABASE LOOKUP requests.

Generate a SELECT query using ONLY the actual tables and columns available in DATABASE SCHEMA.

Common English / Urdu / Roman Urdu meanings:

"ka number" = phone/contact/mobile number
"phone number" = phone/contact/mobile number
"mobile number" = phone/contact/mobile number
"ka balance" = balance
"kitna balance" = balance
"price kia hai" = price
"rate kia hai" = price/rate
"stock kitna hai" = stock/quantity
"quantity kitni hai" = stock/quantity
"address kia hai" = address

For customer, supplier, product, item, or person name searches, prefer case-insensitive partial matching where appropriate.

For example:

LOWER(name_column) LIKE LOWER('%search text%')

The actual table and column names MUST come from DATABASE SCHEMA.

Do NOT refuse a lookup merely because the actual phone number, balance, price, stock, address, or other requested value is not present in the schema.

The schema describes WHERE the data is stored.

The customer's local database contains the actual values.

Your job is only to generate SQL that retrieves those values.

STRICT PRIORITY:

VERIFIED BUSINESS DEFINITIONS ARE THE SOURCE OF TRUTH.

If a VERIFIED metric provides a formula, date field, tables, or filters, use those definitions instead of inventing another formula from column names.

STRICT RULES:

1. Never invent a table, column, relationship, stored value, business rule, or unsupported formula.

2. When the user's question corresponds to a VERIFIED business metric, use its verified formula.

3. Do NOT replace a verified formula with a mathematically similar formula.

For example:

If line_item_revenue is defined as:

SUM(sales_items.total)

you MUST NOT replace it with:

SUM(sales_items.quantity * sales_items.price)

unless the verified definition explicitly allows that.

4. Column names such as:

price
total
total_amount
final_amount
amount
cost
cost_price
paid
due
balance

do NOT automatically have interchangeable meanings.

Use BUSINESS COLUMN SEMANTICS where provided.

5. Pay special attention to warnings attached to columns.

A WARNING is a hard business constraint.

6. If a metric is marked AMBIGUOUS, do NOT invent or approximate its formula.

If the user specifically requests an AMBIGUOUS metric and no verified alternative answers the question, do not fabricate a calculation.

AMBIGUOUS BUSINESS METRICS apply to calculations whose business formula is not safely known.

They do NOT prevent ordinary database lookups.

Phone numbers, customer balances, supplier details, product details, stock, invoice details, names, addresses, and other directly stored database fields should be retrieved with a normal SELECT query when those fields exist in the supplied schema.

7. Understand table granularity before using JOIN, SUM, COUNT, AVG, MIN, MAX or other aggregation.

8. Be especially careful with one-to-many relationships.

A parent row may appear multiple times after joining to child rows.

9. Never SUM a parent-level monetary value after a one-to-many JOIN when doing so duplicates the parent value.

10. When a calculation combines parent-level amounts with child-level amounts, aggregate child rows to the parent key first when necessary.

11. Use the provided foreign-key relationships when determining joins.

Do not infer a relationship merely because columns have similar names.

12. For financial calculations including sales, revenue, profit, cost, purchases, stock, payments, balances, expenses and returns, respect the verified business definitions and natural row granularity.

13. Never invent discount behavior, tax behavior, return behavior, profit formulas, revenue formulas, stock formulas, balance formulas or accounting adjustments not supported by the supplied definitions.

14. Prefer directly stored canonical values where the business definitions identify them.

15. For textual searches such as customer, supplier, product, item and name, prefer safe case-insensitive partial matching where appropriate.

16. The user's spelling may be imperfect.

Use reasonable partial matching, but never invent a stored value.

17. For relative date requests such as today, yesterday, last week, last month or last 2 months, use the VERIFIED metric date field when one is supplied.

18. If a VERIFIED metric specifies filters such as:

sales.status = 'completed'

apply those filters.

19. Generate exactly ONE read-only SELECT or WITH query.

20. Never generate INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, TRUNCATE, REPLACE, GRANT or REVOKE.

21. Return SQL only.

22. Do not return markdown.

23. Do not explain the SQL.

24. Do not return comments.

25. The application may append a safety LIMIT to the returned query, so produce SQL that remains valid with a trailing LIMIT.

IMPORTANT TILE / UNIT RULE:

If the supplied business semantics say:

sales_items.quantity = physical pieces or tiles

and:

sales_items.price = price per piece OR price per SQM depending on product

then NEVER universally calculate revenue as:

sales_items.quantity * sales_items.price

Use the canonical revenue field/formula supplied by the VERIFIED business definitions.

IMPORTANT PROFIT RULE:

If gross_profit is VERIFIED as:

SUM(
  sales_items.total -
  (
    sales_items.quantity *
    sales_items.cost_price
  )
)

use that exact business logic.

Do NOT replace it with:

SUM(
  (
    sales_items.price -
    sales_items.cost_price
  ) *
  sales_items.quantity
)

because sales_items.price and sales_items.quantity may use different units.

CUSTOMER DATABASE CONTEXT:

${compactCustomerSchema}`
      },

      {
        role: 'user',
        content:
          question.trim()
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
   * Exactly one retry on Groq 429.
   */

  if (
    response.status === 429
  ) {

    try {
      await response.text();
    } catch (e) {
      // Ignore.
    }

    await sleep(1000);

    response =
      await makeRequest();
  }


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
      allowedOrigins.includes(origin)
    ) {

      corsHeaders[
        'Access-Control-Allow-Origin'
      ] = origin;
    }


    if (
      request.method === 'OPTIONS'
    ) {

      if (
        origin &&
        !allowedOrigins.includes(origin)
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
          headers:
            corsHeaders
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
       * IMPORTANT:
       *
       * Existing installation currently stores the
       * customer key directly in api_key_hash.
       *
       * Preserve this behavior for compatibility.
       * Do not switch to hashApiKey() here without a
       * proper migration of existing customer keys.
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


      /*
       * business_definitions is intentionally accepted
       * as part of body.schema.
       *
       * Expected root structure:
       *
       * {
       *   tables: {...},
       *   relationships: [...],
       *   business_definitions: {
       *     metrics: {...},
       *     columns: {...}
       *   }
       * }
       *
       * The Worker does NOT need a separate D1 column.
       * The complete object remains inside schema_json.
       */


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
       * Store the FULL rich schema.
       *
       * This includes:
       *
       * tables
       * relationships
       * business_definitions
       *
       * No customer business rows should be present.
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
     * ===================================================== */

    if (
      pathname ===
      '/api/ai/sql' &&
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


      /* ===================================================
       * MONTHLY LIMIT
       * =================================================== */

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


      /* ===================================================
       * LOAD FULL SCHEMA + BUSINESS DEFINITIONS
       * =================================================== */

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


      /*
       * ===================================================
       * BASIC STORED SCHEMA VALIDATION
       * ===================================================
       *
       * We require tables because without the actual DB
       * structure Groq must not generate SQL.
       */

      if (
        !customerSchema ||
        typeof customerSchema !==
        'object' ||
        Array.isArray(customerSchema) ||
        !customerSchema.tables ||
        typeof customerSchema.tables !==
        'object'
      ) {

        return errorResponse(
          'Stored database schema is invalid',
          500
        );
      }


      /* ===================================================
       * COMPACT RICH SCHEMA + SEMANTIC DEFINITIONS
       * ===================================================
       *
       * compactSchema() now extracts:
       *
       * - tables
       * - column types
       * - PKs
       * - unique keys
       * - FKs
       * - VERIFIED metrics
       * - DERIVED metrics
       * - AMBIGUOUS metrics
       * - column meanings
       * - business warnings
       *
       * Full JSON remains in D1.
       * Only this compact representation goes to Groq.
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


      /* ===================================================
       * QUESTION
       * =================================================== */

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


      /*
       * Keep an upper bound on question size.
       *
       * Normal POS questions are tiny. This prevents a
       * client from unnecessarily inflating Groq context.
       */

      if (
        question.trim().length > 4000
      ) {

        return errorResponse(
          'Question is too long.',
          400
        );
      }


      /* ===================================================
       * GROQ
       * =================================================== */

      try {

        const groqRes =
          await callGroq(
            env,
            compactCustomerSchema,
            question
          );


        const groqRaw =
          await groqRes.text();


        /*
         * Still rate limited after the ONE retry performed
         * inside callGroq().
         */

        if (
          groqRes.status === 429
        ) {

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


        /*
         * Any other upstream Groq error.
         *
         * Do NOT expose raw Groq response because it may
         * contain internal account / organization details.
         */

        if (!groqRes.ok) {

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


        /* =================================================
         * PARSE GROQ RESPONSE
         * ================================================= */

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


        /*
         * No SQL was generated.
         *
         * This can happen when:
         *
         * - request is not a DB question
         * - requested metric is intentionally ambiguous
         * - model cannot safely construct SQL
         */

        if (!sql) {

          console.error(
            'Groq returned no SQL',
            {
              finish_reason:
                finishReason
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


        /* =================================================
         * SQL VALIDATION
         * ================================================= */

        const validation =
          validateSql(sql);


        if (
          !validation.isValid
        ) {

          /*
           * Log only safe metadata.
           *
           * Do NOT store:
           * - question
           * - generated SQL
           * - business data
           */

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


        /* =================================================
         * LOG SUCCESS
         * ================================================= */

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


        /*
         * IMPORTANT:
         *
         * Worker returns SQL only.
         *
         * Worker NEVER connects to or executes against the
         * customer's local POS database.
         *
         * Laravel receives this SQL, independently validates
         * it again, then executes through ai_readonly.
         *
         * Query results never need to be sent back to Groq.
         */

        return respondJSON({
          success: true,

          sql:
            validation.cleanSql
        });


      } catch (e) {

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


    /*
     * =====================================================
     *
     * PART 3 CONTINUES HERE
     *
     * DO NOT CLOSE:
     *
     *   async fetch(...)
     *   export default
     *
     * yet.
     *
     * Part 3 starts with ADMIN LOGIN and finishes the file.
     *
     * =====================================================
     */
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


        /*
         * IMPORTANT:
         *
         * Current production compatibility:
         * the generated raw customer key is stored in
         * api_key_hash.
         *
         * Do not change this to SHA-256 here until the
         * existing customer-key migration is performed.
         */

        const rawKey =
          generateRandomKey();


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


        /* ===============================================
         * GET CUSTOMER
         * =============================================== */

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


        /* ===============================================
         * UPDATE CUSTOMER
         * =============================================== */

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


        /*
         * Inclusive date range:
         *
         * today = today
         * 7     = today + previous 6 days
         * 30    = today + previous 29 days
         */

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