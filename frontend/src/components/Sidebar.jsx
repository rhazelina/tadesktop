// src/components/Sidebar.jsx
import AdminSidebar from './AdminSidebar';
import GuruSidebar from './GuruSidebar';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();

  if (!user) return null; 

  return (
    <div className="flex flex-col h-full">
      {user.role === 'admin' && <AdminSidebar />}
      {user.role === 'guru' && <GuruSidebar />}
      
      <div className="mt-auto p-4">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar
        </button>
      </div>
    </div>
  );
}