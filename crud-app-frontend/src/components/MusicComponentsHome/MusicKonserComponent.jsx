// src/components/MusicComponentsHome/PopularComponentMusic.js
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap"; // Col dan Row tidak lagi digunakan di sini
import api from "../../api/axios";
import { Link } from "react-router-dom";

// Komponen menerima props filter dari induk
const KonserComponentMusic = ({ 

  activeFilter = 'Lihat Semua', 
  selectedGenre = '', 
  ratingSortDirection = 'desc',
  onGenresLoaded
}) => {
  const [originalMusics, setOriginalMusics] = useState([]);
  const [displayedMusics, setDisplayedMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect untuk mengambil data (berjalan sekali)
  useEffect(() => {
    const getMusicData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/music/?include=all");

        if (data && Array.isArray(data.data)) {
          setOriginalMusics(data.data);

          // Panggil callback untuk mengirim genre ke parent
          if (onGenresLoaded) {
            const allGenres = [];
            data.data.forEach(music => {
              if (music.genre1) allGenres.push(music.genre1);
              if (music.genre2) allGenres.push(music.genre2);
              if (music.genre3) allGenres.push(music.genre3);
            });
            const uniqueGenres = [...new Set(allGenres)];
            onGenresLoaded(uniqueGenres);
          }
        } else {
          throw new Error("Format data dari API tidak sesuai.");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Terjadi kesalahan.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getMusicData();
  }, [onGenresLoaded]);

  // useEffect untuk memfilter dan sorting data (berjalan saat filter berubah)
  useEffect(() => {
    if (originalMusics.length === 0 && !loading) return; 

    let processedMusics = [...originalMusics];

    if (activeFilter === 'Genre' && selectedGenre) {
      processedMusics = processedMusics.filter(music => 
        music.genre1 === selectedGenre ||
        music.genre2 === selectedGenre ||
        music.genre3 === selectedGenre
      );
    }

    switch (activeFilter) {
      case 'Lihat Semua':
        processedMusics.sort((a, b) => a.id - b.id);
        break;
      case 'Terbaru':
        processedMusics.sort((a, b) => b.id - a.id);
        break;
      case 'Rating':
        processedMusics.sort((a, b) => 
          ratingSortDirection === 'desc' ? (b.rating || 0) - (a.rating || 0) : (a.rating || 0) - (b.rating || 0)
        );
        break;
      default:
        break;
    }
    
    setDisplayedMusics(processedMusics);
  }, [activeFilter, selectedGenre, ratingSortDirection, originalMusics, loading]);


  const truncateText = (text, maxLength) => {
    if (typeof text !== 'string') return '';
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  // Tampilan loading, error, dan data kosong tetap sama
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5">
        <Spinner animation="border" />
        <span className="ms-2">Memuat musik...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center my-5 text-danger">Error: {error}</div>;
  }

  if (!displayedMusics || displayedMusics.length === 0) {
    return <div className="text-center my-5">Tidak ada musik untuk ditampilkan sesuai filter ini.</div>;
  }

  return (
  
    <div className="horizontal-scroll-wrapper">
      <div className="horizontal-scroll-content">
        {displayedMusics.map((music) => (
          
          <div key={music.id} className="music-popular-item-scroll">
            <Link to={`/Music/${music.id}`} className="text-decoration-none">
              <div className="music-popular-card h-100">
                <img
                  src={`${import.meta.env.VITE_API_URL_IMAGE}/${music.image}`}
                  alt={music.title || "Gambar Musik"}
                  className="music-popular-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/280x266/EBF4FA/1F2937?text=Error";
                  }}
                />
                <div className="music-popular-info">
                  <p className="music-popular-title">
                    {truncateText(music.title, 20)}
                  </p>
                  <p className="music-popular-artist">
                    {truncateText(music.artists, 25) || "Artis Tidak Ada"}
                  </p>
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
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default KonserComponentMusic;
