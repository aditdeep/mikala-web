'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, authService } from '@mikala/lib';
import { Card, CardContent, Button } from '@mikala/ui';
import { Plus, Clock, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const user = authService.getUser();

  useEffect(() => {
    apiClient
      .get('/klien/dashboard')
      .then((res) => setStats(res.data.data))
      .catch((err) => console.error('Failed to load dashboard:', err));
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-1">Hello, {user?.name}!</h1>
        <p className="text-green-100">Manage your care services</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => router.push('/layanan/new')}
          className="h-24 flex flex-col items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <Plus size={24} />
          <span>New Service</span>
        </Button>

        <Button
          onClick={() => router.push('/pasien/new')}
          className="h-24 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={24} />
          <span>Add Patient</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <Clock className="mx-auto text-orange-600 mb-2" size={24} />
            <div className="text-2xl font-bold">{stats?.active_services || 0}</div>
            <div className="text-sm text-gray-600">Active Services</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 text-center">
            <CheckCircle className="mx-auto text-green-600 mb-2" size={24} />
            <div className="text-2xl font-bold">{stats?.total_patients || 0}</div>
            <div className="text-sm text-gray-600">Patients</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Services */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-3">Recent Services</h2>
          <div className="space-y-2">
            {stats?.recent_services?.length > 0 ? (
              stats.recent_services.map((service: any) => (
                <div
                  key={service.id}
                  className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{service.service_type}</div>
                    <div className="text-sm text-gray-600">{service.patient_name}</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                    {service.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent services</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
