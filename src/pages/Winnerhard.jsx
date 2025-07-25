import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../component/firebase";
import { papan, kodok } from "../assets";

function WinnerHard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, "leaderboard_hard"), orderBy("score", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const item = doc.data();
          return {
            ...item,
            waktu:
              typeof item.waktu === "object" && item.waktu.seconds
                ? item.waktu.seconds
                : item.waktu || 0,
            score: parseInt(item.score) || 0,
          };
        });
        setLeaderboard(data);
      } catch (error) {
        console.error("Gagal mengambil leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const filteredLeaderboard = leaderboard.filter(item => item.nama !== "__admin__");

  return (
    <div className="app-container min-h-screen w-full font-chewy overflow-hidden relative py-10 px-4 sm:px-10">

      <div className="flex justify-center mb-10">
        <div className="relative">
          <img src={papan} alt="Papan" className="w-[400px] md:w-[500px] lg:w-[550px]" />
          <p className="absolute inset-0 flex items-center justify-center pt-6 text-white text-3xl sm:text-5xl md:text-5xl font-chewy drop-shadow-lg">
            Leaderboard Hard
          </p>
        </div>
      </div>

      <div className="bg-white/80 max-w-3xl mx-auto rounded-xl shadow-lg p-6 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xl text-blue-800 font-bold border-b border-blue-300">
              <th className="py-2">Peringkat</th>
              <th className="py-2">Nama</th>
              <th className="py-2">Skor</th>
              <th className="py-2">Waktu (detik)</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboard.map((item, index) => (
              <tr key={index} className="text-lg text-gray-700">
                <td className="py-2">{index + 1}</td>
                <td className="py-2">{item.nama}</td>
                <td className="py-2">{item.score}</td>
                <td className="py-2">{item.waktu}</td>
              </tr>
            ))}
            {filteredLeaderboard.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-red-500">
                  Belum ada data skor
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/halaman")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow font-bold text-lg"
        >
          Kembali ke Halaman Utama
        </button>
      </div>
    </div>
  );
}

export default WinnerHard;
