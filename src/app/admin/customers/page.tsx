'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Customer, fetchApi } from '@/lib/api';
import { Plus, Search, Eye, AlertCircle, CheckCircle, Copy } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerLimit, setNewCustomerLimit] = useState(1000);
  const [creating, setCreating] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/api/admin/customers');
      setCustomers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const result = await fetchApi('/api/admin/customers', {
        method: 'POST',
        body: JSON.stringify({ name: newCustomerName, monthly_limit: newCustomerLimit })
      });
      setNewApiKey(result.api_key);
      await loadCustomers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setCreating(false);
    }
  };

  const resetModal = () => {
    setShowAddModal(false);
    setNewCustomerName('');
    setNewCustomerLimit(1000);
    setNewApiKey('');
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500">Manage API access for your users</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} /> Add Customer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="flex justify-center mb-4 text-gray-300"><Users size={48} /></div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-6">You haven't added any API customers yet.</p>
            <button onClick={() => setShowAddModal(true)} className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800">Create First Customer</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Usage / Limit</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Tokens</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Joined</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{c.name}</td>
                    <td className="p-4">
                      {c.status === 'active' ? 
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle size={12}/> Active</span> :
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle size={12}/> Blocked</span>
                      }
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="text-sm">{c.requests_month || 0} / {c.monthly_limit}</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(((c.requests_month || 0) / c.monthly_limit) * 100, 100)}%` }}></div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">{(c.tokens_month || 0).toLocaleString()}</td>
                    <td className="p-4 text-gray-500 text-sm">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Link href={`/admin/customers/${c.id}`} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg inline-flex items-center justify-center transition-colors">
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Customer</h2>
            </div>
            
            {newApiKey ? (
              <div className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4"><CheckCircle size={24} /></div>
                <h3 className="text-lg font-medium text-gray-900">API Key Created!</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                  <code className="text-sm font-mono text-gray-800 break-all">{newApiKey}</code>
                  <button onClick={() => navigator.clipboard.writeText(newApiKey)} className="ml-4 p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded">
                    <Copy size={16} />
                  </button>
                </div>
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-sm flex items-start gap-2 text-left">
                  <AlertCircle className="shrink-0 mt-0.5" size={16} />
                  <p><strong>Warning:</strong> This key will only be displayed once. Please copy and store it securely.</p>
                </div>
                <button onClick={resetModal} className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg">Close</button>
              </div>
            ) : (
              <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input type="text" required value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Limit (Requests)</label>
                  <input type="number" required min="1" value={newCustomerLimit} onChange={e => setNewCustomerLimit(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={resetModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" disabled={creating} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50">{creating ? 'Creating...' : 'Create Customer'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Users(props: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
