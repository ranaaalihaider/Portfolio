'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Activity, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const menu = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Usage', href: '/admin/usage', icon: Activity },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col shadow-xl">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-emerald-400">AI API Admin</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
