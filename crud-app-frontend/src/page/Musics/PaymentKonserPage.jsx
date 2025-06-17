// src/pages/KonfirmasiPembayaranPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";
import KonfirmasiPembayaranComponent from "../../components/MusicComponentsHome/PaymentKonserComponent";

const KonfirmasiPembayaranPage = () => {
    // ID di sini adalah ID auto-increment dari tabel pembayaran, sesuai rute Anda
    const { id, paymentId } = useParams(); 
    
    const navigate = useNavigate();

    const [paymentDetails, setPaymentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        const getPaymentDetails = async () => {
            if (!id || !paymentId) {
                setError("Sesi tidak valid atau ID pembayaran tidak ditemukan.");
                setLoading(false);
                return;
            }
            try {
                // Perbaikan: Menggunakan response langsung tanpa destructuring
                const response = await api.get(`/konser/${id}/payment/${paymentId}`);
                console.log(response.data);
                if (response.data.success) {
                    setPaymentDetails(response.data.data);
                    console.log(response.data.data);
                } else {
                    throw new Error(response.data.message || "Gagal mengambil data");
                }
            } catch (err) {
                setError(err.message || "Gagal mengambil detail pembayaran.");
            } finally {
                setLoading(false);
            }
        };
        getPaymentDetails();
    }, [id, paymentId]); // Tambahkan paymentId sebagai dependency

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

        console.log(selectedFile);

        const formData = new FormData();
        formData.append('image', selectedFile);
        
        // Debugging
        console.log("FormData entries:");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            console.log("File yang akan dikirim:", selectedFile);
            Swal.fire({ title: 'Mengunggah...', didOpen: () => Swal.showLoading() });
            
            const response = await api.put(
                `/konser/${id}/payment-bukti/${paymentId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: "Bukti pembayaran berhasil diunggah. Tiket Anda akan segera diproses.",
                    confirmButtonText: "Lihat Tiket Saya"
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/order-history");
                    }
                });
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            console.error("Error:", err);
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