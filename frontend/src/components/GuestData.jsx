import React from 'react';

const guests = [
  {
    id: 1234,
    name: 'Natalia Sarah',
    institution: 'SMKN 1 JAKARTA',
    purpose: 'Rapat Kepala Sekolah',
    date: '25 April 2025',
    checkIn: '10:10',
    checkOut: '12:30',
    officer: 'Raisa Leza',
  },
  {
    id: 1234,
    name: 'Natalia Sarah',
    institution: 'SMKN 1 JAKARTA',
    purpose: 'Rapat Kepala Sekolah',
    date: '25 April 2025',
    checkIn: '10:10',
    checkOut: '12:30',
    officer: 'Raisa Leza',
  },
  {
    id: 1234,
    name: 'Natalia Sarah',
    institution: 'SMKN 1 JAKARTA',
    purpose: 'Rapat Kepala Sekolah',
    date: '25 April 2025',
    checkIn: '10:10',
    checkOut: '12:30',
    officer: 'Raisa Leza',
  },
  {
    id: 1234,
    name: 'Natalia Sarah',
    institution: 'SMKN 1 JAKARTA',
    purpose: 'Rapat Kepala Sekolah',
    date: '25 April 2025',
    checkIn: '10:10',
    checkOut: '12:30',
    officer: 'Raisa Leza',
  },
  {
    id: 1234,
    name: 'Natalia Sarah',
    institution: 'SMKN 1 JAKARTA',
    purpose: 'Rapat Kepala Sekolah',
    date: '25 April 2025',
    checkIn: '10:10',
    checkOut: '12:30',
    officer: 'Raisa Leza',
  },

];

const GuestData = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 font-sans">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 rounded-full bg-[#1C3F53]" />
            <div className="w-6 h-6 rounded-full bg-[#FF914D]" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-wide">DATA TAMU</h1>
            <div className="w-6 h-6 rounded-full bg-[#FF914D]" />
            <div className="w-6 h-6 rounded-full bg-[#1C3F53]" />
          </div>
    
          <div className="w-full max-w-7xl bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-300">
                <thead className="bg-gray-100 text-sm text-gray-700">
                  <tr>
                    <th className="border px-4 py-2 text-left">ID Tamu</th>
                    <th className="border px-4 py-2 text-left">Nama</th>
                    <th className="border px-4 py-2 text-left">Instansi</th>
                    <th className="border px-4 py-2 text-left">Keperluan</th>
                    <th className="border px-4 py-2 text-left">Tanggal</th>
                    <th className="border px-4 py-2 text-left">Jam Masuk</th>
                    <th className="border px-4 py-2 text-left">Jam Keluar</th>
                    <th className="border px-4 py-2 text-left">Petugas</th>
                    <th className="border px-4 py-2 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="border px-4 py-2">{guest.id}</td>
                      <td className="border px-4 py-2">{guest.name}</td>
                      <td className="border px-4 py-2">{guest.institution}</td>
                      <td className="border px-4 py-2">{guest.purpose}</td>
                      <td className="border px-4 py-2">{guest.date}</td>
                      <td className="border px-4 py-2">{guest.checkIn}</td>
                      <td className="border px-4 py-2">{guest.checkOut}</td>
                      <td className="border px-4 py-2">{guest.officer}</td>
                      <td className="border px-4 py-2">
                        <div className="flex space-x-2">
                          <button className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-3 py-1 rounded">
                            Edit
                          </button>
                          <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded">
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
    
            <div className="flex justify-end p-4">
              <button className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-5 py-2 rounded-full shadow-md">
                Ekspor Data
              </button>
            </div>
          </div>
        </div>
      );
    };

export default GuestData;
