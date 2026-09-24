'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (!isAuthenticated) return null; // Avoid hydration mismatch / flicker

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
