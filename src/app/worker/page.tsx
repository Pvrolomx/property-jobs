import Link from 'next/link';

const mockJobsToday = [
  {
    id: '1',
    property: { name: 'Casa Playa', address: 'Av. Principal #123' },
    jobType: { name: 'Limpieza' },
    datetime: new Date().toISOString(),
    status: 'pending',
    notes: 'Limpieza profunda post check-out',
  },
  {
    id: '2',
    property: { name: 'Depto Centro', address: 'Calle 5 de Mayo #45' },
    jobType: { name: 'Check-in' },
    datetime: new Date().toISOString(),
    status: 'active',
    notes: null,
  },
];

export default function WorkerPage() {
  const statusColors = {
    pending: 'bg-yellow-500',
    active: 'bg-blue-500',
    done: 'bg-green-500',
    problem: 'bg-red-500',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mis Tareas HOY</h1>
          <Link href="/" className="text-blue-600">← Inicio</Link>
        </div>

        <div className="space-y-4">
          {mockJobsToday.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-xl font-semibold">{job.property.name}</h2>
                  <p className="text-gray-600">{job.jobType.name}</p>
                </div>
                <div className={`w-4 h-4 rounded-full ${statusColors[job.status as keyof typeof statusColors]}`}></div>
              </div>
              
              <p className="text-gray-700 mb-2">{job.property.address}</p>
              
              {job.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <p className="text-sm">{job.notes}</p>
                </div>
              )}
              
              <div className="mt-4 flex gap-3">
                <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700">
                  Terminé
                </button>
                <button className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700">
                  Problema
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
