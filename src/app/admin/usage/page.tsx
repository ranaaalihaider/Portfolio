'use client';
import { useEffect, useState } from 'react';
import { UsageStats, fetchApi } from '@/lib/api';
import { Activity, Database, Key } from 'lucide-react';

export default function UsagePage() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('30');
  const [customerId, setCustomerId] = useState('all');

  useEffect(() => {
    loadUsage();
  }, [period, customerId]);

  const loadUsage = async () => {
    try {
      setLoading(true);
      const data = await fetchApi(`/api/admin/usage?period=${period}&customer=${customerId}`);
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usage Analytics</h1>
          <p className="text-gray-500">Monitor API requests and token consumption</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={customerId} 
            onChange={e => setCustomerId(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="all">All Customers</option>
            {/* Real implementation would fetch and list customers here */}
          </select>
          <div className="bg-white border border-gray-200 rounded-lg flex p-1">
            {['today', '7', '30'].map(p => (
              <button 
                key={p} 
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${period === p ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {p === 'today' ? 'Today' : `${p} Days`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!stats || loading ? (
        <div className="p-12 text-center text-gray-500 animate-pulse">Loading analytics...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Total Requests', value: stats.totalRequests.toLocaleString(), icon: Activity, color: 'text-blue-500' },
              { title: 'Total Tokens', value: stats.totalTokens.toLocaleString(), icon: Database, color: 'text-indigo-500' },
              { title: 'Input Tokens', value: stats.inputTokens.toLocaleString(), icon: Key, color: 'text-amber-500' },
              { title: 'Output Tokens', value: stats.outputTokens.toLocaleString(), icon: Key, color: 'text-emerald-500' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2 text-gray-500">
                  <stat.icon size={18} className={stat.color} />
                  <h3 className="text-sm font-medium">{stat.title}</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Daily Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Requests</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Tokens</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.daily.map((day, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-4 text-gray-900">{day.date}</td>
                      <td className="p-4 text-gray-600">{day.requests}</td>
                      <td className="p-4 text-gray-600">{day.tokens.toLocaleString()}</td>
                    </tr>
                  ))}
                  {stats.daily.length === 0 && (
                    <tr><td colSpan={3} className="p-8 text-center text-gray-500">No usage data for this period.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
