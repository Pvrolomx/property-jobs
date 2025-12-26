'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Job {
  id: string;
  property: { name: string; address: string };
  jobType: { name: string };
  datetime: string;
  status: string;
  notes: string | null;
  checklist: string;
}

export default function WorkerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs/today')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (jobId: string, status: string) => {
    await fetch(`/api/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status } : j));
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    active: 'bg-blue-500',
    done: 'bg-green-500',
    problem: 'bg-red-500',
  };

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mis Tareas HOY</h1>
          <Link href="/" className="text-blue-600">← Inicio</Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            No hay tareas para hoy
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-semibold">{job.property.name}</h2>
                    <p className="text-gray-600">{job.jobType.name}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full ${statusColors[job.status]}`}></div>
                </div>
                
                <p className="text-gray-700 mb-2">{job.property.address}</p>
                
                {job.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <p className="text-sm">{job.notes}</p>
                  </div>
                )}
                
                <div className="mt-4 flex gap-3">
                  <button 
                    onClick={() => updateStatus(job.id, 'done')}
                    disabled={job.status === 'done'}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    Termine
                  </button>
                  <button 
                    onClick={() => updateStatus(job.id, 'problem')}
                    disabled={job.status === 'problem'}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                  >
                    Problema
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
