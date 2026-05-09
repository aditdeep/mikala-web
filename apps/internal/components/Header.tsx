'use client';

import { useState, useEffect } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService } from '@mikala/lib';

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const userData = authService.getUser();
    setUser(userData);
    // TODO: Fetch notification count
    setNotifCount(3);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name || 'User'}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900">
          <Bell size={20} />
          {notifCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifCount}
            </span>
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
              {user?.name?.[0] || 'U'}
            </div>
            <span className="text-sm font-medium">{user?.name || 'User'}</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              <button
                onClick={() => router.push('/settings')}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User size={16} />
                Profile Settings
              </button>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
