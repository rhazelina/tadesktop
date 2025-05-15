// OPTIONAL AJA

import { format } from 'date-fns';
import id from 'date-fns/locale/id';

const AppointmentCard = ({ appointment }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="bg-[#1D3D4C] text-white px-4 py-2">
        <h3 className="font-bold text-lg truncate">{appointment.nama}</h3>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-gray-700">{appointment.noHp}</span>
        </div>
        
        <div className="flex items-center mb-3">
          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-700">
            {format(new Date(appointment.tanggal), 'EEEE, dd MMMM yyyy', { locale: id })}
          </span>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-gray-600">{appointment.keterangan}</p>
        </div>
        
        <div className="mt-3 text-sm text-gray-500">
          Dibuat pada: {format(new Date(appointment.created_at), 'dd/MM/yyyy HH:mm')}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;