// src/pages/FormBayarPage.js

import React, { useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import Swal from 'sweetalert2'; 
import 'sweetalert2/dist/sweetalert2.min.css';

import FormPembayaranMusicComponent from '../../components/MusicComponentsHome/FormPembayaranKonserComponent';

const FormBayarPage = () => {
    const { id } = useParams(); // Mengambil ID konser dari URL

    // State untuk menyimpan data konser tunggal
    const [konser, setKonser] = useState(null); 
    const [loading, setLoading] = useState(true);

    // Fungsi untuk mengambil data detail konser dari API
    const getDetailKonser = async () => {
        try {
            setLoading(true);
            // Panggil API untuk mendapatkan detail satu konser berdasarkan ID
            const response = await api.get(`/konser/${id}`);
            
            if (response.data.success) {
                // Simpan data konser ke dalam state
                setKonser(response.data.data);
            } else {
                throw new Error(response.data.message || 'Data konser tidak ditemukan.');
            }

        } catch (error) {
            console.error("Error fetching concert details:", error);
            Swal.fire("Gagal!", "Terjadi kesalahan saat mengambil data konser.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Panggil fungsi getDetailKonser saat komponen dimuat
    useEffect(() => {
        getDetailKonser();
    }, [id]); // Tambahkan [id] agar data di-fetch ulang jika user pindah ke halaman detail lain

    if (loading) {
        return <Container className="text-center my-5"><Spinner animation="border" /><p className='mt-2'>Memuat informasi pembayaran...</p></Container>;
    }

    return (
        <div className="halaman-pembayaran">
            <Container className="my-4">
                {/* Kirim data 'konser' yang sudah di-fetch ke komponen form */}
                <FormPembayaranMusicComponent konser={konser} />
            </Container>
        </div>
    );
};

export default FormBayarPage;