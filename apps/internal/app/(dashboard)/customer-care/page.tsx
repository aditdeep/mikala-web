'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Briefcase } from 'lucide-react';

export default function CustomerCarePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Customer Care</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => router.push('/customer-care/klien')}
          className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Manage Klien</h2>
              <p className="text-gray-600 mt-1">View and manage client registrations</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push('/customer-care/layanan')}
          className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-100 rounded-lg">
              <Briefcase className="text-green-600" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Service Orders</h2>
              <p className="text-gray-600 mt-1">Create and manage service orders</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
