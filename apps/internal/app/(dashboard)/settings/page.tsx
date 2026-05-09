'use client';

import { useState, useEffect } from 'react';
import { authService } from '@mikala/lib';
import { Button, Input } from '@mikala/ui';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const userData = authService.getUser();
    setUser(userData);
    setName(userData?.name || '');
    setEmail(userData?.email || '');
  }, []);

  const handleSave = () => {
    // TODO: Implement save
    alert('Settings saved (not yet implemented)');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">Profile Settings</h2>
        
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="pt-4">
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Account Information</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">User ID:</span>
            <span className="font-medium">{user?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Role:</span>
            <span className="font-medium">{user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
