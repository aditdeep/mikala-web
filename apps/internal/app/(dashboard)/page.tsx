'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { StatsCard } from '@/components/StatsCard';
import { Users, Briefcase, DollarSign, Clock } from 'lucide-react';
import { LoadingSpinner } from '@mikala/ui';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/internal/dashboard/summary')
      .then((res) => {
        setStats(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch dashboard stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Mitra"
          value={stats.total_mitra || 0}
          icon={Users}
          trend={{ value: '+12%', isPositive: true }}
        />
        <StatsCard
          title="Active Orders"
          value={stats.orders_active || 0}
          icon={Briefcase}
          trend={{ value: '+8%', isPositive: true }}
        />
        <StatsCard
          title="Revenue This Month"
          value={`Rp ${(stats.total_revenue || 0).toLocaleString('id-ID')}`}
          icon={DollarSign}
          trend={{ value: '+23%', isPositive: true }}
        />
        <StatsCard
          title="Pending Items"
          value={stats.pending_items?.new_applications || 0}
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Applications</h2>
          <div className="space-y-3">
            {stats.recent_applications?.slice(0, 5).map((app: any) => (
              <div key={app.id} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{app.name}</p>
                  <p className="text-sm text-gray-500">{app.email}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                  Pending
                </span>
              </div>
            )) || <p className="text-gray-500">No recent applications</p>}
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Active Orders</h2>
          <div className="space-y-3">
            {stats.recent_orders?.slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{order.service_type}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                  Active
                </span>
              </div>
            )) || <p className="text-gray-500">No active orders</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
