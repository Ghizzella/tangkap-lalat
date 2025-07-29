import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { papan, } from '../assets';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../component/firebase';
import { doc, getDoc } from 'firebase/firestore';

function Signin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email dan Password wajib diisi.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Cek khusus untuk admin hardcoded
      if (email === "adminlalat@gmail.com") {
        localStorage.setItem("username", "Admin");
        localStorage.setItem("role", "admin");
        navigate('/halaman');
        return;
      }

      // Ambil role user dari Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const role = userData.role || "user";

        localStorage.setItem("username", userData.username || "Guest");
        localStorage.setItem("role", role); // ✅ Tambahkan ini


        navigate('/halaman');
      } else {
        setError("Data pengguna tidak ditemukan di Firestore.");
      }

    } catch (err) {
      console.error("Login error:", err.message);
      setError("Email atau Password salah!");
      setPassword('');
    }
  };

  return (
    <div className="app-container3 min-h-screen w-full bg-cover bg-center font-chewy font-bold overflow-hidden">
      {/* Judul */}
      <div className="flex items-center justify-center mt-1">
        <div className="relative">
          <img src={papan} alt="Papan" className="w-[300px] md:w-[375px]" />
          <p className="absolute inset-0 flex items-center justify-center pt-2 sm:pt-4 text-white text-2xl sm:text-4xl font-chewy drop-shadow-md sm:drop-shadow-lg">
            Tangkap Lalat
          </p>
        </div>
      </div>

      {/* Form Box */}
      <div className="mx-auto mt-24 lg:mt-10 w-[300px] sm:w-[360px] md:w-[400px] lg:w-[500px]
  bg-white/20 backdrop-blur-md rounded-3xl px-6 py-8
  shadow-lg space-y-8 lg:space-y-6 border border-white/30 z-20 relative
  min-h-[300px] md:min-h-[350px]">
        <h2 className="text-center text-4xl lg:text-3xl font-extrabold text-brown-700">SIGN IN</h2>

        {/* Email */}
        <div className="flex items-center bg-[#fff3d6] rounded-xl px-4 py-3 shadow">
          <User size={24} color="black" className="mr-2" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent focus:outline-none w-full font-semibold text-[#5a4633]"
          />
        </div>

        {/* Password */}
        <div className="flex items-center bg-[#fff3d6] rounded-xl px-4 py-3 shadow relative">
          <Lock size={24} color="black" className="mr-2" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent focus:outline-none w-full font-semibold text-[#5a4633] pr-10"
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={24} color="black" /> : <Eye size={24} color="black" />}
          </span>
        </div>

        {/* Error */}
        {error && <p className="text-red-600 text-center text-sm">{error}</p>}

        {/* Tombol */}
        <div className="flex justify-between space-x-4">
          <button
            onClick={handleLogin}
            className="flex-1 bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 rounded-full shadow-md"
          >
            SUBMIT
          </button>
          <button
            onClick={() => navigate('/masuk')}
            className="flex-1 bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 rounded-full shadow-md"
          >
            BERANDA
          </button>
        </div>

        {/* Link Daftar */}
        <p className="text-center text-blue-600 font-bold mt-2 text-sm">
          BELUM PUNYA AKUN? <br />
          <a href="/signup" className="underline">DAFTAR DI SINI</a>
        </p>
      </div>
    </div>
  );
}

export default Signin;
