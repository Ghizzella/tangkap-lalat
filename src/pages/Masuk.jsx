import React from 'react';
import { useNavigate } from 'react-router-dom';
import { papan, tombol, back } from '../assets';

function Masuk() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="app-container3 min-h-screen w-full bg-cover bg-center font-chewy font-bold overflow-hidden relative">

      {/* 🔙 Tombol kembali */}
      <img
        src={back}
        alt="Back"
        className="absolute top-5 left-5 w-30 h-30 cursor-pointer z-50"
        onClick={() => navigate('/')}
      />

      {/* 🪧 Judul Papan */}
      <div className="flex items-center justify-center mt-30 sm:mt-26 md:mt-30 lg:mt-10">
        <div className="relative">
          <img
            src={papan}
            alt="Papan"
            className="w-[400px] md:w-[500px] lg:w-[700px]"
          />
          <p className="absolute inset-0 flex items-center justify-center pt-2 sm:pt-4 text-white 
            text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-chewy drop-shadow-md sm:drop-shadow-lg">
            Tangkap Lalat
          </p>
        </div>
      </div>

      {/* 🔐 Tombol Sign In & Sign Up */}
      <div className="flex flex-col items-center justify-center mt-16 sm:mt-20 md:mt-24 lg:mt-24 space-y-10 sm:space-y-12 md:space-y-16">

        {/* ▶️ Sign In */}
        <div className="relative cursor-pointer" onClick={handleSignIn}>
          <img
            src={tombol}
            alt="Tombol"
            className="w-[380px] h-[130px]"
          />
          <p className="absolute inset-0 flex items-center justify-center text-white text-4xl uppercase font-chewy drop-shadow-md sm:drop-shadow-lg">
            Sign In
          </p>
        </div>

        {/* 📝 Sign Up */}
        <div className="relative cursor-pointer" onClick={handleSignUp}>
          <img
            src={tombol}
            alt="Tombol"
            className="w-[380px] h-[130px]"
          />
          <p className="absolute inset-0 flex items-center justify-center text-white text-4xl uppercase font-chewy drop-shadow-md sm:drop-shadow-lg">
            Sign Up
          </p>
        </div>

      </div>
    </div>
  );
}

export default Masuk;
