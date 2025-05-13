import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Navigate Only Use useEffect To Call
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return null;
    }
  }, [])

  if (String(user?.role||"") !== String(role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">403 - Akses Ditolak</h1>
        <p>Anda tidak memiliki izin untuk mengakses halaman ini</p>
      </div>
    );
  }

  return children;
}