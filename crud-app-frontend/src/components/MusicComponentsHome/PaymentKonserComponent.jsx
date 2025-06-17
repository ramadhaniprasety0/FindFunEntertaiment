// src/components/KonfirmasiPembayaranComponent.jsx

import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

// Komponen ini menerima semua data dan fungsi dari induknya sebagai props
const KonfirmasiPembayaranComponent = ({ 
    details, 
    fileName, 
    fileInputRef,
    onCopyCode, 
    onFileChange, 
    onConfirmPayment 
}) => {

    // Jika data belum siap, tampilkan pesan loading sederhana
    if (!details) {
        return (
            <Container className="text-center my-5">
                <p>Menyiapkan detail pembayaran...</p>
            </Container>
        );
    }

    // Fungsi helper kecil untuk format mata uang
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency", currency: "IDR", minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="payment-confirmation-page">
            <Container className="payment-content-container">
                <Row className="justify-content-center text-center">
                    <Col md={8} lg={7}>
                        <p className="payment-label mb-1">Nama Konser</p>
                        <h1 className="payment-music-title">{details.nama_konser}</h1>

                        <p className="payment-label mt-4 mb-1">Total Pembayaran</p>
                        <h2 className="payment-amount">
                            {formatCurrency(details.total_harga)}
                        </h2>

                        <p className="payment-label mt-4 mb-1">Kode Pembayaran</p>
                        <div className="payment-code-wrapper">
                            <h3 className="payment-code-value">{details.payment_id}</h3>
                            {/* Memanggil fungsi onCopyCode dari props */}
                            <Button variant="link" onClick={() => onCopyCode(details.payment_id)} className="copy-code-btn">
                                <i className="bi bi-clipboard"></i>
                            </Button>
                        </div>
                        
                        <p className="payment-instructions-text mt-3">
                            Silakan lakukan pembayaran ke nomor rekening di bawah ini dan unggah bukti pembayaran Anda.
                        </p>
                        
                        <div className="account-info-box">
                            <strong>Bank Central Asia (BCA)</strong><br />
                            <span>1234567890</span><br />
                            <span>a.n. PT FindFun Indonesia</span>
                        </div>

                        {/* Input file ini tersembunyi, di-trigger oleh tombol di bawah */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={onFileChange} // Memanggil fungsi onFileChange dari props
                            style={{ display: "none" }} 
                            accept="image/*,.pdf"
                        />
                        
                        <button type="button" className="btn-pilih-file mt-4" onClick={() => fileInputRef.current.click()}>
                            <i className="bi bi-upload me-2"></i>
                            {fileName ? 'Ganti File' : 'Pilih File Bukti Pembayaran'}
                        </button>

                        {fileName && (
                            <p className="mt-2 selected-file-name">File terpilih: {fileName}</p>
                        )}
                    </Col>
                </Row>
                
                <Row className="justify-content-center mt-4 mb-5">
                    <Col md={6} lg={4} className="text-center">
                        <button type="button" className="btn-cek-pembayaran w-100" onClick={onConfirmPayment}>
                            Saya Sudah Membayar
                        </button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default KonfirmasiPembayaranComponent;