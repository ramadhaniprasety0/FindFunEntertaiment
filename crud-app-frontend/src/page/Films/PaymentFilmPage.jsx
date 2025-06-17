import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const PaymentFilmPage = () => {
  const { id, tiketId } = useParams();

  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [data, setData] = useState([]);
  const [user_id, setUserId] = useState(0);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [film_id, setFilmId] = useState("");
  const [schedule_id, setScheduleId] = useState("");
  const [seats, setSeats] = useState([]);
  const [price, setPrice] = useState(0);
  const [existingImage, setExistingImage] = useState("");
  const [payment_id, setPaymentId] = useState("");
  const [image, setImage] = useState(null);
  // const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch payment details
  const getPaymentData = async () => {
    try {
      const response = await api.get(
        `/film-payment/${id}/schedule/${tiketId}`,
      );
      const ticketData = response.data.data[0];
      setData(ticketData);
      setUserId(ticketData.user_id);
      setNama(ticketData.nama);
      setEmail(ticketData.email);
      setFilmId(ticketData.film_id);
      setScheduleId(ticketData.schedule_id);
      setSeats(ticketData.seat_ids);
      setPrice(ticketData.total_price);
      setExistingImage(ticketData.image);
      setPaymentId(ticketData.payment_id);

      if (ticketData.image) {
        setExistingImage(image);
        setPreviewImage(`${import.meta.env.VITE_API_URL_IMAGE}/${ticketData.image}`);
        // perbaiki kembali untuk contok ss pembayaran
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat mengambil data pembayaran.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentData();
  }, [id, tiketId]);

  function generatePaymentCode(transactionId) {
    const prefix = "VA"; // Prefix for Virtual Account
    const randomDigits = Math.random().toString().slice(2, 12); // Random digits
    const checksum =
      (parseInt(randomDigits.slice(0, 5)) +
        parseInt(randomDigits.slice(5, 10))) %
      99; // Simple checksum logic

    // Construct the payment code
    const paymentCode = `${prefix}-${randomDigits}-${checksum}`;

    // Here, we can return the payment code and also use it as a unique payment ID
    return paymentCode;
  }

  const paymentCode = generatePaymentCode(323940);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const filePreview = URL.createObjectURL(file);
      setPreviewImage(filePreview);
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current.click();
  };

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(data.paymentCode)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Berhasil Disalin!",
          text: "Kode Pembayaran berhasil disalin ke clipboard.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      })
      .catch((err) => {
        console.error("Gagal menyalin kode: ", err);
        Swal.fire({
          icon: "error",
          title: "Gagal Menyalin",
          text: "Terjadi kesalahan saat menyalin kode pembayaran.",
        });
      });
  };
  const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace("Rp", currency);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    return date.toLocaleDateString("id-ID", options);
  };

  // Handle confirmation button click
  const handleConfirmPayment = async (e) => {
    e.preventDefault();

    if (!image) {
      Swal.fire({
        icon: "error",
        title: "Bukti Pembayaran Diperlukan",
        text: "Silakan upload bukti pembayaran terlebih dahulu.",
      });
      return;
    }
  
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("nama", nama);
    formData.append("email", email);
    formData.append("schedule_id", schedule_id);
    formData.append("seat_id", seats);
    formData.append("film_id", film_id);
    formData.append("total_price", price);
    formData.append("payment_id", paymentCode);
    
    // Hapus baris ini karena menyebabkan masalah
    // formData.append("existingImage", existingImage);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await api.put(
        `/films/${id}/tiket-payment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Pembayaran Berhasil! Tiket Anda akan segera diproses.",
          confirmButtonText: "Lihat Tiket Saya"
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(`/order-history`);
          }
        });
      } else {
        Swal.fire(
          "Gagal!",
          "Terjadi kesalahan saat memproses pembayaran.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan pada server.", "error");
    }
  };

  if (loading) {
    return (
      <Container className="text-center">
        <h4>Memuat data pembayaran...</h4>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container className="text-center">
        <h4>Data pembayaran tidak ditemukan.</h4>
      </Container>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-confirmation-page">
        <Container className="payment-content-container">
          <Row
            className="p-4 rounded-4 mb-4"
            style={{ backgroundColor: "#4527A0" }}
          >
            <div className="d-flex gap-5 align-items-center justify-content-between">
              <div className="col-md-4">
                <img
                  src={`${import.meta.env.VITE_API_URL_IMAGE}/${data.image}`}
                  alt="Film"
                  className="rounded-4"
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-md-8">
                <p className="payment-label-code mb-1">NOMOR PEMBAYARAN</p>
                <div className="d-flex align-items-center">
                  <h1 className="payment-code-value">{paymentCode}</h1>
                  <Button
                    variant="link"
                    onClick={handleCopyCode}
                    className="copy-code-btn text-white"
                  >
                    <i className="bi bi-clipboard"></i>
                  </Button>
                </div>
                <p className="payment-label mb-1">JUDUL FILM</p>
                <h1 className="payment-music-title">{data.film_title}</h1>
                <p className="payment-label mb-1">BIOSKOP</p>
                <h1 className="payment-music-title">{data.cinema}</h1>
              </div>
            </div>
          </Row>

          <Row>
            <div className="d-flex mb-4">
              <div className="col-md-6">
                <p className="payment-label mb-1">PEMESAN</p>
                <h1 className="payment-music-title text-dark fw-bold">
                  {data.nama}
                </h1>
              </div>
              <div className="col-md-6 text-end">
                <p className="payment-label mb-1">EMAIL</p>
                <h1 className="payment-music-title text-dark fw-bold">
                  {data.email}
                </h1>
              </div>
            </div>
          </Row>

          <Row>
            <div className="d-flex mb-4">
              <div className="col-md-6">
                <p className="payment-label mb-1">JADWAL</p>
                <h1 className="payment-music-title text-dark fw-bold">
                  {formatDate(data.created_at)}
                </h1>
              </div>
              <div className="col-md-6 text-end">
                <p className="payment-label mb-1">JAM</p>
                <h1 className="payment-music-title text-dark fw-bold">
                  {data.show_time.slice(0, 5)}
                </h1>
              </div>
            </div>
            <div className="d-flex mb-4">
              <div className="col-md-6">
                <p className="payment-label mb-1">TEMPAT DUDUK</p>
                <h1 className="payment-music-title text-dark fw-bold">
                  {data.seat_ids}
                </h1>
              </div>
              <div className="col-md-6 text-end">
                <p className="payment-label mb-1">TOTAL TEMPAT DUDUK</p>
                <h1 className="payment-music-title text-dark fw-bold">
                  {data.seat_count}
                </h1>
              </div>
            </div>
          </Row>
          <Row>
            <div className="d-flex mb-4">
              <div className="col-md-6">
                <p className="payment-label mt-4 mb-1">Total Pembayaran</p>
                <h2 className="payment-amount fw-bold text-dark">
                  {formatCurrency(data.total_price, "Rp")}
                </h2>
              </div>
              <div className="col-md-6 text-end">
                <p className="payment-label mt-4 mb-1">BIAYA LAYANAN</p>
                <h2 className="payment-amount fw-bold text-dark">
                  {formatCurrency(0, "Rp")}
                </h2>
              </div>
            </div>
          </Row>

          <Row
            className="rounded-4 pt-4"
            style={{ backgroundColor: "#4527A0" }}
          >
            <Col md={6}>
              <p className="payment-label">TOTAL BAYAR</p>
            </Col>
            <Col md={6}>
              <h2 className="payment-amount fw-bold text-white text-end">
                {formatCurrency(data.total_price, "Rp")}
              </h2>
            </Col>
          </Row>
          <p className="text-danger text-decoration-underline text-center mb-4 fs-6 mt-4">
            Tiket yang berhasil terbeli tidak dapat diubah atau dibatalkan
          </p>
          <p className="text-center mb-4 fs-3" style={{ color: "#3D3D6C" }}>
            Sudah Selesai bayar? Upload bukti disini
          </p>
          <form action="" className="text-center">
            <small className="text-muted text-center">
              Format yang didukung: JPG, JPEG, PNG, PDF (max: 5MB)
            </small>
            {previewImage && (
              <div className="mt-2">
                <p className="text-center text-muted">Preview</p>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </div>
            )}

            <div className="text-center">
              <input
                type="file"
                id="image"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
                accept="image/*,.pdf,.doc,.docx" // Sesuaikan tipe file yang diterima
              />
              <button
                type="button"
                className="btn-pilih-file mt-3"
                onClick={handleChooseFileClick}
              >
                <i className="bi bi-upload me-2"></i>Pilih File
              </button>
            </div>
            {/* Tombol Cek Pembayaran */}
            <Row className="justify-content-center mt-4 mb-5">
              <Col md={6} lg={4} className="text-center">
                {/* Memanggil handleCheckPayment saat tombol diklik */}
                <button
                  type="button"
                  className="btn-cek-pembayaran w-100"
                  onClick={handleConfirmPayment}
                >
                  Cek Pembayaran
                </button>
              </Col>
            </Row>
          </form>


          {/* Bagian Cara Pembayaran */}
          <Row className="justify-content-center mt-4">
            <Col md={10} lg={12}>
              <div className="instructions-box">
                <h5 className="instructions-title text-center">
                  Cara Melakukan Pembayaran
                </h5>
                <ol className="instructions-list">
                  <li>
                    Masukan PIN ATM anda lalu pilih menu{" "}
                    <strong>transaksi lainnya</strong>
                  </li>
                  <li>
                    Pilih menu transfer ke <strong>Virtual akun</strong>
                  </li>
                  <li>
                    Masukkan kode pembayaran Virtual akun{" "}
                    <strong>(a.n FindFun Jaya)</strong>
                  </li>
                  <li>
                    Cek nominal transfer apakah sudah sesuai dengan total
                    pembayaran pada website
                  </li>
                  <li>
                    Jika sudah transfer,{" "}
                    <strong>simpan bukti / struk transfer</strong> untuk di
                    upload bukti pembayaran ke website FindFun
                  </li>
                </ol>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default PaymentFilmPage;
