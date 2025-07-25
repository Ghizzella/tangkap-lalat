import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../component/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import kodokImg from "../assets/kodok2.png";
import bintangImg from "../assets/bintang.png";
import jamImg from "../assets/jam.png";
import { lalat2, lalaticon, back, papankodok } from "../assets";

function Medium() {
  const navigate = useNavigate();
  const [lalats, setLalats] = useState([]);
  const [activeLalats, setActiveLalats] = useState([]);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);
  const [time, setTime] = useState(30);
  const [targetLalat, setTargetLalat] = useState(5);
  const [showPopup, setShowPopup] = useState(null);
  const [showLidah, setShowLidah] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [maxLevel, setMaxLevel] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const frogRef = useRef(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const currentLevelName = `Level ${currentLevel}`;
        const lalatSnapshot = await getDocs(
          query(
            collection(db, "lalat"),
            where("mode", "==", "Medium"),
            where("level", "==", currentLevelName)
          )
        );
        const lalatData = lalatSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLalats(lalatData);

        const totalLalat = lalatData.reduce(
          (sum, l) => sum + (l.jumlahLalat || 1),
          0
        );
        setTargetLalat(totalLalat);

        const sublevelSnapshot = await getDocs(
          query(collection(db, "sublevel"), where("mode", "==", "Medium"))
        );
        const allLevels = sublevelSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const current = allLevels.find(
          (sl) => sl.level === currentLevelName
        );
        setMaxLevel(allLevels.length);

        if (current?.waktu) setTime(current.waktu);
        setStartTime(Date.now());
      } catch (err) {
        console.error("Gagal ambil data game:", err);
      }
    };
    fetchGameData();
  }, [currentLevel]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!showPopup && lalats.length > 0) spawnLalat();
    }, 1200);
    return () => clearInterval(interval);
  }, [lalats, showPopup]);

  useEffect(() => {
    if (showPopup) return;
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (caught >= targetLalat) {
            const durasi = Math.floor((Date.now() - startTime) / 1000);
            setTotalTime((prev) => prev + durasi);
            setShowPopup("win");
          } else {
            setShowPopup("lose");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [caught, showPopup, targetLalat, startTime]);

  const spawnLalat = () => {
    const id = Date.now();
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 40 + 10;
    const randomLalat = lalats[Math.floor(Math.random() * lalats.length)];

    let duration = 5000;
    if (randomLalat.kecepatan === "Medium") duration = 3000;
    if (randomLalat.kecepatan === "Fast") duration = 1500;

    setActiveLalats((prev) => [...prev, { ...randomLalat, id, x, y }]);
    setTimeout(() => {
      setActiveLalats((prev) => prev.filter((l) => l.id !== id));
    }, duration);
  };

  const handleCatch = (id, x, y) => {
    if (!frogRef.current) return;
    const frogRect = frogRef.current.getBoundingClientRect();
    const mouthX = frogRect.left + frogRect.width / 2 + 52;
    const mouthY = frogRect.top + frogRect.height * 0.25;

    setShowLidah({ startX: mouthX, startY: mouthY, endX: x, endY: y });

    const lalatObj = activeLalats.find((l) => l.id === id);
    const poin = lalatObj?.poin || 1;
    setScore((prev) => prev + poin);

    setCaught((prev) => {
      const newCount = prev + 1;
      if (newCount >= targetLalat) {
        const durasi = Math.floor((Date.now() - startTime) / 1000);
        setTotalTime((prev) => prev + durasi);
        setShowPopup("win");
      }
      return newCount;
    });

    setActiveLalats((prev) => prev.filter((l) => l.id !== id));
    setTimeout(() => setShowLidah(null), 300);
  };

  const handleNextLevel = async () => {
    if (currentLevel < maxLevel) {
      setCurrentLevel(currentLevel + 1);
      setCaught(0);
      setShowPopup(null);
      setActiveLalats([]);
    } else {
      const nama = localStorage.getItem("username") || "Guest";

      try {
        // Cek apakah user adalah admin
        const userSnapshot = await getDocs(
          query(collection(db, "users"), where("username", "==", nama))
        );

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          if (userData.role === "admin") {
            navigate("/winnermedium"); // Jangan simpan skor
            return;
          }
        }

        const skorData = {
          nama,
          score,
          waktu: totalTime,
          tanggal: new Date().toISOString(),
        };

        const q = query(
          collection(db, "leaderboard_medium"),
          where("nama", "==", nama)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docRef = doc(db, "leaderboard_medium", snapshot.docs[0].id);
          const existing = snapshot.docs[0].data();

          const existingScore = parseInt(existing.score) || 0;
          const existingTime = parseInt(existing.waktu) || 0;

          const isBetterScore =
            score > existingScore ||
            (score === existingScore && totalTime < existingTime);

          if (isBetterScore) {
            await updateDoc(docRef, skorData);
          }
        } else {
          await addDoc(collection(db, "leaderboard_medium"), skorData);
        }

        navigate("/winnermedium");
      } catch (err) {
        console.error("Gagal simpan skor:", err);
      }
    }
  };

  return (
    <div className="app-container1 min-h-screen bg-blue-300 relative overflow-hidden">
      <img
        src={back}
        alt="Back"
        className="absolute top-5 left-5 w-20 h-20 cursor-pointer z-50"
        onClick={() => navigate("/halaman")}
      />

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-10 z-20">
        <div className="flex items-center gap-2 bg-white/30 px-3 py-1 rounded-full shadow backdrop-blur-md">
          <img src={bintangImg} className="w-10 h-11" alt="bintang" />
          <span className="text-white font-bold text-lg">{score}</span>
        </div>
        <div className="flex items-center gap-2 bg-white/30 px-3 py-1 rounded-full shadow backdrop-blur-md">
          <img src={lalaticon} className="w-10 h-10" alt="lalat" />
          <span className="text-white font-bold text-lg">
            {caught}/{targetLalat}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white/30 px-3 py-1 rounded-full shadow backdrop-blur-md">
          <img src={jamImg} className="w-10 h-10" alt="jam" />
          <span className="text-white font-bold text-lg">{time}</span>
        </div>
      </div>

      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        {showLidah && (
          <line
            x1={showLidah.startX}
            y1={showLidah.startY}
            x2={showLidah.endX}
            y2={showLidah.endY}
            stroke="red"
            strokeWidth="5"
            strokeLinecap="round"
          />
        )}
      </svg>

      <img
        ref={frogRef}
        src={kodokImg}
        className="absolute bottom-40 left-1/2 -translate-x-1/2 w-40 z-10"
        alt="kodok"
      />

      {activeLalats.map((lalat) => (
        <img
          key={lalat.id}
          src={lalat2}
          className="absolute w-20 h-20 animate-fly"
          style={{ top: `${lalat.y}%`, left: `${lalat.x}%`, cursor: "pointer" }}
          onClick={(e) => {
            const rect = e.target.getBoundingClientRect();
            handleCatch(
              lalat.id,
              rect.left + rect.width / 2,
              rect.top + rect.height / 2
            );
          }}
          alt="lalat"
        />
      ))}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative w-[420px] md:w-[550px] p-4">
            <img src={papankodok} alt="papankodok" className="w-full" />
            <div className="absolute top-7 left-10 flex items-center gap-3">
              <h2 className="text-white text-[38px] md:text-5xl font-extrabold font-chewy drop-shadow-md whitespace-nowrap">
                {showPopup === "win" ? "YEAY MENANG!" : "YAH GAGAL"}
              </h2>
            </div>
            <div className="absolute top-[140px] md:top-[150px] left-1/2 transform -translate-x-1/2 text-center w-[85%]">
              <p className="text-white font-bold font-chewy text-[20px] md:text-[22px] drop-shadow-sm leading-snug whitespace-pre-line">
                {showPopup === "win"
                  ? "HEBAT! SEMUA LALAT TERTANGKAP!\nKAMU BISA LANJUT KE LEVEL BERIKUTNYA!"
                  : "Sayang sekali, lalatnya kabur!\nJangan bersedih, mungkin di level\nselanjutnya kamu bisa menangkap semua lalatnya"}
              </p>
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextLevel}
                  className="px-6 py-2 text-lg md:text-xl bg-blue-500 text-white rounded-full hover:bg-blue-600 transition font-chewy cursor-pointer"
                >
                  {currentLevel < maxLevel ? "Lanjut" : "Selesai"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Medium;
