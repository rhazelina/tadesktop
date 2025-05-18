// src/components/AdminSidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [isGuestDataOpen, setIsGuestDataOpen] = useState(false);
  const [isTeacherDataOpen, setIsTeacherDataOpen] = useState(false);

  const handleGuestDataClick = (e) => {
    if (e.target.closest('.expand-arrow')) {
      e.preventDefault();
      setIsGuestDataOpen(!isGuestDataOpen);
    } else {
      navigate('/admin/guest-data');
    }
  };

  const handleTeacherDataClick = (e) => {
    if (e.target.closest('.expand-arrow')) {
      e.preventDefault();
      setIsTeacherDataOpen(!isTeacherDataOpen);
    } else {
      navigate('/admin/teacher-data');
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
          to="/admin" 
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
        
        {/* Data Tamu Section */}
        <div className="mb-1">
          <NavLink
            onClick={handleGuestDataClick}
            className={({ isActive }) => 
              `px-6 py-3 flex items-center justify-between ${isActive || isGuestDataOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'} transition-colors duration-200`
            }
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Data Tamu
            </div>
            <svg 
              className={`expand-arrow w-4 h-4 transform transition-transform duration-200 ${isGuestDataOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </NavLink>
          
          {isGuestDataOpen && (
            <div className="ml-8 bg-gray-50 rounded-lg overflow-hidden">
              <NavLink 
                to="/admin/guest-data"
                end
                className={({ isActive }) => 
                  `px-4 py-2 block text-sm ${isActive ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-100 text-gray-600'} transition-colors duration-150`
                }
              >
                Daftar Tamu
              </NavLink>
              <NavLink 
                to="/admin/guest-reports"
                className={({ isActive }) => 
                  `px-4 py-2 block text-sm ${isActive ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-100 text-gray-600'} transition-colors duration-150`
                }
              >
                Laporan Kunjungan
              </NavLink>
            </div>
          )}
        </div>
        
        {/* Data Guru Section (Only for Admin) */}
        <div className="mb-1">
          <NavLink
            onClick={handleTeacherDataClick}
            className={({ isActive }) => 
              `px-6 py-3 flex items-center justify-between ${isActive || isTeacherDataOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'} transition-colors duration-200`
            }
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Data Guru
            </div>
            <svg 
              className={`expand-arrow w-4 h-4 transform transition-transform duration-200 ${isTeacherDataOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </NavLink>
          
          {isTeacherDataOpen && (
            <div className="ml-8 bg-gray-50 rounded-lg overflow-hidden">
              <NavLink 
                to="/admin/teacher-data"
                end
                className={({ isActive }) => 
                  `px-4 py-2 block text-sm ${isActive ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-100 text-gray-600'} transition-colors duration-150`
                }
              >
                Daftar Guru
              </NavLink>
              <NavLink 
                to="/admin/teacher-management"
                className={({ isActive }) => 
                  `px-4 py-2 block text-sm ${isActive ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-100 text-gray-600'} transition-colors duration-150`
                }
              >
                Manajemen Guru
              </NavLink>
            </div>
          )}
        </div>
        
        {/* Settings Section (Only for Admin) */}
        <NavLink 
          to="/admin/settings" 
          className={({ isActive }) => 
            `px-6 py-3 flex items-center ${isActive ? 'bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-600' : 'hover:bg-gray-50 text-gray-700'} transition-colors duration-200`
          }
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Pengaturan
        </NavLink>
      </nav>
    </div>
  );
}