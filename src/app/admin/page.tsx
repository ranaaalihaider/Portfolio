'use client';
import { useEffect, useState } from 'react';
import { DashboardStats, fetchApi } from '@/lib/api';
import { Users, UserCheck, UserX, Activity, Zap, Database } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApi('/api/admin/dashboard')
      .then(setStats)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse">Loading dashboard...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!stats) return null;

  const statCards = [
    { title: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Active Customers', value: stats.activeCustomers, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Blocked Customers', value: stats.blockedCustomers, icon: UserX, color: 'text-red-500', bg: 'bg-red-50' },
    { title: 'Requests Today', value: stats.requestsToday, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'Requests This Month', value: stats.requestsThisMonth, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { title: 'Total Tokens (Month)', value: stats.totalTokensThisMonth.toLocaleString(), icon: Database, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your AI API platform usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-4 rounded-full ${card.bg} ${card.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Basic daily usage visualization */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Usage (Last 7 Days)</h3>
        <div className="h-64 flex items-end gap-2">
          {stats.recentUsage.map((day, idx) => {
            const max = Math.max(...stats.recentUsage.map(d => d.requests), 1);
            const height = `${(day.requests / max) * 100}%`;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-emerald-100 rounded-t-sm relative group-hover:bg-emerald-200 transition-colors" style={{ height }}>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap transition-opacity">
                    {day.requests} requests
                  </div>
                </div>
                <span className="text-xs text-gray-500">{day.date.substring(5)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
