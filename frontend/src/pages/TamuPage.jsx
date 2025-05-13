import { useNavigate } from 'react-router-dom';

function TamuPage() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard Tamu</h1>
      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
}

export default TamuPage;
