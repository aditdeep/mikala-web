'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { Card, CardContent, Badge, LoadingSpinner } from '@mikala/ui';
import { MapPin, Calendar } from 'lucide-react';

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/mitra/jobs')
      .then((res) => {
        setJobs(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load jobs:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner message="Loading jobs..." />;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Available Jobs</h1>

      {jobs.length > 0 ? (
        jobs.map((job) => (
          <Card
            key={job.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/jobs/${job.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{job.service_type}</h3>
                  <p className="text-sm text-gray-600">{job.patient_name}</p>
                </div>
                <Badge variant={job.status === 'available' ? 'success' : 'warning'}>
                  {job.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{job.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span>{new Date(job.start_date).toLocaleDateString('id-ID')}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t flex justify-between items-center">
                <span className="text-gray-600">Payment</span>
                <span className="font-bold text-green-600">
                  Rp {job.payment?.toLocaleString('id-ID') || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No jobs available at the moment</p>
        </div>
      )}
    </div>
  );
}
