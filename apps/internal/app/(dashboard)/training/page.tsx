'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { DataTable } from '@/components/DataTable';
import { LoadingSpinner, Badge } from '@mikala/ui';

export default function TrainingPage() {
  const router = useRouter();
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/training')
      .then((res) => {
        setTrainings(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load trainings:', err);
        setLoading(false);
      });
  }, []);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'mitra_name', label: 'Mitra', render: (item: any) => item.mitra?.user?.name || '-' },
    { key: 'assigned_trainer', label: 'Trainer' },
    { 
      key: 'progress', 
      label: 'Progress', 
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${item.progress || 0}%` }}
            />
          </div>
          <span className="text-sm">{item.progress || 0}%</span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (item: any) => {
        const variants: any = {
          not_started: 'default',
          in_progress: 'warning',
          completed: 'success',
        };
        return <Badge variant={variants[item.status]}>{item.status?.replace('_', ' ')}</Badge>;
      }
    },
  ];

  if (loading) return <LoadingSpinner message="Loading trainings..." />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Training Management</h1>
      
      <DataTable
        data={trainings}
        columns={columns}
        onRowClick={(item) => router.push(`/training/${item.id}`)}
      />
    </div>
  );
}
