import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const DetailMusicsPage = () => {
  const { id } = useParams();
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMusicDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mengubah port dari 3001 ke 3000
        const response = await fetch(`http://localhost:3000/api/music/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Musik tidak ditemukan");
          }
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Gagal mengambil data: ${response.status}`
          );
        }

        const responseData = await response.json(); // Ambil seluruh objek respons

        if (responseData && responseData.data) {
          setMusic(responseData.data); // Set state 'music' ke objek musik sebenarnya
        } else {
          throw new Error(
            "Format data API tidak sesuai atau data tidak ditemukan."
          );
        }
      } catch (err) {
        console.error("Error fetching music detail:", err);
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
    return (
      <div className="w-100 min-vh-100 d-flex justify-content-center align-items-center">
        <h2>Memuat detail musik...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-100 min-vh-100 d-flex justify-content-center align-items-center">
        <h2>Error: {error}</h2>
      </div>
    );
  }

  if (!music) {
    return (
      <div className="w-100 min-vh-100 d-flex justify-content-center align-items-center">
        <h2>Musik tidak ditemukan</h2>
      </div>
    );
  }

  // Logika untuk genre, dipindahkan dari DetailLagu
  const genres = [];
  if (music.genre1) genres.push(music.genre1);
  if (music.genre2) genres.push(music.genre2);
  if (music.genre3) genres.push(music.genre3);

  return (
    <div className="w-100 min-vh-100 detail-lagu-page">
      <Container>
        <div className="box-carousel-musics mt-4 mb-4">
          <Carousel controls={false} indicators={false}>
            <Carousel.Item>
              <img
                className="d-block w-100 rounded-4"
                src={
                  music.carouselImage ||
                  `http://localhost:3000/${music.image}` ||
                  "https://placehold.co/1200x400/EBF4FA/1F2937?text=No+Image"
                }
                alt={music.title || "Gambar musik"}
                style={{ maxHeight: "400px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/1200x400/EBF4FA/1F2937?text=Error+Loading+Image";
                }}
              />
            </Carousel.Item>
          </Carousel>
        </div>

        {/* Konten detail musik yang sebelumnya ada di DetailMusicsComponent/DetailLagu */}
        <div className="container detail-lagu-content">
          <div className="row">
            <div className="col-md-3 mb-4 mb-md-0">
              <img
                src={
                  `http://localhost:3000/${music.image}` ||
                  "https://placehold.co/300x300/EBF4FA/1F2937?text=No+Cover"
                }
                alt={music.title || "Cover Lagu"}
                className="detail-cover-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/300x300/EBF4FA/1F2937?text=Error";
                }}
              />
            </div>

            <div className="col-md-6 detail-lagu-info mb-4 mb-md-0">
              <p className="detail-lagu-label">MUSIK</p>
              <h2 className="detail-lagu-title">
                {music.title || "Judul Tidak Tersedia"}
              </h2>
              <p className="detail-lagu-subinfo">
                <strong>{music.album || "Album Tidak Diketahui"}</strong> -{" "}
                {music.release_year || music.year || "Tahun Tidak Diketahui"}
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
              <div className="detail-lagu-lyrics">
                {music.lirik || music.lyrics || "Lirik tidak tersedia."}
              </div>
            </div>

            <div className="col-md-3 detail-artis-box text-center">
              <div className="detail-artis-info d-flex align-items-center">
                <img
                  src={
                    music.artistImage ||
                    "https://placehold.co/80x80/EBF4FA/1F2937?text=Artis"
                  }
                  alt={music.artist || "Foto Artis"}
                  className="detail-artis-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/80x80/EBF4FA/1F2937?text=Error";
                  }}
                />
                <div className="detail-artis-text ms-3 d-flex flex-column justify-content-between">
                  <p className="detail-artis-label mb-1">Artis</p>
                  <h5 className="detail-artis-nama mt-auto">
                    {music.artist || "Artis Tidak Diketahui"}
                  </h5>
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
              <Link to={`/reviewmusics/1`} className="detail-button2">
                LIHAT ULASAN
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DetailMusicsPage;
