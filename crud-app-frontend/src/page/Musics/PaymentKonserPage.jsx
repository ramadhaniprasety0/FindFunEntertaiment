// src/pages/KonfirmasiPembayaranPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import KonfirmasiPembayaranComponent from "../../components/MusicComponentsHome/PaymentKonserComponent";

const KonfirmasiPembayaranPage = () => {
    // ID di sini adalah ID auto-increment dari tabel pembayaran, sesuai rute Anda
    const { id } = useParams(); 
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [paymentDetails, setPaymentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        const getPaymentDetails = async () => {
            if (!id || !token) {
                setError("Sesi tidak valid atau ID pembayaran tidak ditemukan.");
                setLoading(false);
                return;
            }
            try {
                // PERBAIKAN 1: URL GET disesuaikan dengan rute Anda
                const response = await axios.get(`http://localhost:3000/api/konser/payment/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data.success) {
                    setPaymentDetails(response.data.data);
                } else {
                    throw new Error(response.data.message);
                }
            } catch (err) {
                setError(err.message || "Gagal mengambil detail pembayaran.");
            } finally {
                setLoading(false);
            }
        };
        getPaymentDetails();
    }, [id, token]);

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code)
            .then(() => Swal.fire({ icon: "success", title: "Kode berhasil disalin!", toast: true, position: "top-end", showConfirmButton: false, timer: 2000 }))
            .catch(() => Swal.fire({ icon: "error", title: "Gagal Menyalin" }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setSelectedFile(file);
        }
    };

    const handleConfirmPayment = async () => {
        if (!selectedFile) {
            Swal.fire("Peringatan", "Silakan pilih file bukti pembayaran terlebih dahulu.", "warning");
            return;
        }

        const formData = new FormData();
        // PERBAIKAN 2: Nama field diubah menjadi 'image' sesuai middleware multer Anda
        formData.append('image', selectedFile);

        try {
            Swal.fire({ title: 'Mengunggah...', didOpen: () => Swal.showLoading() });
            
            // PERBAIKAN 3: URL PUT disesuaikan dengan rute Anda, menggunakan ID dari URL
            const response = await axios.put(
                `http://localhost:3000/api/konser/payment/${id}/bukti`,
                formData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data.success) {
                Swal.fire("Berhasil!", response.data.message || "Bukti pembayaran berhasil diunggah.", "success");
                navigate("/tiket-saya");
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            Swal.fire("Gagal!", err.response?.data?.message || "Terjadi kesalahan.", "error");
        }
    };

    if (loading) return <Container className="text-center my-5"><Spinner /></Container>;
    if (error) return <Container className="text-center my-5"><Alert variant="danger">{error}</Alert></Container>;

    // Kode render tetap sama, meneruskan semua state dan handler ke komponen anak
    return (
        <div className="payment-page">
            <KonfirmasiPembayaranComponent
                details={paymentDetails}
                fileName={fileName}
                fileInputRef={fileInputRef}
                onCopyCode={handleCopyCode}
                onFileChange={handleFileChange}
                onConfirmPayment={handleConfirmPayment}
            />
        </div>
    );
};

export default KonfirmasiPembayaranPage;