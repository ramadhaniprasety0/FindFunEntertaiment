import React, { useState, useEffect, useMemo } from "react";
import { Col, Image, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

import api from "../../api/axios";

const formatTanggal = (tanggalISO) => {
  if (!tanggalISO) return "";
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Intl.DateTimeFormat('id-ID', options).format(new Date(tanggalISO));
};

const formatRupiah = (angka) => {
  if (isNaN(angka)) return "";
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);
};

const getHargaFromString = (infoTiketString) => {
  if (!infoTiketString || typeof infoTiketString !== 'string') {
    return { harga_terendah: null, harga_tertinggi: null };
  }
  try {
    const prices = infoTiketString.split(',').map(tiket => {
      const hargaStr = tiket.split(':')[1];
      return parseInt(hargaStr, 10);
    });
    const harga_terendah = Math.min(...prices);
    const harga_tertinggi = Math.max(...prices);
    return { harga_terendah, harga_tertinggi };
  } catch (error) {
    console.error("Gagal parse harga:", infoTiketString, error);
    return { harga_terendah: null, harga_tertinggi: null };
  }
};


const KonserMendatangComponent = ({ filterBy, sortByPrice }) => {
  const [konser, setKonser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKonserMendatang = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/konser");
        const result = response.data;

        if (result && result.data && Array.isArray(result.data)) {
          const augmentedData = result.data.map(item => {
            const hargaData = getHargaFromString(item.info_tiket);
            return {
              ...item, 
              harga_terendah: hargaData.harga_terendah, 
              harga_tertinggi: hargaData.harga_tertinggi, 
            };
          });
          setKonser(augmentedData);
          // ----------------------------------------------------
        } else {
          throw new Error("Format data dari API tidak sesuai.");
        }
      } catch (e) {
        console.error("Gagal mengambil data konser:", e);
        setError(e.message || "Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };
    fetchKonserMendatang();
  }, []);

  const processedKonser = useMemo(() => {
    let data = [...konser];

    if (filterBy === 'tersedia') {
      data = data.filter(item => item.status !== 'Tiket Habis');
    }

    if (sortByPrice) {
      data.sort((a, b) => {
        // Langsung gunakan properti yang sudah kita buat
        const priceA = a.harga_terendah ?? 0;
        const priceB = b.harga_terendah ?? 0;
        return sortByPrice === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    return data;
  }, [konser, filterBy, sortByPrice]);


  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;
  if (error) return <p className="text-center text-danger p-5">Error: {error}</p>;

  return (
    <>
      {processedKonser.length > 0 ? (
        processedKonser.map((item) => (
          <Col key={item.id} xs={12} className="konser-item-wrapper mb-3">
            <Link to={`/music/konser/detail/${item.id}`} className="text-decoration-none">
              <div className="konser-item-card new-layout">
                {/* ... Isi Kartu (Gambar, Judul, dll) ... */}
                <div className="konser-image-section">
                  <Image src={`${import.meta.env.VITE_API_URL_IMAGE}/${item.image}`} alt={item.nama_konser} className="konser-item-image"/>
                </div>
                <div className="konser-details-section">
                  <div className="konser-detail-content-wrapper">
                      <div className="konser-row-1">
                          <h3 className="konser-item-title">{item.nama_konser}</h3>
                          {/* ... status ... */}
                      </div>
                      <div className="konser-row-2">
                          <p className="konser-item-date-location">{`${formatTanggal(item.tanggal)} - ${item.lokasi}`}</p>
                          {/* Tampilan harga menggunakan properti yang sudah diproses */}
                          <p className="konser-item-price">
                            {item.harga_terendah !== null ? (
                              item.harga_terendah === item.harga_tertinggi ? formatRupiah(item.harga_terendah) : `${formatRupiah(item.harga_terendah)} - ${formatRupiah(item.harga_tertinggi)}`
                            ) : ('Harga diumumkan segera')}
                          </p>
                      </div>
                      <p className="konser-item-description">{item.deskripsi_acara}</p>
                  </div>
                </div>
                <div className="konser-button-section">
                  <Button className="btn-amankan-tiket btn-full-height">Amankan Tiket</Button>
                </div>
              </div>
            </Link>
          </Col>
        ))
      ) : (
        !loading && <p className="text-center p-5">Tidak ada konser yang sesuai dengan kriteria Anda.</p>
      )}
    </>
  );
};

export default KonserMendatangComponent;