'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { Card, CardContent, Badge, LoadingSpinner, Button } from '@mikala/ui';
import { DollarSign, Calendar } from 'lucide-react';

export default function TagihanPage() {
  const [tagihan, setTagihan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/klien/tagihan')
      .then((res) => {
        setTagihan(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load invoices:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner message="Loading invoices..." />;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Invoices</h1>

      {tagihan.length > 0 ? (
        tagihan.map((invoice) => (
          <Card key={invoice.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">Invoice #{invoice.id}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Calendar size={14} />
                    <span>Due: {new Date(invoice.due_date).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                <Badge variant={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'error' : 'warning'}>
                  {invoice.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-lg font-bold text-green-600 mb-3">
                <DollarSign size={20} />
                Rp {invoice.total_amount?.toLocaleString('id-ID') || 0}
              </div>

              {invoice.status !== 'paid' && (
                <Button className="w-full" onClick={() => alert('Payment integration not yet implemented')}>
                  Pay Now
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No invoices yet</p>
        </div>
      )}
    </div>
  );
}
