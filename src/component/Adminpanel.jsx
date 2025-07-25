import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import papanadmin from "../assets/papanadmin.png";
import back from "../assets/back.png";
import "./Adminpanel.css";
import { db } from "../component/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  updateDoc,
  deleteDoc,
  doc,
  orderBy
} from "firebase/firestore";

function Adminpanel() {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [dashboardTab, setDashboardTab] = useState("Easy");
  const navigate = useNavigate();

  const [subLevelMode, setSubLevelMode] = useState("Easy");
  const [level, setLevel] = useState("Level 1");
  const [waktu, setWaktu] = useState(30);

  const [kecepatan, setKecepatan] = useState("Slow");
  const [jumlahLalat, setJumlahLalat] = useState(0);
  const [poin, setPoin] = useState(0);
  const [mode, setMode] = useState("Easy");

  const [lalatList, setLalatList] = useState([]);
  const [sublevels, setSublevels] = useState([]);
  const [leaderboards, setLeaderboards] = useState({ Easy: [], Medium: [], Hard: [] });
  const [leaderboardTab, setLeaderboardTab] = useState("Easy");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const lalatSnapshot = await getDocs(collection(db, "lalat"));
      setLalatList(lalatSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const subSnapshot = await getDocs(collection(db, "sublevel"));
      setSublevels(subSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const leaderboardModes = ["Easy", "Medium", "Hard"];
      const leaderboardData = {};
      for (const mode of leaderboardModes) {
        const q = query(collection(db, `leaderboard_${mode.toLowerCase()}`), orderBy("score", "desc"));
        const snapshot = await getDocs(q);
        leaderboardData[mode] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
      setLeaderboards(leaderboardData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteLeaderboard = async (mode, id) => {
    await deleteDoc(doc(db, `leaderboard_${mode.toLowerCase()}`, id));
    fetchData();
  };

  const deleteAllLeaderboard = async (mode) => {
    const snapshot = await getDocs(collection(db, `leaderboard_${mode.toLowerCase()}`));
    const promises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(promises);
    fetchData();
  };

  const handleTambahLalat = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "lalat"), {
        mode,
        level,
        jumlahLalat: Number(jumlahLalat),
        kecepatan,
        poin: Number(poin),
      });
      alert("Lalat berhasil ditambahkan!");
      setKecepatan("Slow");
      setJumlahLalat(0);
      setPoin(0);
      fetchData();
    } catch (error) {
      console.error("Gagal menambah lalat:", error);
    }
  };

  const handleSublevelSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "sublevel"), {
        mode: subLevelMode,
        level,
        waktu: Number(waktu),
      });
      alert("Sublevel disimpan!");
      setWaktu(30);
      fetchData();
    } catch (error) {
      console.error("Gagal simpan sublevel:", error);
    }
  };

  const deleteSublevel = async (id) => {
    await deleteDoc(doc(db, "sublevel", id));
    fetchData();
  };

  const deleteAllSublevel = async () => {
    const snapshot = await getDocs(collection(db, "sublevel"));
    const promises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(promises);
    fetchData();
  };

  const deleteLalat = async (id) => {
    await deleteDoc(doc(db, "lalat", id));
    fetchData();
  };

  const deleteAllLalat = async () => {
    const snapshot = await getDocs(collection(db, "lalat"));
    const promises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(promises);
    fetchData();
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        const groupedByMode = lalatList.reduce((acc, lalat) => {
          const mode = lalat.mode || "Unknown";
          if (!acc[mode]) acc[mode] = [];
          acc[mode].push(lalat);
          return acc;
        }, {});

        const sublevelByMode = sublevels.reduce((acc, s) => {
          if (!acc[s.mode]) acc[s.mode] = [];
          acc[s.mode].push(s);
          return acc;
        }, {});

        return (
          <div className="form-box">
            <h2>Dashboard Slot</h2>
            <div className="tab-buttons">
              {["Easy", "Medium", "Hard"].map((m) => (
                <button key={m} className={dashboardTab === m ? "active" : ""} onClick={() => setDashboardTab(m)}>{m}</button>
              ))}
            </div>
            <div className="dashboard-content">
              <h3>{dashboardTab} Mode</h3>
              <strong>Lalat:</strong>
              <button onClick={deleteAllLalat}>Hapus Semua Lalat</button>
              {groupedByMode[dashboardTab]?.map((item) => (
                <p key={item.id}>
                  🪰 Jumlah: {item.jumlahLalat} | Kecepatan: {item.kecepatan} | Poin: {item.poin} | Level: {item.level}
                  <button onClick={() => deleteLalat(item.id)}>Hapus</button>
                </p>
              )) || <p>-</p>}
              <strong>Sublevel:</strong>
              <button onClick={deleteAllSublevel}>Hapus Semua Sublevel</button>
              {sublevelByMode[dashboardTab]?.map((s) => (
                <p key={s.id}>
                  📍 {s.level} - Waktu: {s.waktu}s
                  <button onClick={() => deleteSublevel(s.id)}>Hapus</button>
                </p>
              )) || <p>-</p>}
            </div>
          </div>
        );

      case "lalat":
        return (
          <form className="form-box" onSubmit={handleTambahLalat}>
            <h2>Tambah Lalat</h2>
            <label>Mode:</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <label>Level Tujuan:</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option>Level 1</option>
              <option>Level 2</option>
              <option>Level 3</option>
              <option>Level 4</option>
              <option>Level 5</option>
            </select>
            <label>Jumlah Lalat:</label>
            <input type="number" value={jumlahLalat} onChange={(e) => setJumlahLalat(e.target.value)} />
            <label>Kecepatan Lalat:</label>
            <select value={kecepatan} onChange={(e) => setKecepatan(e.target.value)}>
              <option>Slow</option>
              <option>Medium</option>
              <option>Fast</option>
            </select>
            <label>Poin:</label>
            <input type="number" value={poin} onChange={(e) => setPoin(e.target.value)} />
            <button type="submit">Tambah</button>
          </form>
        );

      case "sublevel":
        return (
          <form className="form-box" onSubmit={handleSublevelSubmit}>
            <h2>Sub-Level</h2>
            <label>Pilih Mode:</label>
            <select value={subLevelMode} onChange={(e) => setSubLevelMode(e.target.value)}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <label>Pilih Sub-Level:</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option>Level 1</option>
              <option>Level 2</option>
              <option>Level 3</option>
              <option>Level 4</option>
              <option>Level 5</option>
            </select>
            <label>Waktu (detik):</label>
            <input type="number" value={waktu} onChange={(e) => setWaktu(e.target.value)} />
            <button type="submit">Simpan</button>
          </form>
        );

      case "leaderboard":
        return (
          <div className="form-box">
            <h2>Leaderboard</h2>
            <div className="tab-buttons">
              {["Easy", "Medium", "Hard"].map((tab) => (
                <button key={tab} className={leaderboardTab === tab ? "active" : ""} onClick={() => setLeaderboardTab(tab)}>{tab}</button>
              ))}
            </div>
            <button onClick={() => deleteAllLeaderboard(leaderboardTab)} style={{ marginTop: "10px" }}>Hapus Semua {leaderboardTab}</button>
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Skor</th>
                  <th>Waktu</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {leaderboards[leaderboardTab]?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nama}</td>
                    <td>{item.score}</td>
                    <td>{item.waktu}</td>
                    <td>{item.tanggal?.substring(0, 10)}</td>
                    <td><button onClick={() => deleteLeaderboard(leaderboardTab, item.id)}>Hapus</button></td>
                  </tr>
                )) || <tr><td colSpan="5">Belum ada data</td></tr>}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* Tombol Back */}
      <img
        src={back}
        alt="Back"
        className="absolute top-5 left-5 w-20 h-20 cursor-pointer z-50"
        onClick={() => navigate("/halaman")}
      />

      <div className="judul-wrapper">
        <img src={papanadmin} alt="Papan Admin" className="judul-admin" />
        <h1 className="judul-teks">Admin Panel</h1>
      </div>
      <div className="admin-panel">
        <aside className="sidebar">
          <button onClick={() => setSelectedMenu("dashboard")}>Dashboard</button>
          <button onClick={() => setSelectedMenu("lalat")}>Lalat</button>
          <button onClick={() => setSelectedMenu("sublevel")}>Sub-Level</button>
          <button onClick={() => setSelectedMenu("leaderboard")}>Leaderboard</button>
        </aside>
        <main className="main-content">{renderContent()}</main>
      </div>
    </div>
  );
}

export default Adminpanel;
