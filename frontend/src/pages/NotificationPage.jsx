import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Simulasi data notifikasi berdasarkan struktur database
  useEffect(() => {
    // Data dari tabel janji_temu dan relasinya
    const mockNotifications = [
      {
        id: 1,
        type: 'appointment_status',
        appointment_id: 1021,
        sender_id: 21937, // Alifah Diantebes (Guru)
        sender_name: 'Alifah Diantebes',
        recipient_id: 1234, // Joko Santoso (Tamu)
        message: 'Janji temu Anda dengan Alifah Diantebes telah diterima',
        status: 'unread',
        created_at: '2025-05-01T10:25:00',
        appointment_status: 'Sedang berlangsung',
        keperluan: 'Bertemu Bu Dian'
      },
      {
        id: 2,
        type: 'appointment_request',
        appointment_id: 1827,
        sender_id: 4321, // Maulidya (Tamu)
        sender_name: 'Maulidya',
        recipient_id: 21937, // Alifah Diantebes (Guru)
        message: 'Maulidya ingin membuat janji temu',
        status: 'unread',
        created_at: '2025-04-30T14:15:00',
        appointment_status: 'Menunggu',
        keperluan: 'Rapat Dengan Guru Rpl'
      },
      {
        id: 3,
        type: 'appointment_reminder',
        appointment_id: 1021,
        sender_id: null, // Sistem
        sender_name: 'Sistem',
        recipient_id: 1234, // Joko Santoso (Tamu)
        message: 'Pengingat: Janji temu besok pukul 10.23 dengan Alifah Diantebes',
        status: 'read',
        created_at: '2025-04-30T09:00:00',
        appointment_status: 'Menunggu',
        keperluan: 'Bertemu Bu Dian'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => n.status === 'unread').length);
  }, []);

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, status: 'read' } : notification
    );
    
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => n.status === 'unread').length);
  };

  const handleNotificationClick = (notification) => {
    // Tandai sebagai sudah dibaca
    markAsRead(notification.id);
    
    // Navigasi berdasarkan jenis notifikasi
    if (notification.type.includes('appointment')) {
      navigate(`/appointments/${notification.appointment_id}`);
    }
  };

  const getBadgeColor = (type) => {
    switch(type) {
      case 'appointment_status':
        return 'bg-blue-100 text-blue-800';
      case 'appointment_request':
        return 'bg-purple-100 text-purple-800';
      case 'appointment_reminder':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">NOTIFIKASI</h1>
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              Kembali
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-4 flex space-x-2 overflow-x-auto pb-2">
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
              Semua
            </button>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm">
              Belum Dibaca
            </button>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm">
              Permintaan
            </button>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm">
              Status
            </button>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm">
              Pengingat
            </button>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <li 
                  key={notification.id} 
                  className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${notification.status === 'unread' ? 'bg-blue-50' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(notification.type)}`}>
                          {notification.type === 'appointment_status' ? 'Status' : 
                           notification.type === 'appointment_request' ? 'Permintaan' : 'Pengingat'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                        {notification.status === 'unread' && (
                          <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {notification.sender_name} {notification.message}
                      </p>
                      {notification.keperluan && (
                        <p className="text-sm text-gray-500 mt-1">
                          Keperluan: {notification.keperluan}
                        </p>
                      )}
                      {notification.appointment_status && (
                        <p className="text-sm text-gray-500 mt-1">
                          Status: <span className={`px-2 py-1 rounded-full text-xs ${
                            notification.appointment_status === 'Selesai' ? 'bg-green-100 text-green-800' :
                            notification.appointment_status === 'Sedang berlangsung' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {notification.appointment_status}
                          </span>
                        </p>
                      )}
                    </div>
                    <button 
                      className="ml-4 text-blue-600 hover:text-blue-800 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      Tandai Dibaca
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationPage;