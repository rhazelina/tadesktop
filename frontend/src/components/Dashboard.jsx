import { useNavigate } from 'react-router-dom';
import '../index.css';
// import mascot from '../assets/Mascot/Inorasi.jpeg'


export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/authform?mode=login');
  };

  const handleSignup = () => {
    navigate('/authform?mode=signup');
  };

  return (
    <div className="min-h-screen bg-white font-sans relative overflow-hidden px-6 py-10 flex flex-col justify-between">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[40%] left-0 w-full h-20 rotate-[10deg] bg-[#0f2e3f] rounded-xl z-0 opacity-90" />
        <div className="absolute top-[52%] left-0 w-full h-20 rotate-[10deg] bg-orange-400 rounded-xl z-0 opacity-90" />
      </div>

      <div className="text-center z-10 transform transition-all duration-300 hover:scale-105">
        <img
          src="https://smkn2-singosari.sch.id/wp-content/uploads/2021/10/logo.png"
          alt="Logo SMKN 2"
          className="w-20 mx-auto mb-4 drop-shadow-md"
        />
        <h1 className="text-4xl font-bold text-[#1D3D4C] mb-1">BUKU</h1>
        <h2 className="text-4xl font-bold text-orange-500 mb-2 transform transition-all duration-300 hover:scale-105">
          TAMU UNDANGAN
        </h2>
        <p className="text-[#333] font-medium text-lg">SMK Negeri 2 Singosari!</p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 z-10">
        <button
          onClick={handleLogin}
          className="bg-orange-400 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-orange-500 transition-all 
          transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50
          text-lg min-w-[120px]"
        >
          Log In
        </button>
        <button
          onClick={handleSignup}
          className="bg-[#0f2e3f] text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-[#133949] transition-all
          transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#0f2e3f] focus:ring-opacity-50
          text-lg min-w-[120px]"
        >
          Sign Up
        </button>
      </div>

      <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-4 max-w-2xl mx-auto mt-8 z-10 shadow-sm">
        <p className="text-center text-md text-[#333] leading-relaxed">
          Untuk <span className="font-semibold text-[#0f2e3f]">Guru & Staf</span>, silakan langsung tekan <span className="font-semibold text-orange-500">Log In</span> untuk melanjutkan. 
          Untuk <span className="font-semibold text-[#0f2e3f]">Tamu</span>, silakan tekan <span className="font-semibold text-[#0f2e3f]">Sign Up</span> jika belum memiliki akun, 
          atau <span className="font-semibold text-orange-500">Log In</span> jika sudah terdaftar.
        </p>
      </div>

      <div className="mt-12 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-5 max-w-2xl mx-auto z-10 shadow-sm">
        <h3 className="text-xl font-bold text-[#0f2e3f] mb-3 border-b-2 border-orange-400 pb-2 inline-block">
          Tentang SMKN 2 Singosari
        </h3>
        <p className="text-md text-[#333] leading-relaxed">
          SMK Negeri 2 Singosari merupakan salah satu Lembaga Pendidikan Menengah Kejuruan di Kabupaten Malang, 
          Jawa Timur yang menyelenggarakan Program Pendidikan Kejuruan Industri Kreatif, 
          Teknologi Informatika dan Elektronika.
        </p>
      </div>

      <div className="text-center text-sm text-[#666] mt-10 z-10 bg-white bg-opacity-70 backdrop-blur-sm py-2 rounded-full max-w-xs mx-auto">
        © SMKN 2 Singosari 2025 — All Rights Reserved.
      </div>

      <img
        src="../assets/Mascot/Inorasi.jpeg"
        alt="Maskot"
        className="absolute bottom-0 right-0 w-[250px] max-w-full z-10 animate-float"
      />
    </div>
  );
}