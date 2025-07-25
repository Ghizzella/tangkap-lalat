import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/home";
import Masuk from "./pages/Masuk";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Halaman from "./pages/Halaman";
import Mode from "./pages/Mode";
import Easy from "./pages/Easy";
import Medium from "./pages/Medium";
import Hard from "./pages/Hard";
import Winnereasy from "./pages/Winnereasy";
import Winnermedium from "./pages/Winnermedium";
import Winnerhard from "./pages/Winnerhard";

// Components
import Pemain from "./component/Pemain";
import Adminpanel from "./component/Adminpanel";

// 🔊 Audio
import backsound from "./assets/audio/backsound.mp3"; 

function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(backsound);
      audio.loop = true;
      audio.volume = 0.3;
      audioRef.current = audio;
    }

    const playAudio = () => {
      audioRef.current?.play().catch((err) => {
        console.warn("Audio gagal diputar:", err);
      });
      window.removeEventListener("click", playAudio); // hanya sekali
    };

    // 🔊 Mainkan audio saat user klik pertama kali
    window.addEventListener("click", playAudio);

    return () => {
      window.removeEventListener("click", playAudio);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/masuk" element={<Masuk />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/halaman" element={<Halaman />} />
        <Route path="/mode" element={<Mode />} />
        <Route path="/easy" element={<Easy />} />
        <Route path="/medium" element={<Medium />} />
        <Route path="/hard" element={<Hard />} />
        <Route path="/winnereasy" element={<Winnereasy />} />
        <Route path="/winnermedium" element={<Winnermedium />} />
        <Route path="/winnerhard" element={<Winnerhard />} />
        <Route path="/pemain" element={<Pemain />} />
        <Route path="/admin" element={<Adminpanel />} />
      </Routes>
    </Router>
  );
}

export default App;
