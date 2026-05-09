'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Wallet, BookOpen } from 'lucide-react';

export default function FinancePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Finance</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => router.push('/finance/tagihan')}
          className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <FileText className="text-blue-600" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Tagihan</h2>
              <p className="text-gray-600 mt-1">Manage invoices</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push('/finance/payroll')}
          className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-4 bg-green-100 rounded-lg">
              <Wallet className="text-green-600" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Payroll</h2>
              <p className="text-gray-600 mt-1">Process payments</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push('/finance/jurnal')}
          className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-4 bg-purple-100 rounded-lg">
              <BookOpen className="text-purple-600" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Jurnal</h2>
              <p className="text-gray-600 mt-1">Financial journal</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
