import React from 'react';
import { useNavigate } from 'react-router-dom';
import { papan, tombol, lalat } from '../assets';

function Home() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/masuk');
  };

  return (
    <div className="app-container3 min-h-screen w-full bg-cover bg-center font-chewy font-bold overflow-hidden relative">

      {/* Lalat mengambang */}
      <img
        src={lalat}
        alt="Lalat"
        className="absolute top-[55%] left-1/3 w-[100px] sm:w-[130px] md:w-[150px] animate-bounce"
      />

      {/* Papan Judul */}
      <div className="absolute top-32 sm:top-24 md:top-16 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          <img
  src={papan}
  alt="Papan"
  className="
    w-[400px]       // 📱 lebih besar di mobile
    sm:w-[440px]
    md:w-[480px]
    lg:w-[520px]
  "
/>

          <p className="absolute inset-0 flex items-center justify-center pt-3 
            text-white text-2xl sm:text-3xl md:text-5xl font-chewy drop-shadow-md sm:drop-shadow-lg">
            Tangkap Lalat
          </p>
        </div>
      </div>

      {/* Tombol Main */}
      <div className="absolute bottom-24 sm:bottom-20 md:bottom-16 left-1/2 transform -translate-x-1/2">
        <div className="relative cursor-pointer" onClick={handleNavigate}>
          <img
            src={tombol}
            alt="Tombol"
            className="
              w-[240px] h-[85px]         // 📱 mobile lebih besar dari sebelumnya
              sm:w-[280px] sm:h-[95px]
              md:w-[320px] md:h-[105px]
              lg:w-[360px] lg:h-[115px]
            "
          />
          <p className="absolute inset-0 flex items-center justify-center text-white 
            text-2xl sm:text-3xl md:text-4xl uppercase font-chewy drop-shadow-md sm:drop-shadow-lg">
            Main
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
