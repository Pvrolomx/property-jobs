import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Property Jobs</h1>
          <p className="text-gray-600 mb-8">Sistema de gestión de tareas</p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/admin" 
            className="block w-full py-4 px-6 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Administrador
          </Link>
          
          <Link 
            href="/worker" 
            className="block w-full py-4 px-6 bg-green-600 text-white text-center rounded-lg font-medium hover:bg-green-700 transition"
          >
            Trabajadora
          </Link>
        </div>
      </div>
    </div>
  );
}
