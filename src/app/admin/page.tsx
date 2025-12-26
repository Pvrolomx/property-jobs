'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Job {
  id: string;
  property: { name: string; address: string };
  jobType: { name: string };
  worker: { name: string };
  datetime: string;
  status: string;
}

interface Property { id: string; name: string; }
interface Worker { id: string; name: string; }
interface JobType { id: string; name: string; checklistTemplate: string; }

export default function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: '', workerId: '', jobTypeId: '', datetime: '', notes: ''
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/jobs').then(r => r.json()),
      fetch('/api/properties').then(r => r.json()),
      fetch('/api/workers').then(r => r.json()),
      fetch('/api/jobtypes').then(r => r.json()),
    ]).then(([jobsData, propsData, workersData, typesData]) => {
      setJobs(jobsData);
      setProperties(propsData);
      setWorkers(workersData);
      setJobTypes(typesData);
      setLoading(false);
    });
  }, []);

  const createJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedType = jobTypes.find(t => t.id === formData.jobTypeId);
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        checklist: selectedType?.checklistTemplate || '[]'
      }),
    });
    const newJob = await res.json();
    setJobs([newJob, ...jobs]);
    setShowForm(false);
    setFormData({ propertyId: '', workerId: '', jobTypeId: '', datetime: '', notes: '' });
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
    problem: 'bg-red-100 text-red-800',
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <div className="flex gap-4">
            <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              + Nuevo Job
            </button>
            <Link href="/" className="text-blue-600 hover:underline py-2">← Inicio</Link>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Crear Job</h2>
            <form onSubmit={createJob} className="grid grid-cols-2 gap-4">
              <select required value={formData.propertyId} onChange={e => setFormData({...formData, propertyId: e.target.value})} className="border rounded p-2">
                <option value="">Seleccionar Propiedad</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select required value={formData.workerId} onChange={e => setFormData({...formData, workerId: e.target.value})} className="border rounded p-2">
                <option value="">Seleccionar Trabajadora</option>
                {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
              <select required value={formData.jobTypeId} onChange={e => setFormData({...formData, jobTypeId: e.target.value})} className="border rounded p-2">
                <option value="">Tipo de Job</option>
                {jobTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <input type="datetime-local" required value={formData.datetime} onChange={e => setFormData({...formData, datetime: e.target.value})} className="border rounded p-2" />
              <textarea placeholder="Notas (opcional)" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="border rounded p-2 col-span-2" />
              <div className="col-span-2 flex gap-2">
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Crear</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Jobs ({jobs.length})</h2>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="border rounded p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{job.property.name}</h3>
                    <p className="text-sm text-gray-600">{job.property.address}</p>
                    <p className="text-sm text-gray-500 mt-1">{job.jobType.name} - {job.worker.name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[job.status]}`}>{job.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
