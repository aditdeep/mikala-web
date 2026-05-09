'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@mikala/lib';
import { Card, CardContent, Button } from '@mikala/ui';
import { User, Phone, Mail, MapPin, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = authService.getUser();
    setUser(userData);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/auth/login');
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.[0] || 'K'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name || 'Client'}</h2>
              <p className="text-gray-600">{user?.profile?.type || 'Individual'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 py-3 border-b">
              <Mail className="text-gray-400" size={20} />
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium">{user?.email || '-'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 border-b">
              <Phone className="text-gray-400" size={20} />
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <div className="font-medium">{user?.profile?.phone || '-'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 border-b">
              <MapPin className="text-gray-400" size={20} />
              <div>
                <div className="text-sm text-gray-600">Address</div>
                <div className="font-medium">{user?.profile?.address || '-'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700"
      >
        <LogOut size={20} className="mr-2" />
        Logout
      </Button>
    </div>
  );
}
