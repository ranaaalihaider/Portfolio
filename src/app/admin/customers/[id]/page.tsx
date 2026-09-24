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

  useEffect(() => {
    loadCustomer();
  }, [unwrappedParams.id]);

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
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link href="/admin/customers" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft size={16} /> Back to Customers
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
          <p className="text-gray-500">Customer ID: {customer.id} • Joined {new Date(customer.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={updateLimit} disabled={updating} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Edit2 size={16} /> Edit Limit
          </button>
          <button onClick={toggleStatus} disabled={updating} className={`px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors ${customer.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
            {customer.status === 'active' ? <><Ban size={16}/> Block</> : <><CheckCircle size={16}/> Activate</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
          <p className={`text-xl font-bold ${customer.status === 'active' ? 'text-emerald-600' : 'text-red-600'}`}>
            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Monthly Limit</h3>
          <p className="text-xl font-bold text-gray-900">{customer.monthly_limit.toLocaleString()} <span className="text-sm font-normal text-gray-400">requests</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Usage This Month</h3>
          <p className="text-xl font-bold text-gray-900">{customer.requests_month?.toLocaleString() || 0} <span className="text-sm font-normal text-gray-400">requests</span></p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">API Access</h2>
          <button onClick={rotateKey} disabled={rotating} className="text-sm px-3 py-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg font-medium flex items-center gap-1 transition-colors">
            <RotateCcw size={14} /> Rotate Key
          </button>
        </div>
        
        {newKey ? (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
            <h4 className="text-emerald-800 font-medium mb-2">New API Key Generated</h4>
            <div className="flex items-center justify-between bg-white p-2 border border-emerald-100 rounded">
              <code className="text-sm text-gray-800 break-all">{newKey}</code>
              <button onClick={() => copyToClipboard(newKey)} className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Copy to clipboard">
                <Copy size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <h4 className="text-gray-700 font-medium mb-2">Current API Key</h4>
            <div className="flex items-center justify-between bg-white p-2 border border-gray-200 rounded">
              <code className="text-sm text-gray-800 break-all select-all">
                {customer.api_key ? (showKey ? customer.api_key : '•'.repeat(40)) : 'Not available'}
              </code>
              {customer.api_key && (
                <div className="flex items-center gap-1">
                  <button onClick={() => setShowKey(!showKey)} className="p-2 hover:bg-gray-100 rounded-md transition-colors" title={showKey ? "Hide key" : "Show key"}>
                    {showKey ? <EyeOff size={16} className="text-gray-500" /> : <Eye size={16} className="text-gray-500" />}
                  </button>
                  <button onClick={() => copyToClipboard(customer.api_key!)} className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Copy to clipboard">
                    <Copy size={16} className="text-gray-500" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-amber-600 mt-2 font-medium">Warning: Due to a recent setting change, older keys may show as hashed. Rotate the key to generate a new viewable plain text key.</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Usage</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Requests</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Input Tokens</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Output Tokens</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Total Tokens</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customer.daily_usage && customer.daily_usage.length > 0 ? (
              customer.daily_usage.map((usage: Usage, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-900">{usage.date}</td>
                  <td className="p-4 text-gray-600">{usage.requests}</td>
                  <td className="p-4 text-gray-600">{usage.input_tokens.toLocaleString()}</td>
                  <td className="p-4 text-gray-600">{usage.output_tokens.toLocaleString()}</td>
                  <td className="p-4 text-gray-900 font-medium">{usage.total_tokens.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">No usage recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
