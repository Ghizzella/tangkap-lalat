import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../component/firebase";
import { papan } from "../assets";

function WinnerEasy() {
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(
          collection(db, "leaderboard_easy"),
          orderBy("score", "desc")
        );
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

  const filteredLeaderboard = leaderboard.filter(
    (item) =>
      item.nama &&
      item.nama.toLowerCase() !== "admin" &&
      item.nama.toLowerCase() !== "__admin__" &&
      item.role !== "admin"
  );

  return (
    <div className="app-container min-h-screen w-full font-chewy overflow-x-hidden bg-blue-200 py-6 px-4 sm:px-6 md:px-10">
      {/* Judul */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-[90vw] sm:max-w-[500px]">
          <img src={papan} alt="Papan" className="w-full" />
          <p className="absolute inset-0 flex items-center justify-center pt-6 text-white text-4xl sm:text-4xl md:text-5xl font-chewy drop-shadow-lg">
            Leaderboard Easy
          </p>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white/80 max-w-5xl mx-auto rounded-xl shadow-lg p-2 md:p-4 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full text-left border-collapse">
            <thead>
              <tr className="text-base sm:text-lg text-blue-800 font-bold border-b border-blue-300">
                <th className="py-2 px-2">Peringkat</th>
                <th className="py-2 px-2">Nama</th>
                <th className="py-2 px-2">Skor</th>
                <th className="py-2 px-2">Waktu (detik)</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaderboard.map((item, index) => (
                <tr key={index} className="text-sm sm:text-base text-gray-700">
                  <td className="py-2 px-2">{index + 1}</td>
                  <td className="py-2 px-2">{item.nama}</td>
                  <td className="py-2 px-2">{item.score}</td>
                  <td className="py-2 px-2">{item.waktu}</td>
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
      </div>

      {/* Tombol kembali */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/halaman")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow font-bold text-base sm:text-lg"
        >
          Kembali ke Halaman Utama
        </button>
      </div>
    </div>
  );
}

export default WinnerEasy;
