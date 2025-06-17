// src/components/KonserTerbaruComponent.js
import React, { useState, useEffect } from "react";
import { Col, Spinner } from 'react-bootstrap'; // Import Spinner untuk loading
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
        // Ganti URL ini dengan URL lengkap ke backend Anda
        const response = await fetch("http://localhost:3000/api/konser");

        if (!response.ok) {
          throw new Error(`Gagal mengambil data, status: ${response.status}`);
        }

        let data = await response.json();

        // Cek jika data ada di dalam properti 'data', mirip contoh Anda
        if (data && data.data && Array.isArray(data.data)) {
          data = data.data;
        } else if (!Array.isArray(data)) {
          // Jika format tidak sesuai, lemparkan error
          throw new Error("Format data dari API tidak sesuai.");
        }

        // 1. Urutkan data berdasarkan ID dari yang terbesar (terbaru)
        const sortedKonser = data.sort((a, b) => b.id - a.id);
        
        // 2. Ambil hanya 4 data pertama dari hasil urutan
        const latestFourKonser = sortedKonser.slice(0, 4);

        // 3. Simpan 4 data terbaru ke dalam state
        setKonser(latestFourKonser);

      } catch (e) {
        console.error("Gagal mengambil data konser:", e);
        setError(e.message || "Gagal memuat data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchKonserTerbaru();
  }, []); // Dependensi kosong `[]` berarti efek ini hanya berjalan sekali

  // Fungsi untuk membatasi deskripsi
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
              to={`/konser/${item.id}`} 
              className="text-decoration-none text-dark"
            >
              <div className='card-music'> 
                <div className='card-music-img'>
                  <img src={`http://localhost:3000/${item.image}`} alt={item.nama_konser} className='img-fluid mb-2'/>
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