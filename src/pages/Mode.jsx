import React from 'react';
import { useNavigate } from 'react-router-dom';
import { papan, tombol, lalat, back } from '../assets';

function Mode() {
  const navigate = useNavigate();

  const handleeasy = () => {
    navigate('/easy');
  };

  const handlemedium = () => {
    navigate('/medium');
  };

  const handlehard = () => {
    navigate('/hard');
  };

  return (
    <div className="app-container3 min-h-screen w-full bg-cover bg-center font-chewy font-bold overflow-hidden">

      <img
        src={back}
        alt="Back"
        className="absolute top-5 left-5 w-30 h-30 cursor-pointer z-50"
        onClick={() => navigate('/halaman')}
      />

      {/* Lalat animasi */}
      <img
        src={lalat}
        alt="Lalat"
        className="absolute bottom-[38%] left-[30%] w-[140px] animate-bounce"
      />

      {/* Papan Judul */}
      <div className="flex items-center justify-center mt-30 sm:mt-26 md:mt-30 lg:mt-6">
        <div className="relative">
          <img src={papan} alt="Papan" className="w-[300px] md:w-[375px]" />
          <p className="absolute inset-0 flex items-center justify-center pt-2 sm:pt-4 text-white text-2xl sm:text-4xl font-chewy drop-shadow-md sm:drop-shadow-lg">
            Tangkap Lalat
          </p>
        </div>
      </div>

      {/* Kontainer tombol Sign In & Sign Up */}
      <div className="flex flex-col items-center justify-center mt-10 space-y-10 lg:space-y-6 lg:mt-8">

        {/* Tombol Sign In */}
        <div className="relative cursor-pointer" onClick={handleeasy}>
          <img
            src={tombol}
            alt="Tombol"
            className="w-[290px] h-[100px] lg:w-[270px] lg:h-[90px]" // Lebih kecil dari 280x90
          />
          <p className="absolute inset-0 flex items-center justify-center text-white text-4xl uppercase font-chewy drop-shadow-md sm:drop-shadow-lg">
            easy
          </p>
        </div>

        {/* Tombol Sign Up */}
        <div className="relative cursor-pointer" onClick={handlemedium}>
          <img
            src={tombol}
            alt="Tombol"
            className="w-[290px] h-[100px] lg:w-[270px] lg:h-[90px]" // Sama dengan Sign In
          />
          <p className="absolute inset-0 flex items-center justify-center text-white text-4xl uppercase font-chewy drop-shadow-md sm:drop-shadow-lg">
            medium
          </p>
        </div>

        <div className="relative cursor-pointer" onClick={handlehard}>
          <img
            src={tombol}
            alt="Tombol"
            className="w-[290px] h-[100px] lg:w-[270px] lg:h-[90px]" // Sama dengan Sign In
          />
          <p className="absolute inset-0 flex items-center justify-center text-white text-4xl uppercase font-chewy drop-shadow-md sm:drop-shadow-lg">
            hard
          </p>
        </div>
      </div>
    </div>
  );
}

export default Mode;
