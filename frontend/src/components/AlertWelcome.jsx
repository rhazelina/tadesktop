import { useEffect, useState } from 'react';

const WelcomeAlert = () => {
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState('opacity-0 translate-x-4');

  useEffect(() => {
    setTimeout(() => setFade('opacity-100 translate-x-0'), 100);

    const timer = setTimeout(() => {
      setFade('opacity-0 translate-x-4');
      setTimeout(() => setVisible(false), 300); 
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-50 transition-all duration-300 ease-in-out ${fade}`}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90vw] max-w-sm border-2 border-blue-900">
        <div className="flex flex-col items-center">
          <div className="bg-blue-900 text-white rounded-full p-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-black">Pengguna</h2>
          <p className="text-center text-black">Selamat Datang Pengguna!</p>
          <div className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-lg w-full text-center">
            [Konten Placeholder]
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAlert;
