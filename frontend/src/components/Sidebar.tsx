'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Todos', href: '/dashboard', icon: '✅' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1E293B] border-r border-[#334155] flex flex-col">
      <div className="p-6 border-b border-[#334155]">
        <h1 className="text-xl font-bold text-white font-mono tracking-tight">
          PrimeTrade<span className="text-[#3B82F6]">.ai</span>
        </h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-[#94A3B8] hover:bg-[#334155] hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#334155]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded text-sm font-medium text-[#94A3B8] hover:bg-[#334155] hover:text-white transition-colors"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
