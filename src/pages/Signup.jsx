import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Mail } from 'lucide-react';
import { papan, } from '../assets';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from "../component/firebase";
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async () => {
    if (!email || !password || !username) {
      setError("Lengkapi semua data terlebih dahulu.");
      return;
    }

    if (username === "__admin__") {
      setError("Username ini tidak diizinkan.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        username,
        role: 'user',
        createdAt: serverTimestamp(),
      });

      localStorage.setItem("username", username);
      localStorage.setItem("role", "user");

      navigate('/halaman');
    } catch (err) {
      console.error("Gagal signup:", err);
      setError(err.message.includes("email-already") ? "Email sudah digunakan!" : "Gagal mendaftar. Coba lagi.");
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
      bg-white/20 backdrop-blur-md rounded-3xl px-6 py-8 lg:py-6
      shadow-lg space-y-8 lg:space-y-4 border border-white/30 z-20 relative
      min-h-[300px] md:min-h-[350px]">
        <h2 className="text-center text-4xl lg:text-3xl font-extrabold text-brown-700">SIGN UP</h2>

        {/* Email */}
        <div className="flex items-center bg-[#fff3d6] rounded-xl px-4 py-3 shadow">
          <Mail size={24} color="black" className="mr-2" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent focus:outline-none w-full font-semibold text-[#5a4633]"
          />
        </div>

        {/* Username */}
        <div className="flex items-center bg-[#fff3d6] rounded-xl px-4 py-3 shadow">
          <User size={24} color="black" className="mr-2" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        {/* Tombol Aksi */}
        <div className="flex justify-between space-x-4">
          <button
            onClick={handleSubmit}
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

        {/* Link ke Signin */}
        <p className="text-center text-blue-600 font-bold mt-2 text-sm">
          SUDAH PUNYA AKUN? <br />
          <a href="/signin" className="underline">MASUK DI SINI</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
