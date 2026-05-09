'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { DataTable } from '@/components/DataTable';
import { LoadingSpinner, Badge } from '@mikala/ui';
import { Plus, Search } from 'lucide-react';

export default function RekrutmenPage() {
  const router = useRouter();
  const [mitra, setMitra] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadMitra();
  }, [currentPage, search]);

  const loadMitra = async () => {
    try {
      const res = await apiClient.get('/rekrutmen/mitra', {
        params: { page: currentPage, search }
      });
      setMitra(res.data.data);
      setTotalPages(res.data.meta?.last_page || 1);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load mitra:', err);
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error',
      active: 'success',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', render: (item: any) => item.user?.name || '-' },
    { key: 'phone', label: 'Phone' },
    { key: 'nik', label: 'NIK' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (item: any) => getStatusBadge(item.status) 
    },
    { 
      key: 'training_status', 
      label: 'Training', 
      render: (item: any) => getStatusBadge(item.training_status) 
    },
  ];

  if (loading) return <LoadingSpinner message="Loading mitra..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Rekrutmen Mitra</h1>
        <button
          onClick={() => router.push('/rekrutmen/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Mitra
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, phone, or NIK..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <DataTable
        data={mitra}
        columns={columns}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
        onRowClick={(item) => router.push(`/rekrutmen/${item.id}`)}
      />
    </div>
  );
}
