import { useState, useEffect } from "react";
import { Row, Col, Image, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const FormPembayaranMusicComponent = ({ konser }) => {
  const [userId] = useState(localStorage.getItem("userId"));

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("name") || "";
    const storedEmail = localStorage.getItem("email") || "";
    setNama(storedName);
    setEmail(storedEmail);
  }, []);

  useEffect(() => {
    if (konser?.jenis_tiket && konser.jenis_tiket.length > 0) {
      const firstAvailableTicket = konser.jenis_tiket[0];
      if (firstAvailableTicket) {
        setSelectedTicket(firstAvailableTicket);
      }
    }
  }, [konser]);

  useEffect(() => {
    if (selectedTicket) {
      setTotalPrice(parseFloat(selectedTicket.harga) * ticketQuantity);
    }
  }, [selectedTicket, ticketQuantity]);

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setTicketQuantity(1);
  };

  const handleQuantityChange = (amount) => {
    setTicketQuantity((prev) => Math.max(1, prev + amount));
  };

  const formatCurrency = (value) => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numericValue)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numericValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTicket) {
      Swal.fire(
        "Oppss!",
        "Harap pilih jenis tiket terlebih dahulu.",
        "warning"
      );
      return;
    }
    if (!nama || !email) {
      Swal.fire("Oppss!", "Nama dan Email wajib diisi.", "warning");
      return;
    }

    // Buat FormData untuk mengirim data multipart/form-data
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("konser_id", konser.id);
    formData.append(
      "jenis_tiket",
      JSON.stringify([
        {
          jenis_tiket: selectedTicket.jenis_tiket || selectedTicket.nama,
          harga: selectedTicket.harga,
          jumlah: ticketQuantity,
        },
      ])
    );
    formData.append("total_harga", totalPrice);
    formData.append("nama_pembeli", nama);
    formData.append("email_pembeli", email);
    // Tidak perlu menambahkan poster jika tidak ada

    try {
      // Gunakan header yang benar untuk FormData
      const response = await api.post("/konser/beli-tiket", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const paymentId =
          response.data.data.payment_id || response.data.data.insertId;
        const konserId = konser.id;

        Swal.fire(
          "Berhasil!",
          "Pembelian tiket berhasil diproses. Mengarahkan ke pembayaran...",
          "success"
        );

        navigate(`/payment-tiket/${konserId}/konser/${paymentId}`);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      Swal.fire(
        "Gagal!",
        error.response?.data?.message || error.message || "Terjadi kesalahan.",
        "error"
      );
    }
  };

  if (!konser) {
    return (
      <p className="text-center my-5">Informasi konser tidak ditemukan.</p>
    );
  }

  const displayDate = konser.tanggal
    ? new Date(konser.tanggal).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Tanggal Acara";

  return (
    <Row className="pembayaran-konser-wrapper">
      <Col md={5} lg={4} className="info-konser-col mb-4 mb-md-0">
        <Image
          src={`${import.meta.env.VITE_API_URL_IMAGE}/${konser.image}`}
          alt={konser.nama_konser}
          fluid
          className="info-konser-poster"
        />
        <h2 className="info-konser-title mt-3 mb-4">{konser.nama_konser}</h2>
        <h5 className="info-section-label">Lokasi</h5>
        <div className="info-display-box location-box-content mb-3">
          <i className="bi bi-geo-alt-fill info-box-icon"></i>
          <span className="info-box-text">
            {konser.lokasi || "Informasi Lokasi"}
          </span>
        </div>
        <h5 className="info-section-label">Tanggal</h5>
        <div className="info-display-box datetime-box-content">
          <span className="info-box-date">{displayDate}</span>
        </div>
      </Col>

      <Col md={7} lg={8} className="form-pembayaran-col">
        <div className="form-pembayaran-card">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="form-card-label">Nama Lengkap</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama Lengkap Anda"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="form-card-label">Alamat email</Form.Label>
              <div className="input-with-icon-wrapper">
                <i className="bi bi-envelope input-embedded-icon"></i>
                <Form.Control
                  type="email"
                  placeholder="Halo@"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-with-embedded-icon"
                />
              </div>
            </Form.Group>

            <h5 className="form-section-title">Pilih area Anda</h5>
            {konser?.jenis_tiket?.map((ticket) => (
              <div
                key={ticket.id}
                className={`ticket-option ${
                  selectedTicket?.id === ticket.id ? "selected" : ""
                }`}
                onClick={() => handleTicketSelect(ticket)}
              >
                <Form.Check
                  type="radio"
                  id={`ticket-${ticket.id}`}
                  name="ticketOption"
                  checked={selectedTicket?.id === ticket.id}
                  onChange={() => handleTicketSelect(ticket)}
                  className="visually-hidden"
                />
                <div className="ticket-icon-wrapper">
                  <i className="bi bi-ticket-perforated"></i>
                </div>
                <div className="ticket-info">
                  <span className="ticket-name">{ticket.jenis_tiket}</span>
                  <span className="ticket-price">
                    {formatCurrency(ticket.harga)}
                  </span>
                </div>
                <div className="ticket-action">
                  {selectedTicket?.id === ticket.id && (
                    <div className="quantity-controls">
                      <Button
                        variant="link"
                        className="quantity-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(-1);
                        }}
                        disabled={ticketQuantity <= 1}
                      >
                        -
                      </Button>
                      <span className="quantity-display mx-2">
                        {ticketQuantity}
                      </span>
                      <Button
                        variant="link"
                        className="quantity-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(1);
                        }}
                      >
                        +
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {selectedTicket && (
              <div className="summary-section mt-4">
                <Row className="summary-item">
                  <Col xs={6} sm={7}>
                    {selectedTicket.jenis_tiket}
                  </Col>
                  <Col xs={2} sm={1} className="text-center">
                    {ticketQuantity}
                  </Col>
                  <Col xs={4} sm={4} className="text-end">
                    {formatCurrency(
                      parseFloat(selectedTicket.harga) * ticketQuantity
                    )}
                  </Col>
                </Row>
                <Row className="summary-total mt-2">
                  <Col className="fw-bold">Total</Col>
                  <Col className="text-end fw-bold">
                    {formatCurrency(totalPrice)}
                  </Col>
                </Row>
              </div>
            )}

            <div className="payment-actions mt-5 d-flex justify-content-end">
              <Button
                as={Link}
                to={`/konser/${konser.id}`}
                variant="outline-secondary"
                className="btn-batal me-2"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="btn-pembayaran"
                disabled={!selectedTicket}
              >
                Pembayaran
              </Button>
            </div>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default FormPembayaranMusicComponent;
