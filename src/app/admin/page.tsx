import Link from 'next/link';

const mockJobs = [
  {
    id: '1',
    property: { name: 'Casa Playa', address: 'Av. Principal #123' },
    jobType: { name: 'Limpieza' },
    worker: { name: 'María González' },
    datetime: new Date().toISOString(),
    status: 'pending',
  },
  {
    id: '2',
    property: { name: 'Depto Centro', address: 'Calle 5 de Mayo #45' },
    jobType: { name: 'Check-in' },
    worker: { name: 'Ana López' },
    datetime: new Date().toISOString(),
    status: 'done',
  },
];

export default function AdminPage() {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
    problem: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <Link href="/" className="text-blue-600 hover:underline">← Inicio</Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Jobs Recientes</h2>
          <div className="space-y-3">
            {mockJobs.map((job) => (
              <div key={job.id} className="border rounded p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{job.property.name}</h3>
                    <p className="text-sm text-gray-600">{job.property.address}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {job.jobType.name} - {job.worker.name}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[job.status as keyof typeof statusColors]}`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
