// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AuthForm = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     role: 'tamu',
//   });
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.username) newErrors.username = 'Username diperlukan';
//     if (!formData.password) newErrors.password = 'Password diperlukan';
//     if (!isLogin && !formData.role) newErrors.role = 'Role diperlukan';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     const endpoint = isLogin ? 'login' : 'register';
//     const body = isLogin
//       ? { username: formData.username, password: formData.password }
//       : formData;

//     try {
//       const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       });

//       const result = await response.json();
//       setMessage(result.message);

//       if (response.ok && result.success) {
//         const { username, role } = result.user;
//         localStorage.setItem('user', JSON.stringify({ username, role }));

//         if (role === 'admin') navigate('/admin');
//         else if (role === 'guru') navigate('/guru');
//         else navigate('/tamu');
//       }
//     } catch (error) {
//       setMessage('Terjadi kesalahan saat menghubungi server.');
//       console.error(error);
//     }
//   };

//   return (
//     <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
//       {message && <p className="mb-4 text-center text-sm text-red-500">{message}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           className={`w-full px-4 py-2 mb-3 border rounded-full shadow ${
//             errors.username ? 'border-red-500' : 'border-gray-300'
//           }`}
//           value={formData.username}
//           onChange={handleChange}
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           className={`w-full px-4 py-2 mb-3 border rounded-full shadow ${
//             errors.password ? 'border-red-500' : 'border-gray-300'
//           }`}
//           value={formData.password}
//           onChange={handleChange}
//         />
//         {!isLogin && (
//           <select
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             className={`w-full px-4 py-2 mb-3 border rounded-full shadow ${
//               errors.role ? 'border-red-500' : 'border-gray-300'
//             }`}
//           >
//             <option value="admin">Admin</option>
//             <option value="guru">Guru</option>
//             <option value="tamu">Tamu</option>
//           </select>
//         )}
//         <button
//           type="submit"
//           className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full"
//         >
//           {isLogin ? 'Login' : 'Register'}
//         </button>
//       </form>
//       <p className="mt-4 text-center text-sm">
//         {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{' '}
//         <button
//           className="text-blue-500 hover:underline"
//           onClick={() => {
//             setIsLogin(!isLogin);
//             setMessage('');
//             setErrors({});
//           }}
//         >
//           {isLogin ? 'Register' : 'Login'}
//         </button>
//       </p>
//     </div>
//   );
// };

// export default AuthForm;



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setFormData({ username: '', password: '', role: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Loading...');

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const body = isLogin
        ? { username: formData.username, password: formData.password }
        : formData;

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
          username: result.user?.username || formData.username,
          role: result.user?.role || result.role
        });
        
        setMessage(`Login berhasil sebagai ${result.user?.role || result.role}`);
        
        // Redirect dengan timeout kecil untuk memastikan state terupdate
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
        setFormData({ username: '', password: '', role: '' });
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
  
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full px-4 py-2 rounded-full shadow focus:outline-none"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

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

// auth fix

// import { useState } from 'react';

// export default function AuthForm() {
//   const [activeTab, setActiveTab] = useState('login');
//   const [signupForm, setSignupForm] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     password: '',
//   });

//   const [loginForm, setLoginForm] = useState({
//     username: '',
//     password: '',
//   });

//   const handleSignupChange = (e) => {
//     setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
//   };

//   const handleLoginChange = (e) => {
//     setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
//   };

//   const handleSignupSubmit = (e) => {
//     e.preventDefault();
//     console.log('Signup Data:', signupForm);
//   };

//   const handleLoginSubmit = (e) => {
//     e.preventDefault();
//     console.log('Login Data:', loginForm);
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
//       {/* Background Stripes - Now properly visible */}
//       <div className="absolute inset-0 overflow-hidden -z-10">
//         <div className="absolute -rotate-12 w-[150%] left-[-25%] top-1/2 -translate-y-1/2 space-y-8">
//           {activeTab === 'login' ? (
//             <>
//               <div className="w-full h-16 bg-[#FD8743]/70 rounded-xl"></div>
//               <div className="w-full h-16 bg-[#FD8743]/70 rounded-xl"></div>
//               <div className="w-full h-16 bg-[#FD8743]/70 rounded-xl"></div>
//             </>
//           ) : (
//             <>
//               <div className="w-full h-16 bg-[#FD8743] rounded-xl"></div>
//               <div className="w-full h-16 bg-[#1D3D4C] rounded-xl"></div>
//               <div className="w-full h-16 bg-[#FD8743] rounded-xl"></div>
//               <div className="w-full h-16 bg-[#1D3D4C] rounded-xl"></div>
//             </>
//           )}
//         </div>
//       </div>

//         {/* Login Form */}
//         {activeTab === 'login' && (
//           <form onSubmit={handleLoginSubmit} className="space-y-6">
//             <div>
//               <label className="block text-gray-700 mb-2">Username</label>
//               <input
//                 name="username"
//                 type="text"
//                 value={loginForm.username}
//                 onChange={handleLoginChange}
//                 className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Password</label>
//               <input
//                 name="password"
//                 type="password"
//                 value={loginForm.password}
//                 onChange={handleLoginChange}
//                 className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-black"
//                 required
//               />
//             </div>
//             <div className="text-right">
//               <a href="#" className="text-sm text-gray-500 hover:underline">Lupa Password?</a>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-[#1D3D4C] text-white py-3 rounded-full font-semibold shadow hover:bg-[#16313E] transition"
//             >
//               Log In
//             </button>
//           </form>
//         )}

//         {/* Signup Form */}
//         {activeTab === 'signup' && (
//           <form onSubmit={handleSignupSubmit} className="space-y-6">
//             <div>
//               <label className="block text-gray-700 mb-2">Nama</label>
//               <input
//                 name="name"
//                 type="text"
//                 value={signupForm.name}
//                 onChange={handleSignupChange}
//                 className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">No.Telp</label>
//               <input
//                 name="phone"
//                 type="tel"
//                 value={signupForm.phone}
//                 onChange={handleSignupChange}
//                 className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">E-Mail</label>
//               <input
//                 name="email"
//                 type="email"
//                 value={signupForm.email}
//                 onChange={handleSignupChange}
//                 className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Buat Sandi Baru</label>
//               <input
//                 name="password"
//                 type="password"
//                 value={signupForm.password}
//                 onChange={handleSignupChange}
//                 className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-black"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-[#1D3D4C] text-white py-3 rounded-full font-semibold shadow hover:bg-[#16313E] transition"
//             >
//               Sign Up
//             </button>
//           </form>
//         )}
//       </div>
//   );
// }

// import { useState } from 'react';

// export default function AuthForm() {
//   const [activeTab, setActiveTab] = useState('login');
//   const [signupForm, setSignupForm] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     password: '',
//   });

//   const [loginForm, setLoginForm] = useState({
//     username: '',
//     password: '',
//   });

//   const handleSignupChange = (e) => {
//     setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
//   };

//   const handleLoginChange = (e) => {
//     setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
//   };

//   const handleSignupSubmit = (e) => {
//     e.preventDefault();
//     console.log('Signup Data:', signupForm);
//   };

//   const handleLoginSubmit = (e) => {
//     e.preventDefault();
//     console.log('Login Data:', loginForm);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white p-4">
//       {/* Form Container */}
//       <div className="bg-white rounded-lg p-8 w-full max-w-md">
//         {/* Tabs */}
//         <div className="flex mb-8 border-b">
//           <button
//             onClick={() => setActiveTab('login')}
//             className={`px-4 py-2 font-medium text-lg ${
//               activeTab === 'login'
//                 ? 'text-black border-b-2 border-black'
//                 : 'text-gray-500'
//             }`}
//           >
//             Log In
//           </button>
//           <button
//             onClick={() => setActiveTab('signup')}
//             className={`px-4 py-2 font-medium text-lg ${
//               activeTab === 'signup'
//                 ? 'text-black border-b-2 border-black'
//                 : 'text-gray-500'
//             }`}
//           >
//             Sign Up
//           </button>
//         </div>

//         {/* Login Form */}
//         {activeTab === 'login' && (
//           <form onSubmit={handleLoginSubmit} className="space-y-6">
//             <div>
//               <label className="block text-gray-700 mb-2">Username</label>
//               <input
//                 name="username"
//                 type="text"
//                 value={loginForm.username}
//                 onChange={handleLoginChange}
//                 className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Password</label>
//               <input
//                 name="password"
//                 type="password"
//                 value={loginForm.password}
//                 onChange={handleLoginChange}
//                 className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-black"
//                 required
//               />
//             </div>
//             <div className="text-right">
//               <a href="#" className="text-sm text-gray-500 hover:underline">Lupa Password?</a>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition"
//             >
//               Log In
//             </button>
//           </form>
//         )}

//         {/* Signup Form */}
//         {activeTab === 'signup' && (
//           <form onSubmit={handleSignupSubmit} className="space-y-6">
//             <div>
//               <label className="block text-gray-700 mb-2">Nama</label>
//               <input
//                 name="name"
//                 type="text"
//                 value={signupForm.name}
//                 onChange={handleSignupChange}
//                 className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">No.Telp</label>
//               <input
//                 name="phone"
//                 type="tel"
//                 value={signupForm.phone}
//                 onChange={handleSignupChange}
//                 className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">E-Mail</label>
//               <input
//                 name="email"
//                 type="email"
//                 value={signupForm.email}
//                 onChange={handleSignupChange}
//                 className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Buat Sandi Baru</label>
//               <input
//                 name="password"
//                 type="password"
//                 value={signupForm.password}
//                 onChange={handleSignupChange}
//                 className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-black"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition"
//             >
//               Sign Up
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }


// import { useState } from 'react';

// export default function AuthForm() {
//   const [activeTab, setActiveTab] = useState('signup');
//   const [signupForm, setSignupForm] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     password: '',
//   });

//   const [loginForm, setLoginForm] = useState({
//     email: '',
//     password: '',
//   });

//   const handleSignupChange = (e) => {
//     setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
//   };

//   const handleLoginChange = (e) => {
//     setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
//   };

//   const handleSignupSubmit = (e) => {
//     e.preventDefault();
//     console.log('Signup Data:', signupForm);
//   };

//   const handleLoginSubmit = (e) => {
//     e.preventDefault();
//     console.log('Login Data:', loginForm);
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
//     {/* Background Stripes */}
//     <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
//       <div className="absolute -rotate-12 w-[150%] left-[-25%] top-1/2 -translate-y-1/2 space-y-8">
//         {activeTab === 'login' ? (
//           <>
//             <div className="w-full h-16 bg-[#FD8743]/70 rounded-xl" />
//             <div className="w-full h-16 bg-[#FD8743]/70 rounded-xl" />
//             <div className="w-full h-16 bg-[#FD8743]/70 rounded-xl" />
//           </>
//         ) : (
//           <>
//             <div className="w-full h-16 bg-[#FD8743] rounded-xl" />
//             <div className="w-full h-16 bg-[#1D3D4C] rounded-xl" />
//             <div className="w-full h-16 bg-[#FD8743] rounded-xl" />
//             <div className="w-full h-16 bg-[#1D3D4C] rounded-xl" />
//           </>
//         )}
//       </div>
//     </div>


//       {/* Form Container */}
//       <div className="bg-white bg-opacity-90 backdrop-blur-sm shadow-2xl rounded-[40px] p-8 w-[90%] max-w-md z-10">
//         {/* Tabs */}
//         <div className="flex mb-6 justify-between bg-[#FFFCF6] rounded-full shadow-md overflow-hidden">
//           <button
//             onClick={() => setActiveTab('login')}
//             className={`w-1/2 py-2 font-semibold transition ${
//               activeTab === 'login'
//                 ? 'bg-[#1D3D4C] text-white shadow-md'
//                 : 'text-[#1D3D4C]'
//             }`}
//           >
//             Log In
//           </button>
//           <button
//             onClick={() => setActiveTab('signup')}
//             className={`w-1/2 py-2 font-semibold transition ${
//               activeTab === 'signup'
//                 ? 'bg-[#1D3D4C] text-white shadow-md'
//                 : 'text-[#1D3D4C]'
//             }`}
//           >
//             Sign Up
//           </button>
//         </div>

//         {/* Login Form */}
//         {activeTab === 'login' && (
//           <form onSubmit={handleLoginSubmit} className="space-y-4">
//             <input
//               name="email"
//               type="email"
//               placeholder="E-Mail"
//               value={loginForm.email}
//               onChange={handleLoginChange}
//               className="w-full px-5 py-3 rounded-full shadow text-black font-semibold placeholder-black/60 focus:outline-none"
//               required
//             />
//             <input
//               name="password"
//               type="password"
//               placeholder="Password"
//               value={loginForm.password}
//               onChange={handleLoginChange}
//               className="w-full px-5 py-3 rounded-full shadow text-black font-semibold placeholder-black/60 focus:outline-none"
//               required
//             />
//             <button
//               type="submit"
//               className="w-full bg-[#1D3D4C] text-white py-3 rounded-full font-semibold shadow hover:bg-[#16313E] transition"
//             >
//               Log In
//             </button>
//           </form>
//         )}

//         {/* Signup Form */}
//         {activeTab === 'signup' && (
//           <form onSubmit={handleSignupSubmit} className="space-y-4">
//             <input
//               name="name"
//               type="text"
//               placeholder="Nama"
//               value={signupForm.name}
//               onChange={handleSignupChange}
//               className="w-full px-5 py-3 rounded-full shadow text-black font-semibold placeholder-black/60 focus:outline-none"
//               required
//             />
//             <input
//               name="phone"
//               type="tel"
//               placeholder="No.Telp"
//               value={signupForm.phone}
//               onChange={handleSignupChange}
//               className="w-full px-5 py-3 rounded-full shadow text-black font-semibold placeholder-black/60 focus:outline-none"
//               required
//             />
//             <input
//               name="email"
//               type="email"
//               placeholder="E-Mail"
//               value={signupForm.email}
//               onChange={handleSignupChange}
//               className="w-full px-5 py-3 rounded-full shadow text-black font-semibold placeholder-black/60 focus:outline-none"
//               required
//             />
//             <input
//               name="password"
//               type="password"
//               placeholder="Buat Sandi Baru"
//               value={signupForm.password}
//               onChange={handleSignupChange}
//               className="w-full px-5 py-3 rounded-full shadow text-black font-semibold placeholder-black/60 focus:outline-none"
//               required
//             />
//             <button
//               type="submit"
//               className="w-full bg-[#1D3D4C] text-white py-3 rounded-full font-semibold shadow hover:bg-[#16313E] transition"
//             >
//               Sign Up
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
