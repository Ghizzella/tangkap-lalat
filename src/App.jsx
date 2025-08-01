import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
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

  useEffect(() => {
		const preventZoom = (e) => {
			if (e.touches.length > 1) e.preventDefault();
		};

		let lastTouchEnd = 0;
		const preventDoubleTapZoom = (e) => {
			const now = Date.now();
			if (now - lastTouchEnd <= 300) e.preventDefault();
			lastTouchEnd = now;
		};

		const preventWheelZoom = (e) => {
			if (e.ctrlKey) e.preventDefault();
		};

		const preventKeyboardZoom = (e) => {
			if (
				(e.ctrlKey || e.metaKey) &&
				(e.key === "+" || e.key === "-" || e.key === "=")
			) {
				e.preventDefault();
			}
		};

		document.addEventListener("touchstart", preventZoom, { passive: false });
		document.addEventListener("touchend", preventDoubleTapZoom);
		window.addEventListener("wheel", preventWheelZoom, { passive: false });
		window.addEventListener("keydown", preventKeyboardZoom);

		return () => {
			document.removeEventListener("touchstart", preventZoom);
			document.removeEventListener("touchend", preventDoubleTapZoom);
			window.removeEventListener("wheel", preventWheelZoom);
			window.removeEventListener("keydown", preventKeyboardZoom);
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
