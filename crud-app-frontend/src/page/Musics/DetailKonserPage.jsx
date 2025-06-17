import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import DetailKonserComponent from '../../components/MusicComponentsHome/DetailKonserComponent';
import api from '../../api/axios';

const formatRupiah = (angka) => {
    if (angka === null || isNaN(angka)) return "N/A";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

const formatDisplayDate = (tanggalISO) => {
    if (!tanggalISO) return '-';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('id-ID', options).format(new Date(tanggalISO));
};

const DetailKonserPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [konserDetail, setKonserDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetailKonser = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/konser/${id}`);
                const result = response.data;
                
                if (result.success && result.data) {
                    const apiData = result.data;
                    
                    const prices = apiData.jenis_tiket?.map(t => t.harga) || [];
                    const hargaTerendah = prices.length > 0 ? Math.min(...prices) : null;
                    const hargaTertinggi = prices.length > 0 ? Math.max(...prices) : null;

                    let priceDisplayString;
                    if (hargaTerendah === null) {
                        priceDisplayString = "Harga belum tersedia";
                    } else if (hargaTerendah === hargaTertinggi) {
                        priceDisplayString = formatRupiah(hargaTerendah);
                    } else {
                        priceDisplayString = `${formatRupiah(hargaTerendah)} - ${formatRupiah(hargaTertinggi)}`;
                    }
                    
                    const formattedDetail = {
                        id: apiData.id,
                        title: apiData.nama_konser,
                        posterImage: `${import.meta.env.VITE_API_URL_IMAGE}/${apiData.image}`,
                        priceDisplay: priceDisplayString,
                        displayDate: formatDisplayDate(apiData.tanggal),
                        location: {
                            venueName: apiData.lokasi
                        },
                        // Tambahkan koordinat
                        maps_embed_url: apiData.maps_embed_url,
                        
                        livePhotos: apiData.artists?.map(artist => `${import.meta.env.VITE_API_URL_IMAGE}/${artist.image}`) || [],
                        venueInfo: apiData.deskripsi_acara,
                        artistInfo: {
                            name: apiData.artists?.[0]?.name || 'Artis',
                            image: apiData.artists?.[0]?.image ? `${import.meta.env.VITE_API_URL_IMAGE}/${apiData.artists[0].image}` : `${import.meta.env.VITE_API_URL_IMAGE}/uploads/system/no-pictures.png`
                        },
                    };
                    
                    setKonserDetail(formattedDetail);
                } else {
                    throw new Error(result.message || "Gagal memuat data konser.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetailKonser();
    }, [id]);
    
    return (
        <div className="detail-konser-page">
            <Container className="detail-konser-main-container my-4">
                <DetailKonserComponent konserDetail={konserDetail} />
            </Container>
        </div>
    );
};

export default DetailKonserPage;