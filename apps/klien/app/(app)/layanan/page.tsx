'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { Card, CardContent, Badge, LoadingSpinner, Button } from '@mikala/ui';
import { Plus, Calendar, User } from 'lucide-react';

export default function LayananPage() {
  const router = useRouter();
  const [layanan, setLayanan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/klien/layanan')
      .then((res) => {
        setLayanan(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load services:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner message="Loading services..." />;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Services</h1>
        <Button onClick={() => router.push('/layanan/new')}>
          <Plus size={20} />
        </Button>
      </div>

      {layanan.length > 0 ? (
        layanan.map((service) => (
          <Card
            key={service.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/layanan/${service.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{service.service_type}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <User size={14} />
                    <span>{service.patient_name}</span>
                  </div>
                </div>
                <Badge variant={service.status === 'active' ? 'success' : 'warning'}>
                  {service.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={14} />
                <span>Start: {new Date(service.start_date).toLocaleDateString('id-ID')}</span>
              </div>

              {service.mitra_name && (
                <div className="mt-3 pt-3 border-t text-sm">
                  <span className="text-gray-600">Mitra: </span>
                  <span className="font-medium">{service.mitra_name}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No services yet</p>
          <Button onClick={() => router.push('/layanan/new')}>
            Create New Service
          </Button>
        </div>
      )}
    </div>
  );
}
