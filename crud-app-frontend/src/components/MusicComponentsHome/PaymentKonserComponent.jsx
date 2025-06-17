import React from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
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

    // Format tanggal
    const formatDate = (dateString) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="payment-confirmation-page bg-light py-4">
            <Container className="payment-content-container bg-white rounded shadow-sm p-4">
                <Row className="mb-3">
                    <Col xs={12} className="text-center">
                        <h5 className="text-uppercase text-primary mb-0">NOMOR VA PEMBAYARAN</h5>
                        <div className="d-flex align-items-center justify-content-center">
                            <h4 className="payment-code-value mb-0">{details.payment_id}</h4>
                            <Button 
                                variant="link" 
                                onClick={() => onCopyCode(details.payment_id)} 
                                className="copy-code-btn p-0 ms-2"
                            >
                                <i className="bi bi-clipboard"></i>
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col xs={12} md={4} className="mb-3 mb-md-0">
                        <div className="d-flex">
                            <div className="me-3">
                                <Image 
                                    src={`${import.meta.env.VITE_API_URL_IMAGE}/${details.image}`} 
                                    alt={details.nama_konser} 
                                    width={100} 
                                    height={150} 
                                    className="rounded"
                                />
                            </div>
                            <div>
                                <h6 className="text-muted mb-1">JUDUL KONSER</h6>
                                <h5 className="mb-2">{details.nama_konser}</h5>
                                <h6 className="text-muted mb-1">LOKASI</h6>
                                <p className="mb-0">{details.lokasi}</p>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={8}>
                        <Row>
                            <Col xs={6} md={3} className="mb-3">
                                <h6 className="text-muted mb-1">PEMESAN</h6>
                                <p className="mb-0">{details.nama}</p>
                            </Col>
                            <Col xs={6} md={3} className="mb-3">
                                <h6 className="text-muted mb-1">EMAIL</h6>
                                <p className="mb-0">{details.email}</p>
                            </Col>
                            <Col xs={6} md={3} className="mb-3">
                                <h6 className="text-muted mb-1">JADWAL</h6>
                                <p className="mb-0">{formatDate(details.tanggal)}</p>
                            </Col>
                            <Col xs={6} md={3} className="mb-3">
                                <h6 className="text-muted mb-1">JAM</h6>
                                <p className="mb-0">{new Date(details.tanggal).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</p>
                            </Col>
                            <Col xs={12} className="mb-3">
                                <h6 className="text-muted mb-1">TOTAL PEMBAYARAN</h6>
                                <h5 className="text-primary">{formatCurrency(details.total_harga)}</h5>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <hr className="my-4" />

                <Row className="mb-3">
                    <Col xs={12}>
                        <p className="text-center text-danger mb-1">Tiket yang sudah di bayar tidak dapat diubah atau dibatalkan</p>
                        <h5 className="text-center mb-3">Sudah Selesai bayar? Upload bukti disini</h5>
                        <p className="text-center small mb-2">Format yang didukung JPG, JPEG, PNG, PDF (max. 5 MB)</p>
                    </Col>
                </Row>

                {fileName && (
                    <Row className="justify-content-center mb-3">
                        <Col xs={12} md={6} className="text-center">
                            <div className="preview-box p-3 border rounded">
                                <p className="mb-0">Preview</p>
                                <div className="preview-image-placeholder bg-light p-3 mt-2 rounded">
                                    <p className="small text-muted mb-0">File terpilih: {fileName}</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                )}

                <Row className="justify-content-center mb-3">
                    <Col xs={12} md={6} className="text-center">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={onFileChange}
                            style={{ display: "none" }} 
                            accept="image/*,.pdf"
                        />
                        <Button 
                            variant="outline-primary" 
                            className="w-100" 
                            onClick={() => fileInputRef.current.click()}
                        >
                            <i className="bi bi-upload me-2"></i>
                            Pilih File
                        </Button>
                    </Col>
                </Row>

                <Row className="justify-content-center">
                    <Col xs={12} md={6} className="text-center">
                        <Button 
                            variant="primary" 
                            className="w-100" 
                            onClick={onConfirmPayment}
                        >
                            Cek Pembayaran
                        </Button>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col xs={12}>
                        <h5 className="text-center mb-3">Cara Melakukan Pembayaran</h5>
                        <ol className="payment-instructions">
                            <li>Masukan PIN ATM anda atau pilih menu <strong>transaksi lainnya</strong></li>
                            <li>Pilih menu transfer ke <strong>Virtual akun</strong></li>
                            <li>Masukan kode pembayaran Virtual akun dari FindFun Store</li>
                            <li>Cek nominal transfer sudah sesuai dengan total pembayaran pada website</li>
                            <li>Jika sudah transfer, gunakan tombol 'Cek Pembayaran' untuk di upload bukti pembayaran ke website FindFun</li>
                        </ol>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default KonfirmasiPembayaranComponent;