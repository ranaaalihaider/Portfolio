export const API_BASE = process.env.NEXT_PUBLIC_AI_API_BASE_URL || 'http://127.0.0.1:8787';

export interface Customer {
  id: number;
  name: string;
  status: 'active' | 'blocked';
  monthly_limit: number;
  created_at: string;
  requests_today?: number;
  requests_month?: number;
  tokens_month?: number;
  api_key?: string;
}

export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  blockedCustomers: number;
  requestsToday: number;
  requestsThisMonth: number;
  inputTokensThisMonth: number;
  outputTokensThisMonth: number;
  totalTokensThisMonth: number;
  recentUsage: { date: string; requests: number }[];
}

export interface UsageStats {
  totalRequests: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  daily: { date: string; requests: number; tokens: number }[];
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('adminToken') || '';
  }

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err) {
    if (err instanceof Error && err.message === 'Failed to fetch') {
      throw new Error(`Network Error: Browser blocked the request to ${API_BASE}. Open your Browser's Developer Tools -> Console to see the exact reason (Usually missing NEXT_PUBLIC_AI_API_BASE_URL, wrong URL, or a CORS block).`);
    }
    throw err;
  }

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      // Let the layout or component handle the redirect to avoid window.location errors
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'API Error');
  }

  return res.json();
}
