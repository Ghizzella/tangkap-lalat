// component/Pemain.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Pemain() {
  const [nama, setNama] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nama.trim() === "") {
      alert("Nama tidak boleh kosong!");
      return;
    }

    // Simpan nama ke localStorage
    localStorage.setItem("nama", nama);

    // Navigasi ke halaman permainan (misalnya Easy)
    navigate("/easy");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center font-chewy"
      >
        <h2 className="text-3xl mb-6 text-blue-600">Masukkan Nama Pemain</h2>
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full px-4 py-2 rounded border border-blue-300 mb-4 text-xl"
          placeholder="Contoh: Ella"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-xl"
        >
          Mulai Bermain
        </button>
      </form>
    </div>
  );
}

export default Pemain;
