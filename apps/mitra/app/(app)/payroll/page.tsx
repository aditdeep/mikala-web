'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { Card, CardContent, Badge, LoadingSpinner } from '@mikala/ui';
import { DollarSign, Calendar } from 'lucide-react';

export default function PayrollPage() {
  const [payroll, setPayroll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/mitra/payroll')
      .then((res) => {
        setPayroll(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load payroll:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner message="Loading payroll..." />;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Payroll History</h1>

      {payroll.length > 0 ? (
        payroll.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">Payment #{item.id}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Calendar size={14} />
                    <span>{new Date(item.payment_date).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                <Badge variant={item.status === 'paid' ? 'success' : 'warning'}>
                  {item.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-lg font-bold text-green-600">
                <DollarSign size={20} />
                Rp {item.amount?.toLocaleString('id-ID') || 0}
              </div>

              {item.description && (
                <p className="text-sm text-gray-600 mt-2">{item.description}</p>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No payroll history yet</p>
        </div>
      )}
    </div>
  );
}
