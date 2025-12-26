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

interface Property { id: string; name: string; address: string; client?: { name: string } }
interface Worker { id: string; name: string; phone: string }
interface JobType { id: string; name: string; checklistTemplate: string; }

export default function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showJobForm, setShowJobForm] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  
  const [jobData, setJobData] = useState({ propertyId: '', workerId: '', jobTypeId: '', datetime: '', notes: '' });
  const [propertyData, setPropertyData] = useState({ name: '', address: '', clientName: '', clientPhone: '', notes: '' });
  const [workerData, setWorkerData] = useState({ name: '', phone: '' });

  const loadData = () => {
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
  };

  useEffect(() => { loadData(); }, []);

  const createJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedType = jobTypes.find(t => t.id === jobData.jobTypeId);
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...jobData, checklist: selectedType?.checklistTemplate || '[]' }),
    });
    const newJob = await res.json();
    setJobs([newJob, ...jobs]);
    setShowJobForm(false);
    setJobData({ propertyId: '', workerId: '', jobTypeId: '', datetime: '', notes: '' });
  };

  const createProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData),
    });
    const newProp = await res.json();
    setProperties([...properties, newProp]);
    setShowPropertyForm(false);
    setPropertyData({ name: '', address: '', clientName: '', clientPhone: '', notes: '' });
  };

  const createWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/workers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workerData),
    });
    const newWorker = await res.json();
    setWorkers([...workers, newWorker]);
    setShowWorkerForm(false);
    setWorkerData({ name: '', phone: '' });
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
          <Link href="/" className="text-blue-600 hover:underline">← Inicio</Link>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button onClick={() => setShowJobForm(!showJobForm)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Job</button>
          <button onClick={() => setShowPropertyForm(!showPropertyForm)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+ Propiedad</button>
          <button onClick={() => setShowWorkerForm(!showWorkerForm)} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">+ Trabajadora</button>
        </div>

        {/* Job Form */}
        {showJobForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Crear Job</h2>
            <form onSubmit={createJob} className="grid grid-cols-2 gap-4">
              <select required value={jobData.propertyId} onChange={e => setJobData({...jobData, propertyId: e.target.value})} className="border rounded p-2">
                <option value="">Seleccionar Propiedad</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select required value={jobData.workerId} onChange={e => setJobData({...jobData, workerId: e.target.value})} className="border rounded p-2">
                <option value="">Seleccionar Trabajadora</option>
                {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
              <select required value={jobData.jobTypeId} onChange={e => setJobData({...jobData, jobTypeId: e.target.value})} className="border rounded p-2">
                <option value="">Tipo de Job</option>
                {jobTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <input type="datetime-local" required value={jobData.datetime} onChange={e => setJobData({...jobData, datetime: e.target.value})} className="border rounded p-2" />
              <textarea placeholder="Notas (opcional)" value={jobData.notes} onChange={e => setJobData({...jobData, notes: e.target.value})} className="border rounded p-2 col-span-2" />
              <div className="col-span-2 flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Crear</button>
                <button type="button" onClick={() => setShowJobForm(false)} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {/* Property Form */}
        {showPropertyForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Crear Propiedad</h2>
            <form onSubmit={createProperty} className="grid grid-cols-2 gap-4">
              <input required placeholder="Nombre propiedad" value={propertyData.name} onChange={e => setPropertyData({...propertyData, name: e.target.value})} className="border rounded p-2" />
              <input required placeholder="Direccion" value={propertyData.address} onChange={e => setPropertyData({...propertyData, address: e.target.value})} className="border rounded p-2" />
              <input required placeholder="Nombre del cliente/owner" value={propertyData.clientName} onChange={e => setPropertyData({...propertyData, clientName: e.target.value})} className="border rounded p-2" />
              <input placeholder="Telefono cliente (opcional)" value={propertyData.clientPhone} onChange={e => setPropertyData({...propertyData, clientPhone: e.target.value})} className="border rounded p-2" />
              <textarea placeholder="Notas (opcional)" value={propertyData.notes} onChange={e => setPropertyData({...propertyData, notes: e.target.value})} className="border rounded p-2 col-span-2" />
              <div className="col-span-2 flex gap-2">
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Crear</button>
                <button type="button" onClick={() => setShowPropertyForm(false)} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {/* Worker Form */}
        {showWorkerForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Crear Trabajadora</h2>
            <form onSubmit={createWorker} className="grid grid-cols-2 gap-4">
              <input required placeholder="Nombre" value={workerData.name} onChange={e => setWorkerData({...workerData, name: e.target.value})} className="border rounded p-2" />
              <input required placeholder="Telefono" value={workerData.phone} onChange={e => setWorkerData({...workerData, phone: e.target.value})} className="border rounded p-2" />
              <div className="col-span-2 flex gap-2">
                <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">Crear</button>
                <button type="button" onClick={() => setShowWorkerForm(false)} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{jobs.length}</div>
            <div className="text-gray-500">Jobs</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{properties.length}</div>
            <div className="text-gray-500">Propiedades</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{workers.length}</div>
            <div className="text-gray-500">Trabajadoras</div>
          </div>
        </div>

        {/* Jobs List */}
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
