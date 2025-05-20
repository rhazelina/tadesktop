import { useEffect, useState } from 'react';
import { getAppointments } from '../../services/appointmentService';
import AppointmentCard from './AppointmentCard';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getAppointments();
        setAppointments(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Gagal memuat data janji temu');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = filterDate
    ? appointments.filter(
        (appt) => format(new Date(appt.tanggal), 'yyyy-MM-dd') === format(filterDate, 'yyyy-MM-dd')
      )
    : appointments;

  const handleFilterChange = (date) => {
    setFilterDate(date);
  };

  const clearFilter = () => {
    setFilterDate(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1D3D4C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1D3D4C]">Daftar Janji Temu</h2>
        
        <div className="flex items-center space-x-2">
          <input
            type="date"
            onChange={(e) => handleFilterChange(e.target.value ? new Date(e.target.value) : null)}
            className="border rounded-md px-3 py-2"
          />
          {filterDate && (
            <button
              onClick={clearFilter}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-sm"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          {filterDate 
            ? `Tidak ada janji temu pada tanggal ${format(filterDate, 'dd MMMM yyyy', { locale: id })}`
            : 'Belum ada janji temu yang tercatat'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;