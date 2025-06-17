import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Image,
  Form,
  Button,
  InputGroup,
  Modal,
  Container,
} from "react-bootstrap";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';



const FormPembayaranFilmComponent = ({ film }) => {
  const { id } = useParams();
  const userId = localStorage.getItem("userId");

  const [seats, setSeats] = useState([]);
  const [cinemaLocations, setCinemaLocations] = useState([]);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [showSeatMapModal, setShowSeatMapModal] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [selectSeatSchedule, setSelectSeatSchedule] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [seatId, setSeatId] = useState([]);
  const navigate = useNavigate();
  

  const getDataSeat = async () => {
    try {
      const {data: film_price} = await api.get(`/films/${id}/tiket/price`);
      setCinemaLocations(film_price.data);
      if(selectedLocation){
        const {data: schedule} = await api.get(`/films/${id}/schedule/${selectedLocation}`);
        setSchedule(schedule.data);
        console.log(price);
      }

      if(selectSeatSchedule){
        const { data } = await api.get(`/films/seats/${selectSeatSchedule}`);
        setSeats(data.data);
      }

      console.log(selectSeatSchedule);

    } catch (error) {
      console.error(error);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data kursi.', 'error');
    }
  }

  useEffect(() => {
    getDataSeat();
  }, [id, selectedLocation, selectSeatSchedule]);

  const seatLayout = {
    rows: ["K", "J", "I", "H", "G", "F", "E", "D", "C", "B", "A"].reverse(),
    seatsPerRow: 15,
    takenSeats: new Set(seats),
  };

  const handleScheduleSelect = (selectedSchedule) => {
    setSelectSeatSchedule(selectedSchedule.schedule_id);
    setSelectedSchedule(selectedSchedule);
    setPrice(selectedSchedule.price);  
  };


  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
     
  };

  const maxSeatsToSelect = selectedSeats.size > 0 ? selectedSeats.size : 1;

  
  if (!film) {
    
    return (
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <p className="text-center my-5 h5">
          Opps!, Film belum tersedia di FindFun Cinema !
        </p>
        <Link to="/films" className="btn btn-sm btn-add">Kembali</Link>
      </Container>
    );
  }

  const handleShowSeatMapModal = () => {
    if (!selectedSchedule) {
      Swal.fire("Oppss!", "Harap pilih jadwal dan lokasi terlebih dahulu.", "warning");
      return;
    }
    setShowSeatMapModal(true);
  };

  const handleCloseSeatMapModal = () => setShowSeatMapModal(false);
  

  

  const handleConfirmSeats = () => {
    if (selectedSeats.size === 0) {
      alert("Anda belum memilih kursi.");
      return;
    }
    console.log("Kursi yang dipilih 223:", Array.from(selectedSeats));
    handleCloseSeatMapModal();
  };

  useEffect(() => {
    const ArraySeat = Array.from(selectedSeats);
    setSeatId(ArraySeat);
  }, [selectedSeats]);
  

  const handleSeatClick = (seatId) => {
    if (seatLayout.takenSeats.has(seatId)) return;
    setSelectedSeats((prevSelectedSeats) => {
      const newSelectedSeats = new Set(prevSelectedSeats);
      if (newSelectedSeats.has(seatId)) {
        newSelectedSeats.delete(seatId);
      } else {
        newSelectedSeats.add(seatId); 
      }
      return newSelectedSeats;
    });
  };

  const calculateTotalPrice = () => {
    return selectedSeats.size * price;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  

  const cancelLink = film.id ? `/films/detail/${film.film_id}` : "#";
    
    const handeleconfirmPaymentLink = async (e) => {
      e.preventDefault();
      
      if (selectedSeats.size === 0) {
        Swal.fire("Oppss!", "Harap pilih kursi terlebih dahulu.", "warning");
        return;
      }
    
      const tiketData = {
        user_id: userId,
        nama: nama,
        email: email,
        schedule_id: selectSeatSchedule,
        seat_id: Array.from(selectedSeats),
        film_id: film.film_id,
        total_price: calculateTotalPrice(),
      };
    
      try {
        const response = await api.post(
          "/films/beli/tiket", 
          tiketData, 
        );

    
        if (response.data.success) {
          // Swal.fire("Berhasil!", "Pembelian tiket berhasil.", "success");
          const ticketId = response.data.data.insertId;
          console.log(response.data.data.insertId);
          const paymentData = {
            tiketData,  
          };
          console.log(paymentData.tiketData.schedule_id);
          navigate(`/payment-tiket/${ticketId}/schedule/${paymentData.tiketData.schedule_id}`);
        } else {
          Swal.fire("Gagal!", "Terjadi kesalahan saat pembelian tiket.", "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat melakukan pembayaran.", "error");
      }
    };
    

  return (
    <Row className="pembayaran-film-wrapper my-4 mt-5">
      <Col md={5} lg={4} className="info-film-col mb-4 mb-md-0">
        <img
          src={`${import.meta.env.VITE_API_URL_IMAGE}/${film.image}`}
          alt={film.title}
          className="info-film-poster rounded-4 img-fluid"
        />
        <h2 className="info-film-title mt-3 mb-1">{film.title}</h2>

        <div className="film-meta-info mt-2">
          <span className="info-film-type-subtitle">{film.venue_name}</span>
          <span className="info-film-cinema-tag py-2">{film.cinema_type}</span>
        </div>

      </Col>

      <Col md={7} lg={8} className="form-pembayaran-col">
        <div className="form-pembayaran-card-2">
          <Form.Group className="mb-3" controlId="formNamaLengkap">
            <Form.Label className="form-card-label">Nama Lengkap</Form.Label>
            <Form.Control
              type="text"
              placeholder="Masukkan Nama Lengkap Anda"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formAlamatEmail">
            <Form.Label className="form-card-label">Alamat email</Form.Label>
            <div className="input-with-icon-wrapper">
              <i className="bi bi-envelope input-embedded-icon"></i>
              <Form.Control
                type="email"
                placeholder="Contoh: hallo@findfun.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-with-embedded-icon"
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLokasiBioskop">
            <Form.Label className="form-card-label form-label-lokasi-bioskop">
              Lokasi Bioskop
            </Form.Label>
            <Form.Control
              as="select"
              value={selectedLocation}
              onChange={handleLocationChange}
              className="form-input-lokasi-bioskop"
            >
              <option value="">Pilih Lokasi Bioskop</option>
              {cinemaLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.venue_name} - {location.cinema_type}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          
          <Form.Group className="mb-4">
          <Row>
            <Form.Label className="form-card-label form-label-lokasi-bioskop">
              Waktu Nonton
            </Form.Label>
            {schedule.map((scheduleItem) => {
              
              const formattedTime = scheduleItem.show_time.slice(0, 5);

              return (
                <Col key={scheduleItem.schedule_id} md={3}>
                  <Button
                    
                    className="w-100 mb-2 btn-schedule"
                    onClick={() => handleScheduleSelect(scheduleItem)}
                    active={selectedSchedule?.schedule_id === scheduleItem.schedule_id}
                  >
                    {formattedTime} 
                  </Button>
                </Col>
              );
            })}
          </Row>
        </Form.Group>

          <h5 className="form-section-title">Pilih Kursi</h5>
          <div className="selected-seats-display mb-2">
            Kursi Dipilih:{" "}
            {selectedSeats.size > 0 ? (
              Array.from(selectedSeats).join(", ")
            ) : (
              <span className="text-muted fst-italic">
                Belum ada kursi dipilih
              </span>
            )}
          </div>
          <Button
            variant="primary"
            className="w-100 btn-pilih-kursi mb-4"
            onClick={handleShowSeatMapModal}
          >
            <i className="bi bi-diagram-3-fill me-2"></i>
            {selectedSeats.size > 0
              ? `Ubah Pilihan Kursi (${selectedSeats.size} kursi)`
              : `Pilih Kursi Anda`}
          </Button>

          {selectedSeats.size > 0 && (
            <div className="summary-section mt-4">
              <Row className="summary-item">
                <Col xs={8} sm={9}>
                  {selectedSeats.size} Kursi Dipilih
                </Col>
                <Col xs={4} sm={3} className="text-end">
                </Col>
              </Row>
              <Row className="summary-total mt-2">
                <Col className="fw-bold">Total</Col>
                <Col className="text-end fw-bold">
                  {formatCurrency(calculateTotalPrice())}
                </Col>
              </Row>
            </div>
          )}

          <div className="payment-actions mt-5 d-flex justify-content-end">
            <Button
              as={Link}
              to={cancelLink}
              variant="outline-secondary"
              className="btn-batal me-2 mb-2"
            >
              Batal
            </Button>
            <Button
              as={Link}
              onClick={handeleconfirmPaymentLink}
              variant="primary"
              className="btn-pembayaran mb-2"
              disabled={selectedSeats.size === 0}
            >
              Pembayaran
            </Button>
          </div>
        </div>
      </Col>

      {/* Modal untuk Pilih Kursi (struktur modal tetap sama) */}
      <Modal
        show={showSeatMapModal}
        onHide={handleCloseSeatMapModal}
        dialogClassName="seat-map-modal"
        scrollable={true}
        centered
      >
        <Modal.Header
          closeButton
          className="seat-map-modal-header"
        ></Modal.Header>
        <Modal.Body className="seat-map-modal-body">
          <div className="screen-indicator">
            <div className="screen-arc"></div>
            <div className="screen-text">SCREEN</div>
          </div>
          <div className="seat-map-grid">
            {seatLayout.rows.map((rowLabel) => (
              <div key={rowLabel} className="seat-row">
                <div className="row-label">{rowLabel}</div>
                <div className="seats-in-row">
                  {Array.from({ length: seatLayout.seatsPerRow }, (_, i) => {
                    const seatNumber = i + 1;
                    const seatId = `${rowLabel}${seatNumber}`;
                    const isTaken = seatLayout.takenSeats.has(seatId);
                    const isSelected = selectedSeats.has(seatId);
                    let seatStatus = "available";
                    if (isTaken) seatStatus = "taken";
                    if (isSelected) seatStatus = "selected";
                    return (
                      <Button
                        key={seatId}
                        variant="outline-secondary"
                        className={`seat ${seatStatus}`}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={isTaken}
                      >
                        <span>{isTaken ? "X" : seatNumber}</span>
                      </Button>
                    );
                  })}
                </div>
                <div className="row-label">{rowLabel}</div>
              </div>
            ))}
          </div>
          <div className="seat-legend mt-3">
            <div className="legend-item">
              <span className="seat-example available"></span> Kursi Tersedia
            </div>
            <div className="legend-item">
              <span className="seat-example selected"></span> Pilihan Anda
            </div>
            <div className="legend-item">
              <span className="seat-example taken"></span> Kursi Terisi
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="seat-map-modal-footer">
          <Button
            variant="outline-secondary"
            className="btn-modal-batal"
            onClick={handleCloseSeatMapModal}
          >
            Batal
          </Button>
          <Button
            variant="primary"
            className="btn-modal-konfirmasi"
            onClick={handleConfirmSeats}
            disabled={selectedSeats.size === 0}
          >
            Konfirmasi Kursi ({selectedSeats.size})
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default FormPembayaranFilmComponent;
