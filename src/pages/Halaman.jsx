import React from 'react';
import { useNavigate } from 'react-router-dom';
import { papan, katak, tombol } from '../assets'; // back dihapus karena tidak digunakan
import { signOut } from 'firebase/auth';
import { auth } from '../component/firebase';

function Halaman() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "user";
  const isAdmin = role === "admin";

  const handleMode = () => {
    navigate('/Mode');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      navigate('/masuk');
    } catch (error) {
      console.error('Logout gagal:', error);
    }
  };

  const handleGoToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="app-container3 min-h-screen w-full bg-cover bg-center font-chewy font-bold overflow-hidden">

      {/* 👑 Tombol Admin jika admin */}
      {isAdmin && (
        <button
          onClick={handleGoToAdmin}
          className="absolute top-10 left-5 bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full shadow-lg z-50 text-xl sm:text-2xl cursor-pointer"
        >
          👑 Admin
        </button>
      )}

      {/* 🔐 Tombol Logout */}
      <button
        onClick={handleLogout}
        className="absolute top-10 right-5 bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full shadow-lg z-50 text-xl sm:text-2xl cursor-pointer"
      >
        Logout
      </button>


      {/* 🪧 Judul Papan */}
      <div className="flex items-center justify-center mt-20">
        <div className="relative">
          <img
            src={papan}
            alt="Papan"
            className="w-[400px] md:w-[500px] lg:w-[550px]"
          />
          <p className="absolute inset-0 flex items-center justify-center pt-4 text-white text-3xl sm:text-5xl font-chewy" style={{ textShadow: '2px 2px 3px black' }}>
            Tangkap Lalat
          </p>
        </div>
      </div>

      {/* 📦 Box Informasi */}
      <div className="mx-auto mt-6 w-[300px] sm:w-[360px] md:w-[400px] h-[320px]
        bg-white/20 backdrop-blur-sm rounded-3xl px-6 pt-4 shadow-lg 
        border border-white/30 flex flex-col justify-between items-center text-center"
      >
        <div className="space-y-2">
          <p className="text-2xl sm:text-3xl font-bold text-[#9dc34c]" style={{ textShadow: '1.5px 1.5px 2px black' }}>
            HALLO ADIK-ADIK !!
          </p>
          <p className="text-lg sm:text-xl font-bold text-white leading-snug" style={{ textShadow: '1.5px 1.5px 2px black' }}>
            AYO TANGKAP LALAT <br /> SEBANYAK-BANYAKNYA
          </p>
        </div>
        <img src={katak} alt="Katak" className="w-[160px] sm:w-[200px] mb-0 pb-0" />
      </div>

      {/* ▶️ Tombol Main */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <div className="relative cursor-pointer" onClick={handleMode}>
          <img src={tombol} alt="Tombol" className="w-[200px] h-[70px]" />
          <p className="absolute inset-0 flex items-center justify-center text-white text-4xl uppercase font-chewy drop-shadow-md sm:drop-shadow-lg">
            Main
          </p>
        </div>
      </div>
    </div>
  );
}

export default Halaman;
