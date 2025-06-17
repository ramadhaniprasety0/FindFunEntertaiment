// src/components/KonserTerbaruComponent.js
import React, { useState, useEffect } from "react";
import { Col, Spinner } from 'react-bootstrap';
import api from "../../api/axios";
import { Link } from "react-router-dom";

const KonserTerbaruComponent = () => {
  const [konser, setKonser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKonserTerbaru = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/konser");

        if (!response.data) {
          throw new Error(`Gagal mengambil data, status: ${response.status}`);
        }

        const konserData = response.data.data || response.data;

        if (!Array.isArray(konserData)) {
          throw new Error("Format data dari API tidak sesuai. Diharapkan array.");
        }

        const sortedKonser = [...konserData].sort((a, b) => b.id - a.id);
        
        const latestFourKonser = sortedKonser.slice(0, 4);

        setKonser(latestFourKonser);

      } catch (e) {
        console.error("Gagal mengambil data konser:", e);
        setError(e.message || "Gagal memuat data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchKonserTerbaru();
  }, []); 
  
  const limitDescriptionWords = (deskripsi_acara, wordLimit) => {
    if (!deskripsi_acara) return "Deskripsi tidak tersedia.";
    const words = deskripsi_acara.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return deskripsi_acara;
  };

  // Tampilan saat loading
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5">
        <Spinner animation="border" />
        <span className="ms-2">Memuat konser terbaru...</span>
      </div>
    );
  }

  // Tampilan saat error
  if (error) {
    return <div className="text-center my-5 text-danger">Error: {error}</div>;
  }
  
  // Tampilan jika tidak ada data
  if (!konser || konser.length === 0) {
    return (
        <div className="text-center my-5">Tidak ada konser untuk ditampilkan.</div>
    );
  }

  // Render 4 card konser
  return (
    <>
      {konser.map((item) => {
        const truncatedDesc = limitDescriptionWords(item.deskripsi_acara, 5);

        return (
          <Col key={item.id} lg={3} md={6} sm={12} className='card-konser-musics p-2'>
            <Link 
              to={`/music/konser/detail/${item.id}`} 
              className="text-decoration-none text-dark"
            >
              <div className='card-music'> 
                <div className='card-music-img'>
                  <img src={`${import.meta.env.VITE_API_URL_IMAGE}/${item.image}`} alt={item.nama_konser} className='img-fluid mb-2'/>
                </div>
                <div className='card-music-caption'>
                  <p className='heading'>{item.nama_konser}</p>
                  <p>{truncatedDesc}</p>
                </div>
              </div>
            </Link>
          </Col>
        );
      })}
    </>
  );
};

export default KonserTerbaruComponent;