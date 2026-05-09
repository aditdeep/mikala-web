'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Handshake } from 'lucide-react';

export default function MarketingPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Marketing</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => router.push('/marketing/leads')}
          className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Leads</h2>
              <p className="text-gray-600 mt-1">Manage marketing leads</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push('/marketing/kerjasama')}
          className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-100 rounded-lg">
              <Handshake className="text-green-600" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Kerjasama</h2>
              <p className="text-gray-600 mt-1">Partnership management</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
