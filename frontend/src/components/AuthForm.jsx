import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or phone
    password: '',
    role: '',
    email: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setFormData({ identifier: '', password: '', role: '', email: '', phone: '' });
  };

  const isEmail = (value) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isPhone = (value) => {
    // Simple phone number regex (adjust based on your requirements)
    return /^[0-9]{10,15}$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Loading...');

    try {
      const endpoint = isLogin ? 'login' : 'register';
      let body;

      if (isLogin) {
        // For login, determine if identifier is email or phone
        const loginData = { password: formData.password };
        
        if (isEmail(formData.identifier)) {
          loginData.email = formData.identifier;
        } else if (isPhone(formData.identifier)) {
          loginData.phone = formData.identifier;
        } else {
          throw new Error('Masukkan email atau nomor telepon yang valid');
        }

        body = loginData;
      } else {
        // For registration, require both email and phone
        if (!formData.email || !formData.phone) {
          throw new Error('Email dan nomor telepon harus diisi');
        }
        body = {
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role
        };
      }

      const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Terjadi kesalahan');
      }

      if (isLogin) {
        // Simpan data user ke auth context
        login({
          username: result.user?.username || formData.identifier,
          role: result.user?.role || result.role,
          email: result.user?.email,
          phone: result.user?.phone
        });
        
        setMessage(`Login berhasil sebagai ${result.user?.role || result.role}`);
        
        // Redirect with small timeout to ensure state is updated
        setTimeout(() => {
          const role = result.user?.role || result.role;
          switch(role) {
            case 'admin':
              navigate('/admin', { replace: true });
              break;
            case 'guru':
              navigate('/guru', { replace: true });
              break;
            case 'tamu':
              navigate('/tamu', { replace: true });
              break;
            default:
              navigate('/', { replace: true });
          }
        }, 100);
      } else {
        setMessage('Registrasi berhasil! Silakan login');
        setIsLogin(true);
        setFormData({ identifier: '', password: '', role: '', email: '', phone: '' });
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white p-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="relative w-full h-full">
          <div className="absolute left-1/2 -translate-x-1/2 w-[150%] rotate-12 h-16 bg-orange-400 rounded-xl top-[10%] md:top-[15%] max-md:rotate-0 max-md:w-[120%] max-md:h-12 max-md:top-[5%]" />
          <div className="absolute left-1/2 -translate-x-1/2 w-[150%] rotate-12 h-16 bg-[#1D3D4C] rounded-xl top-[30%] md:top-[35%] max-md:rotate-0 max-md:w-[120%] max-md:h-12 max-md:top-[25%]" />
          <div className="absolute left-1/2 -translate-x-1/2 w-[150%] rotate-12 h-16 bg-orange-400 rounded-xl top-[50%] md:top-[55%] max-md:rotate-0 max-md:w-[120%] max-md:h-12 max-md:top-[45%]" />
          <div className="absolute left-1/2 -translate-x-1/2 w-[150%] rotate-12 h-16 bg-[#1D3D4C] rounded-xl top-[70%] md:top-[75%] max-md:rotate-0 max-md:w-[120%] max-md:h-12 max-md:top-[65%]" />
        </div>
      </div>
  
      <form
        onSubmit={handleSubmit}
        className="relative z-10 space-y-4 bg-white/90 backdrop-blur-sm rounded-xl p-6 w-full max-w-sm shadow-xl"
      >
        <h2 className="text-center text-2xl font-bold text-[#1D3D4C]">
          {isLogin ? 'Login' : 'Register'}
        </h2>
  
        {isLogin ? (
          <div>
            <input
              type="text"
              name="identifier"
              placeholder="Email atau Nomor Telepon"
              className="w-full px-4 py-2 rounded-full shadow focus:outline-none"
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              required
            />
          </div>
        ) : (
          <>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-full shadow focus:outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Nomor Telepon"
                className="w-full px-4 py-2 rounded-full shadow focus:outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </>
        )}

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-full shadow focus:outline-none"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-lg"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
  

        {!isLogin && (
          <select
            name="role"
            className="w-full px-4 py-2 rounded-full shadow focus:outline-none"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          >
            <option value="">Pilih Role</option>
            <option value="admin">Admin</option>
            <option value="guru">Guru</option>
            <option value="tamu">Tamu</option>
          </select>
        )}
  
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-400 hover:bg-orange-500 transition text-white py-2 rounded-full font-semibold"
        >
          {isLoading ? 'Memproses...' : isLogin ? 'Log in' : 'Sign up'}
        </button>
  
        {message && (
          <p
            className={`text-center text-sm ${
              message.includes('Error') ? 'text-red-500' : 'text-green-600'
            }`}
          >
            {message}
          </p>
        )}
  
        <button
          type="button"
          onClick={toggleForm}
          className="text-sm text-blue-600 underline block mx-auto"
        >
          {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; 

// function AuthForm() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     role: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const toggleForm = () => {
//     setIsLogin(!isLogin);
//     setMessage('');
//     setFormData({ username: '', password: '', role: '' });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage('Loading...');

//     try {
//       const endpoint = isLogin ? 'login' : 'register';
//       const body = isLogin
//         ? { username: formData.username, password: formData.password }
//         : formData;

//       const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || 'Terjadi kesalahan');
//       }

//       if (isLogin) {
//         // Simpan data user ke auth context
//         login({
//           username: result.user?.username || formData.username,
//           role: result.user?.role || result.role
//         });
        
//         setMessage(`Login berhasil sebagai ${result.user?.role || result.role}`);
        
//         // Redirect dengan timeout kecil untuk memastikan state terupdate
//         setTimeout(() => {
//           const role = result.user?.role || result.role;
//           switch(role) {
//             case 'admin':
//               navigate('/admin', { replace: true });
//               break;
//             case 'guru':
//               navigate('/guru', { replace: true });
//               break;
//             case 'tamu':
//               navigate('/tamu', { replace: true });
//               break;
//             default:
//               navigate('/', { replace: true });
//           }
//         }, 100);
//       } else {
//         setMessage('Registrasi berhasil! Silakan login');
//         setIsLogin(true);
//         setFormData({ username: '', password: '', role: '' });
//       }
//     } catch (err) {
//       setMessage(`Error: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white p-4">
//       <div className="absolute inset-0 z-0 overflow-hidden">
//         <div className="relative w-full h-full">
//           <div className="absolute left-1/2 -translate-x-1/2 w-[150%] rotate-12 h-16 bg-orange-400 rounded-xl top-[10%] md:top-[15%] max-md:rotate-0 max-md:w-[120%] max-md:h-12 max-md:top-[5%]" />
//           <div className="absolute left-1/2 -translate-x-1/2 w-[150%] rotate-12 h-16 bg-[#1D3D4C] rounded-xl top-[30%] md:top-[35%] max-md:rotate-0 max-md:w-[120%] max-md:h-12 max-md:top-[25%]" />
//           <div className="absolute left-1/2 -translate-x-1/2 w-[150%] rotate-12 h-16 bg-orange-400 rounded-xl top-[50%] md:top-[55%] max-md:rotate-0 max-md:w-[120%] max-md:h-12 max-md:top-[45%]" />
//           <div className="absolute left-1/2 -translate-x-1/2 w-[150%] rotate-12 h-16 bg-[#1D3D4C] rounded-xl top-[70%] md:top-[75%] max-md:rotate-0 max-md:w-[120%] max-md:h-12 max-md:top-[65%]" />
//         </div>
//       </div>
  
//       <form
//         onSubmit={handleSubmit}
//         className="relative z-10 space-y-4 bg-white/90 backdrop-blur-sm rounded-xl p-6 w-full max-w-sm shadow-xl"
//       >
//         <h2 className="text-center text-2xl font-bold text-[#1D3D4C]">
//           {isLogin ? 'Login' : 'Register'}
//         </h2>
  
//         <div>
//           <input
//             type="text"
//             name="username"
//             placeholder="Username"
//             className="w-full px-4 py-2 rounded-full shadow focus:outline-none"
//             value={formData.username}
//             onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//             required
//           />
//         </div>

//         <div className="relative">
//           <input
//             type={showPassword ? 'text' : 'password'}
//             name="password"
//             placeholder="Password"
//             className="w-full px-4 py-2 rounded-full shadow focus:outline-none"
//             value={formData.password}
//             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-2.5 text-lg"
//           >
//             {showPassword ? '🙈' : '👁️'}
//           </button>
//         </div>
  

//         {!isLogin && (
//           <select
//             name="role"
//             className="w-full px-4 py-2 rounded-full shadow focus:outline-none"
//             value={formData.role}
//             onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//             required
//           >
//             <option value="">Pilih Role</option>
//             <option value="admin">Admin</option>
//             <option value="guru">Guru</option>
//             <option value="tamu">Tamu</option>
//           </select>
//         )}
  
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full bg-orange-400 hover:bg-orange-500 transition text-white py-2 rounded-full font-semibold"
//         >
//           {isLoading ? 'Memproses...' : isLogin ? 'Log in' : 'Sign up'}
//         </button>
  
//         {message && (
//           <p
//             className={`text-center text-sm ${
//               message.includes('Error') ? 'text-red-500' : 'text-green-600'
//             }`}
//           >
//             {message}
//           </p>
//         )}
  
//         <button
//           type="button"
//           onClick={toggleForm}
//           className="text-sm text-blue-600 underline block mx-auto"
//         >
//           {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
//         </button>
//       </form>
//     </div>
//   );
  
// }

// export default AuthForm;

// // auth fix

