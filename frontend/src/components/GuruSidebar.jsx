// src/components/TeacherSidebar.jsx
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function GuruSidebar() {
  const [isGuestDataOpen, setIsGuestDataOpen] = useState(false);

  const handleGuestDataClick = (e) => {
    if (e.target.closest('.expand-arrow')) {
      e.preventDefault();
      setIsGuestDataOpen(!isGuestDataOpen);
    }
  };

  return (
    <div className="w-64 bg-white shadow-md flex flex-col h-full">
      <div className="p-6">
        <img 
          src="https://smkn2-singosari.sch.id/wp-content/uploads/2021/10/logo.png" 
          alt="SMK Negeri 2 Singosari Logo"
          className="mt-6 p-7 w-full h-auto object-contain"
        />
      </div>
      
      <nav className="mt-2 flex-1 flex flex-col">
        <NavLink 
          to="/teacher" 
          end
          className={({ isActive }) => 
            `px-6 py-3 flex items-center ${isActive ? 'bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-600' : 'hover:bg-gray-50 text-gray-700'} transition-colors duration-200`
          }
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </NavLink>
        
        {/* Data Tamu Section (Limited Access) */}
        <div className="mb-1">
          <div
            onClick={handleGuestDataClick}
            className={`px-6 py-3 flex items-center justify-between ${isGuestDataOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'} transition-colors duration-200 cursor-pointer`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Laporan Kunjungan
            </div>
            <svg 
              className={`expand-arrow w-4 h-4 transform transition-transform duration-200 ${isGuestDataOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {isGuestDataOpen && (
            <div className="ml-8 bg-gray-50 rounded-lg overflow-hidden">
              <NavLink 
                to="/teacher/guest-reports"
                className={({ isActive }) => 
                  `px-4 py-2 block text-sm ${isActive ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-100 text-gray-600'} transition-colors duration-150`
                }
              >
                Kunjungan Saya
              </NavLink>
              <NavLink 
                to="/teacher/monthly-reports"
                className={({ isActive }) => 
                  `px-4 py-2 block text-sm ${isActive ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-100 text-gray-600'} transition-colors duration-150`
                }
              >
                Laporan Bulanan
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}