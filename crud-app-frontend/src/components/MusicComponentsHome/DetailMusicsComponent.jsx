import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DetailLagu = () => {
  const { id } = useParams();
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMusicDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/popular/${id}`); 
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Lagu populer tidak ditemukan");
          }
          const errorData = await response.json();
          throw new Error(errorData.message || `Gagal mengambil data: ${response.status}`);
        }
        
        const responseData = await response.json(); // Ambil seluruh objek respons
        
        if (responseData && responseData.data) {
          setMusic(responseData.data); // Set state 'music' ke objek lagu sebenarnya
        } else {
          throw new Error("Format data API tidak sesuai atau data tidak ditemukan.");
        }

      } catch (err) {
        console.error("Error fetching popular music detail:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMusicDetail();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">Memuat lagu populer...</div>;
  }

  if (error) {
    return <div className="text-center mt-5">Error: {error}</div>;
  }

  if (!music) {
    return <div className="text-center mt-5">Lagu populer tidak ditemukan.</div>;
  }

  const genres = [];
  if (music.genre1) genres.push(music.genre1);
  if (music.genre2) genres.push(music.genre2);
  if (music.genre3) genres.push(music.genre3);

  return (
    <div className="detail-lagu-page">
      <div className="container detail-lagu-content">
        <div className="row">
          <div className="col-md-3 mb-4 mb-md-0">
            <img
              src={music.image || `${import.meta.env.VITE_API_URL_IMAGE}/uploads/system/no-pictures.png`}
              alt={music.title || "Cover Lagu"}
              className="detail-cover-image"
              onError={(e) => { e.target.onerror = null; e.target.src=`${import.meta.env.VITE_API_URL_IMAGE}/uploads/system/no-pictures.png`}}
            />
          </div>

          <div className="col-md-6 detail-lagu-info mb-4 mb-md-0">
            <p className="detail-lagu-label">MUSIK POPULER</p> 
            <h2 className="detail-lagu-title">{music.title || "Judul Tidak Tersedia"}</h2>
            <p className="detail-lagu-subinfo">
              <strong>{music.album || "Album Tidak Diketahui"}</strong> - {music.release_year || music.year || "Tahun Tidak Diketahui"}
            </p>
            <div className="mb-2">
              {genres.length > 0 ? (
                genres.map((g, idx) => (
                  <span key={idx} className="badge-genre">
                    {g}
                  </span>
                ))
              ) : (
                <span className="badge-genre">Genre Tidak Ada</span>
              )}
            </div>
            <div className="detail-lagu-lyrics">{music.lirik || music.lyrics || "Lirik tidak tersedia."}</div>
          </div>

          <div className="col-md-3 detail-artis-box text-center">
            <div className="detail-artis-info d-flex align-items-center">
              <img
                src={music.artistImage || `${import.meta.env.VITE_API_URL_IMAGE}/uploads/system/no-pictures.png`}
                alt={music.artist || "Foto Artis"}
                className="detail-artis-image"
                onError={(e) => { e.target.onerror = null; e.target.src=`${import.meta.env.VITE_API_URL_IMAGE}/uploads/system/no-pictures.png`}}
              />
              <div className="detail-artis-text ms-3 d-flex flex-column justify-content-between">
                <p className="detail-artis-label mb-1">Artis</p>
                <h5 className="detail-artis-nama mt-auto">{music.artist || "Artis Tidak Diketahui"}</h5>
              </div>
            </div>
            <div className="btn-double-group d-flex w-100">
              <div className="dropdown btn-lagu-container">
                <button
                  className="btn-lagu dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false" 
                >
                  DENGARKAN LAGU
                </button>
                <ul className="dropdown-menu w-100 text-center">
                  <li>
                    <a
                      className="dropdown-item"
                      href={music.spotify_link || music.spotifyUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-spotify me-2"></i>Spotify
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href={music.apple_link || music.appleMusicUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-apple me-2"></i>Apple Music
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href={music.youtube_link || music.ytMusicUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-youtube me-2"></i>YouTube Music
                    </a>
                  </li>
                  {music.deezer_link && (
                      <li>
                        <a
                          className="dropdown-item"
                          href={music.deezer_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="bi bi-music-note-beamed me-2"></i>Deezer 
                        </a>
                      </li>
                  )}
                </ul>
              </div>
              <a
                href={music.videoUrl || music.youtube_link || "#"} 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-mv"
              >
                <i className="bi bi-play-circle-fill me-1"></i> MV
              </a>
            </div>
            <a href="#" className="detail-button2">
              KONSER TERDEKAT
            </a>
            <a href="#" className="detail-button2">
              LIHAT ULASAN
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailLagu;
