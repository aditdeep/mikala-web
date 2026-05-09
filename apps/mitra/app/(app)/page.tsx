'use client';

import { useEffect, useState } from 'react';
import { apiClient, authService } from '@mikala/lib';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@mikala/ui';
import { DollarSign, CheckCircle, Clock } from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState<any>(null);
  const user = authService.getUser();

  useEffect(() => {
    apiClient
      .get('/mitra/dashboard')
      .then((res) => setStats(res.data.data))
      .catch((err) => console.error('Failed to load dashboard:', err));
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-1">Hello, {user?.name}!</h1>
        <p className="text-blue-100">Welcome back to Mikala Mitra</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <DollarSign className="mx-auto text-green-600 mb-2" size={24} />
            <div className="text-lg font-bold">{stats?.total_earnings || 0}</div>
            <div className="text-xs text-gray-600">Earnings</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 text-center">
            <CheckCircle className="mx-auto text-blue-600 mb-2" size={24} />
            <div className="text-lg font-bold">{stats?.completed_jobs || 0}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 text-center">
            <Clock className="mx-auto text-orange-600 mb-2" size={24} />
            <div className="text-lg font-bold">{stats?.active_jobs || 0}</div>
            <div className="text-xs text-gray-600">Active</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats?.recent_jobs?.length > 0 ? (
            stats.recent_jobs.map((job: any) => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{job.service_type}</div>
                  <div className="text-sm text-gray-600">{job.patient_name}</div>
                </div>
                <Badge variant={job.status === 'active' ? 'success' : 'default'}>
                  {job.status}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent jobs</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
