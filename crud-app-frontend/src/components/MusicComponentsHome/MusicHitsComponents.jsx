// src/components/MusicHitsComponents.js
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const MusicHitsComponents = () => {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMusicHits = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(
        "/music/?include=all"
      );

      if (data && Array.isArray(data.data)) {
        // Sorting dan limit tetap dipertahankan
        const sortedMusics = data.data.sort((a, b) => b.id - a.id);
        const latestFiveMusics = sortedMusics.slice(0, 4);
        setMusics(latestFiveMusics);
      } else {
        throw new Error("Format data dari API tidak sesuai.");
      }
    } catch (error) {
      console.error("Error fetching music hits:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan saat mengambil data musik.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMusicHits();
  }, []);

  const truncateText = (text, maxLength) => {
    if (typeof text !== "string") return "";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5">
        <Spinner animation="border" />
        <span className="ms-2">Memuat musik hits...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center my-5 text-danger">Error: {error}</div>;
  }

  if (!musics || musics.length === 0) {
    return (
      <div className="text-center my-5">Tidak ada musik untuk ditampilkan.</div>
    );
  }

  return (
    <div className="music-grid-container">
      {musics.map((music) => (
        <div key={music.id} className="music-card-wrapper">
          <Link to={`/music/${music.id}`} className="text-decoration-none">
            <div className="music-card">
              <img
                src={`${import.meta.env.VITE_API_URL_IMAGE}/${music.image}`}
                alt={music.title || "Gambar Musik"}
                className="music-card-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/200x200/4A4E9B/FFFFFF?text=Error";
                }}
              />
              <div className="music-card-info">
                <p className="music-card-title">
                  {truncateText(music.title, 20)}
                </p>
                <p className="music-card-artist">
                  {truncateText(music.artists, 25)}
                </p>
              </div>
              <div className="music-popular-controls">
                <div className="icon-group-left">
                  <i className="fa-regular fa-heart"></i>
                </div>
                <div className="icon-group-right">
                  <div className="play-button">
                    <i className="fa-solid fa-play"></i>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MusicHitsComponents;
