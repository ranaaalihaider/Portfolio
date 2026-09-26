'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { ArrowLeft, Edit2, RotateCcw, Ban, CheckCircle, Copy, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

interface Usage {
  date: string;
  requests: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}
interface RequestLog {
  id: number;
  request_date: string;
  request_time: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  status: string;
}
interface Customer {
  id: number;
  name: string;
  status: string;
  monthly_limit: number;
  created_at: string;
  requests_month?: number;
  daily_usage?: Usage[];
  api_key?: string;
}

export default function CustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rotating, setRotating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showKey, setShowKey] = useState(false);
  
  const [newKey, setNewKey] = useState('');
  
  const [requests, setRequests] = useState<RequestLog[]>([]);
  const [requestsPage, setRequestsPage] = useState(1);
  const [requestsTotalPages, setRequestsTotalPages] = useState(1);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    loadCustomer();
  }, [unwrappedParams.id]);

  useEffect(() => {
    if (unwrappedParams.id) {
      loadRequests(requestsPage);
    }
  }, [unwrappedParams.id, requestsPage]);

  const loadRequests = async (pageNum: number) => {
    try {
      setLoadingRequests(true);
      const data = await fetchApi(`/api/admin/customers/${unwrappedParams.id}/requests?page=${pageNum}`);
      setRequests(data.requests || []);
      setRequestsTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('API Key copied to clipboard!');
  };

  const loadCustomer = async () => {
    try {
      setLoading(true);
      const data = await fetchApi(`/api/admin/customers/${unwrappedParams.id}`);
      setCustomer(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!customer) return;
    if (!confirm(`Are you sure you want to ${customer.status === 'active' ? 'block' : 'activate'} this customer?`)) return;
    setUpdating(true);
    try {
      await fetchApi(`/api/admin/customers/${unwrappedParams.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: customer.status === 'active' ? 'blocked' : 'active' })
      });
      await loadCustomer();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setUpdating(false);
    }
  };

  const updateLimit = async () => {
    if (!customer) return;
    const limit = prompt('Enter new monthly limit:', customer.monthly_limit.toString());
    if (!limit || isNaN(Number(limit))) return;
    setUpdating(true);
    try {
      await fetchApi(`/api/admin/customers/${unwrappedParams.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ monthly_limit: Number(limit) })
      });
      await loadCustomer();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setUpdating(false);
    }
  };

  const rotateKey = async () => {
    if (!confirm('Are you sure you want to rotate the API key? The old key will immediately stop working.')) return;
    setRotating(true);
    try {
      const result = await fetchApi(`/api/admin/customers/${unwrappedParams.id}/rotate-key`, { method: 'POST' });
      setNewKey(result.api_key);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setRotating(false);
    }
  };

  if (loading) return <div>Loading customer details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!customer) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden pb-12">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#f3f4f6] to-transparent pointer-events-none" />
      <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute -top-[200px] -left-[200px] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="space-y-8 max-w-6xl mx-auto px-6 relative z-10 pt-8">
        <Link href="/admin/customers" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-all hover:-translate-x-1">
          <ArrowLeft size={16} /> Back to Customers
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{customer.name}</h1>
              {customer.status === 'active' ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Blocked
                </span>
              )}
            </div>
            <p className="text-gray-500 font-medium">
              Customer ID: <span className="text-gray-700">{customer.id}</span> <span className="mx-2">•</span> Joined {new Date(customer.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={updateLimit} disabled={updating} className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm text-gray-700 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all flex items-center gap-2 font-medium">
              <Edit2 size={16} className="text-gray-400" /> Edit Limit
            </button>
            <button onClick={toggleStatus} disabled={updating} className={`px-4 py-2.5 rounded-xl text-white font-semibold flex items-center gap-2 transition-all shadow-sm hover:shadow-md ${customer.status === 'active' ? 'bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border border-red-700/50' : 'bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border border-emerald-700/50'}`}>
              {customer.status === 'active' ? <><Ban size={16}/> Block Access</> : <><CheckCircle size={16}/> Activate Access</>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out fill-mode-both" style={{ animationDelay: '100ms' }}>
          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 relative overflow-hidden group hover:border-gray-200 transition-colors">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${customer.status === 'active' ? 'from-emerald-400/10' : 'from-red-400/10'} to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity`} />
            <h3 className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-2">Status</h3>
            <p className={`text-3xl font-extrabold tracking-tight ${customer.status === 'active' ? 'text-emerald-600' : 'text-red-600'}`}>
              {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 relative overflow-hidden group hover:border-gray-200 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-2">Monthly Limit</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold tracking-tight text-gray-900">{customer.monthly_limit.toLocaleString()}</p>
              <span className="text-sm font-medium text-gray-400">reqs</span>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 relative overflow-hidden group hover:border-gray-200 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400/10 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-2">Usage This Month</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold tracking-tight text-gray-900">{customer.requests_month?.toLocaleString() || 0}</p>
              <span className="text-sm font-medium text-gray-400">reqs</span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">API Access Config</h2>
              <p className="text-sm text-gray-500 mt-1">Manage and securely view the API key for this integration.</p>
            </div>
            <button onClick={rotateKey} disabled={rotating} className="text-sm px-4 py-2 bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 border border-amber-600/30 text-amber-950 shadow-sm rounded-xl font-semibold flex items-center gap-2 transition-all">
              <RotateCcw size={16} className={rotating ? "animate-spin" : ""} /> {rotating ? 'Rotating...' : 'Rotate Key'}
            </button>
          </div>
          
          {newKey ? (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 border border-emerald-200/60 p-6 rounded-2xl">
              <h4 className="text-emerald-800 font-bold mb-3 flex items-center gap-2"><CheckCircle size={18} /> New API Key Generated</h4>
              <p className="text-sm text-emerald-600/80 mb-4 font-medium">Please copy this key now. It will be stored securely and might not be fully visible later.</p>
              <div className="flex items-center justify-between bg-white p-3 border border-emerald-100 rounded-xl shadow-sm">
                <code className="text-sm font-mono text-gray-800 break-all select-all pl-2">{newKey}</code>
                <button onClick={() => copyToClipboard(newKey)} className="p-2 ml-4 bg-emerald-100/50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors flex-shrink-0" title="Copy to clipboard">
                  <Copy size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-gray-50/50 border border-gray-200/60 p-6 rounded-2xl">
              <h4 className="text-gray-800 font-bold mb-4">Current API Key</h4>
              <div className="flex items-center justify-between bg-white p-3 border border-gray-200 rounded-xl shadow-sm">
                <code className="text-sm font-mono text-gray-800 break-all select-all pl-2 tracking-wider">
                  {customer.api_key ? (showKey ? customer.api_key : '••••••••••••••••••••••••••••••••••••••••') : 'Not available'}
                </code>
                {customer.api_key && (
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <button onClick={() => setShowKey(!showKey)} className="p-2 bg-gray-100/80 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors" title={showKey ? "Hide key" : "Show key"}>
                      {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button onClick={() => copyToClipboard(customer.api_key!)} className="p-2 bg-gray-100/80 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors" title="Copy to clipboard">
                      <Copy size={18} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-amber-600/90 mt-4 font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                Due to security hashing, older keys may only show dots. Rotate the key to generate a viewable plain text key.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out fill-mode-both" style={{ animationDelay: '300ms' }}>
          <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Request Logs</h2>
              <p className="text-sm text-gray-500 mt-1">Detailed breakdown of AI query executions.</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
              <button 
                onClick={() => setRequestsPage(p => Math.max(1, p - 1))}
                disabled={requestsPage === 1 || loadingRequests}
                className="px-4 py-1.5 bg-white border border-gray-200/60 shadow-sm text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:shadow-none transition-all font-medium text-sm"
              >
                Prev
              </button>
              <span className="text-sm font-semibold text-gray-600 min-w-[70px] text-center">
                {requestsPage} / {requestsTotalPages || 1}
              </span>
              <button 
                onClick={() => setRequestsPage(p => Math.min(requestsTotalPages, p + 1))}
                disabled={requestsPage === requestsTotalPages || loadingRequests}
                className="px-4 py-1.5 bg-white border border-gray-200/60 shadow-sm text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:shadow-none transition-all font-medium text-sm"
              >
                Next
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="p-4 pl-8 text-xs font-bold text-gray-500 uppercase tracking-wider">Date / Time</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Input Tokens</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Output Tokens</th>
                  <th className="p-4 pr-8 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total Tokens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loadingRequests ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                        <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
                        <span className="text-sm font-medium animate-pulse">Loading logs...</span>
                      </div>
                    </td>
                  </tr>
                ) : requests && requests.length > 0 ? (
                  requests.map((req: RequestLog, idx: number) => (
                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-4 pl-8">
                        <div className="font-medium text-gray-900">{req.request_date}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{req.request_time}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-semibold border ${req.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-600 font-mono text-sm">{req.input_tokens?.toLocaleString() || 0}</td>
                      <td className="p-4 text-right text-gray-600 font-mono text-sm">{req.output_tokens?.toLocaleString() || 0}</td>
                      <td className="p-4 pr-8 text-right font-mono text-sm">
                        <span className="inline-block bg-gray-100/80 group-hover:bg-white text-gray-900 px-3 py-1 rounded-lg font-bold border border-gray-200/60 shadow-sm transition-colors">
                          {req.total_tokens?.toLocaleString() || 0}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                          <EyeOff size={20} className="text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium">No request logs found for this customer.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
