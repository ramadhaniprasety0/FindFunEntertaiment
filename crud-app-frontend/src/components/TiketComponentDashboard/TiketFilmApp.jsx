import React, { useState, useEffect } from "react";
import {
  Accordion,
  Button,
  Spinner,
  Modal,
  Form,
  Tabs,
  Tab,
} from "react-bootstrap";

import api from "../../api/axios"; // Ganti import axios dengan api dari file axios.js
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate } from "react-router-dom";

const TiketFilmApp = () => {
  const [tikets, setTikets] = useState([]);
  const token = localStorage.getItem("token");
  const [paymentData, setPaymentData] = useState([]);
  const [filteredPaymentData, setFilteredPaymentData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("WAITING");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedShowTime, setSelectedShowTime] = useState("");
  const [newShowTime, setNewShowTime] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [filmId, setFilmId] = useState(null);

  const navigate = useNavigate();

  const handleOpenModal = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleOpenEditModal = (tiket) => {
    setSchedules(tiket);
    const id = tiket.film_id;
    const cinemaId = tiket.cinema_location_id;
    setFilmId(id);
    getShowtime(id, cinemaId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => setShowEditModal(false);

  const handleShowTimeChange = (e) => {
    const scheduleId = e.target.value;
    setSelectedShowTime(scheduleId);

    // Jika ada schedule yang dipilih, ambil jam tayang dari schedule tersebut
    if (scheduleId) {
      const selectedScheduleData = selectedSchedule.find(
        (schedule) => schedule.schedule_id.toString() === scheduleId.toString()
      );
      if (selectedScheduleData) {
        // Set nilai newShowTime dengan jam tayang yang dipilih
        setNewShowTime(selectedScheduleData.show_time);
        console.log("Selected schedule data:", selectedScheduleData);
      }
    } else {
      // Reset newShowTime jika tidak ada schedule yang dipilih
      setNewShowTime("");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedShowTime) {
      Swal.fire(
        "Peringatan!",
        "Silakan pilih jam tayang yang ingin di ubah.",
        "warning"
      );
      return;
    }

    if (!newShowTime) {
      Swal.fire("Peringatan!", "Silakan masukkan jam tayang baru.", "warning");
      return;
    }

    try {
      await api.put(
        `/films/${filmId}/schedule/${selectedShowTime}`,
        {
          showtime: newShowTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire("Sukses!", "Jam tayang berhasil diupdate.", "success");
      setNewShowTime("");
      setSelectedShowTime("");
      // Refresh data
      getShowtime(filmId, schedules.cinema_location_id);
      getDataTiket();
    } catch (error) {
      console.error("Error updating showtime:", error);
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat mengupdate jam tayang.",
        "error"
      );
    }
  };

  const handleAddShowTime = async () => {
    if (!newShowTime) {
      Swal.fire("Peringatan!", "Silakan masukkan jam tayang baru.", "warning");
      return;
    }

    try {
      await api.post(
        `/films/schedule`,
        {
          film_id: filmId,
          cinema_location_id: schedules.cinema_location_id,
          show_time: newShowTime,
          price_id: schedules.price_id,
        },
        
      );
      Swal.fire("Sukses!", "Jam tayang baru berhasil ditambahkan.", "success");
      setNewShowTime("");
      handleCloseEditModal();
      // Refresh data
      getShowtime(filmId, schedules.cinema_location_id);
      getDataTiket();
    } catch (error) {
      console.error("Error adding new showtime:", error);
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat menambahkan jam tayang baru.",
        "error"
      );
    }
  };

  const handleDeleteShowTime = async () => {
    if (!selectedShowTime) {
      Swal.fire(
        "Peringatan!",
        "Silakan pilih jam tayang yang ingin dihapus.",
        "warning"
      );
      return;
    }

    // Konfirmasi penghapusan
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: "Apakah Anda yakin ingin menghapus jam tayang ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(
          `/films/delete-schedule/${selectedShowTime}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire("Sukses!", "Jam tayang berhasil dihapus.", "success");
        setSelectedShowTime("");
        setNewShowTime("");
        // Refresh data
        getShowtime(filmId, schedules.cinema_location_id);
        getDataTiket();
      } catch (error) {
        console.error("Error deleting showtime:", error);
        Swal.fire(
          "Gagal!",
          "Terjadi kesalahan saat menghapus jam tayang.",
          "error"
        );
      }
    }
  };

  const getDataTiket = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        "/tikets/bioskop"
      );
      const { data: paymentData } = await api.get(
        "/payment-user"
      );
      console.log(paymentData);
      setPaymentData(paymentData.data);
      // Filter data berdasarkan status WAITING secara default
      const filteredData = paymentData.data.filter(
        (payment) => payment.Status === statusFilter
      );
      setFilteredPaymentData(filteredData);
      setTikets(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat mengambil data tiket.",
        "error"
      );
      setLoading(false);
    }
  };

  const getShowtime = async (id, cinemaId) => {
    try {
      const { data: data } = await api.get(
        `/films/${id}/schedule/${cinemaId}`
      );
      setSelectedSchedule(data.data || []);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  useEffect(() => {
    getShowtime(schedules.film_id);
    getDataTiket();
  }, []);

  // Filter data berdasarkan status
  useEffect(() => {
    if (statusFilter === "ALL") {
      setFilteredPaymentData(paymentData);
    } else {
      const filtered = paymentData.filter(
        (payment) => payment.Status === statusFilter
      );
      setFilteredPaymentData(filtered);
    }
  }, [statusFilter, paymentData]);

  // Handle perubahan filter status
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  // Format showtime
  const formatShowtimes = (show_times) => {
    if (!show_times) return []; // Menangani kasus ketika show_times adalah undefined atau null
    return show_times.split(",").map((showtime, index) => (
      <div key={index} className="btn btn-sm btn-outline-secondary">
        {showtime.slice(0, 5)}
      </div>
    ));
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
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

  return (
    <div>
      <Accordion defaultActiveKey="0" flush className="mb-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Pesanan Tiket Tebaru !</Accordion.Header>
          <Accordion.Body>
            <div className="mb-3 d-flex justify-content-end">
              <Form.Group
                controlId="statusFilter"
                className="me-2"
                style={{ width: "200px" }}
              >
                <Form.Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="form-select-sm"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="WAITING">WAITING</option>
                  <option value="ACCEPT">ACCEPT</option>
                  <option value="REJECT">REJECT</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr className="text-center">
                    <td>No VA</td>
                    <td>Nama</td>
                    <td>Film</td>
                    <td>Jam</td>
                    <td>Bioskop</td>
                    <td>Kursi</td>
                    <td>Harga</td>
                    <td>Bukti</td>
                    <td>Status</td>
                    <td>Konfirmasi</td>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaymentData.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center">
                        Tidak ada data pesanan tiket
                      </td>
                    </tr>
                  ) : (
                    filteredPaymentData.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.NoVA}</td>
                        <td>{payment.Nama}</td>
                        <td>{truncateText(payment.Film, 10)}</td>
                        <td>{payment.Jam.slice(0, 5)}</td>
                        <td>{truncateText(payment.Bioskop, 10)}</td>
                        <td>{payment.Kursi}</td>
                        <td>{formatCurrency(payment.Harga, "Rp")}</td>
                        <td>
                          {payment.Bukti ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL_IMAGE}/${payment.Bukti}`}
                              alt="Bukti Pembayaran"
                              style={{ width: "50px" }}
                            />
                          ) : (
                            "Belum Upload"
                          )}
                        </td>
                        <td className="text-center">
                          <span
                            className={
                              payment.Status === "ACCEPT"
                                ? "badge bg-success"
                                : payment.Status === "REJECT"
                                ? "badge bg-danger"
                                : "badge bg-warning text-dark"
                            }
                          >
                            {payment.Status || "WAITING"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleOpenModal(payment)}
                            >
                              <i className="bi bi-eye-fill"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>No</th>
                <th>Judul Film</th>
                <th>Poster</th>
                <th>Director</th>
                <th>Lokasi</th>
                <th>Cinema</th>
                <th>Waktu Tayang</th>
                <th>Harga</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tikets.length === 0 ? (
                <tr>
                  <td colSpan={8}>Tidak ada data tiket</td>
                </tr>
              ) : (
                tikets.map((tiket, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{tiket.title}</td>
                    <td>
                      {tiket.image ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL_IMAGE}/${tiket.image}`}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          alt={tiket.title}
                          className="img-thumbnail"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      ) : (
                        <div
                          className="bg-light rounded d-flex align-items-center justify-content-center"
                          style={{ width: "50px", height: "50px" }}
                        >
                          <i className="bi bi-image text-muted"></i>
                        </div>
                      )}
                    </td>
                    <td>{tiket.director}</td>
                    <td>{tiket.venue_name}</td>
                    <td>{tiket.cinema_type}</td>
                    <td className="d-flex flex-wrap gap-2 h-100">
                      {formatShowtimes(tiket.show_times)}
                    </td>
                    <td>{formatCurrency(tiket.price, "Rp")}</td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <Button
                          variant="outline-secondary"
                          title="Edit Jam Tayang"
                          size="sm"
                          onClick={() => handleOpenEditModal(tiket)}
                        >
                          <i className="bi bi-clock"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Detail Pesanan Tiket */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detail Pesanan Tiket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <h5>Informasi Pembayaran</h5>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td className="fw-bold">No. Virtual Account</td>
                        <td>{selectedPayment.NoVA}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Nama</td>
                        <td>{selectedPayment.Nama}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Email</td>
                        <td>{selectedPayment.Email}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Film</td>
                        <td>{selectedPayment.Film}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Jam Tayang</td>
                        <td>{selectedPayment.Jam.slice(0, 5)}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Bioskop</td>
                        <td>{selectedPayment.Bioskop}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Kursi</td>
                        <td>{selectedPayment.Kursi}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Total Harga</td>
                        <td>{formatCurrency(selectedPayment.Harga, "Rp")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <h5>Bukti Pembayaran</h5>
                  {selectedPayment.Bukti ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL_IMAGE}/${selectedPayment.Bukti}`}
                      alt="Bukti Pembayaran"
                      className="img-fluid border rounded"
                      style={{ maxHeight: "300px" }}
                    />
                  ) : (
                    <div className="alert alert-warning">
                      Belum ada bukti pembayaran
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Tutup
          </Button>
          {selectedPayment && selectedPayment.Bukti && (
            <>
              <Button
                variant="danger"
                onClick={() => {
                  Swal.fire({
                    title: "Apakah Anda yakin?",
                    text: "Pembayaran akan ditolak!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Ya, tolak!",
                    cancelButtonText: "Batal",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      // Kirim permintaan ke API untuk mengubah status menjadi REJECT
                      api
                        .put(
                          `/films/payment/${selectedPayment.id}/status`,
                          { status: "REJECT" },
                          { headers: { Authorization: `Bearer ${token}` } }
                        )
                        .then((response) => {
                          Swal.fire(
                            "Ditolak!",
                            "Pembayaran telah ditolak.",
                            "success"
                          );
                          getDataTiket(); // Refresh data setelah status diubah
                          handleCloseModal();
                        })
                        .catch((error) => {
                          console.error(
                            "Error updating payment status:",
                            error
                          );
                          Swal.fire(
                            "Gagal!",
                            "Terjadi kesalahan saat menolak pembayaran.",
                            "error"
                          );
                        });
                    }
                  });
                }}
              >
                Tolak Pembayaran
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  Swal.fire({
                    title: "Apakah Anda yakin?",
                    text: "Pembayaran akan dikonfirmasi!",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Ya, konfirmasi!",
                    cancelButtonText: "Batal",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      // Kirim permintaan ke API untuk mengubah status menjadi ACCEPT
                      api
                        .put(
                          `/films/payment/${selectedPayment.id}/status`,
                          { status: "ACCEPT" },
                          { headers: { Authorization: `Bearer ${token}` } }
                        )
                        .then((response) => {
                          Swal.fire(
                            "Berhasil!",
                            "Pembayaran telah dikonfirmasi.",
                            "success"
                          );
                          getDataTiket(); // Refresh data setelah status diubah
                          handleCloseModal();
                        })
                        .catch((error) => {
                          console.error(
                            "Error updating payment status:",
                            error
                          );
                          Swal.fire(
                            "Gagal!",
                            "Terjadi kesalahan saat mengkonfirmasi pembayaran.",
                            "error"
                          );
                        });
                    }
                  });
                }}
              >
                Konfirmasi Pembayaran
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Modal Edit Schedules */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detail Schedule Tiket </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {schedules && (
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <h5>Informasi Tiket Bioskop</h5>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Nama Film</td>
                        <td>{schedules.title}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Nama Tempat</td>
                        <td>{schedules.venue_name}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Cinema</td>
                        <td>{schedules.cinema_type}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Harga</td>
                        <td>{formatCurrency(schedules.price, "Rp")}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Jam Tayang</td>
                        <td className="d-flex flex-wrap gap-2 h-100">
                          {formatShowtimes(schedules.show_times)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <h5>Edit Schedule</h5>
                </div>
                <Form.Group>
                  <Form.Label>Jam Tayang</Form.Label>
                  <Form.Select onChange={handleShowTimeChange} required>
                    <option value="">Pilih Jam Tayang</option>
                    {selectedSchedule.map((schedule) => (
                      <option
                        key={schedule.schedule_id}
                        value={schedule.schedule_id}
                      >
                        {formatShowtimes(schedule.show_time)} -{" "}
                        {schedule.venue_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                {loading ? (
                  <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <Form onSubmit={handleEditSubmit} className="mt-3">
                    <Form.Group>
                      <Form.Label>Jam Tayang Baru</Form.Label>
                      <Form.Control
                        type="time"
                        value={newShowTime}
                        onChange={(e) => setNewShowTime(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-between gap-2 mb-3 mt-3">
                      <Button
                        variant="outline-success"
                        title="Tambah Jam Tayang"
                        type="button"
                        onClick={() => {
                          if (selectedShowTime) {
                            // Konfirmasi jika ingin menambah jam tayang baru saat ada jam tayang yang dipilih
                            Swal.fire({
                              title: "Konfirmasi",
                              text: "Anda telah memilih jam tayang. Apakah Anda ingin menambahkan jam tayang baru?",
                              icon: "question",
                              showCancelButton: true,
                              confirmButtonText: "Ya, tambahkan baru",
                              cancelButtonText: "Batal",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                handleAddShowTime();
                              }
                            });
                          } else {
                            // Langsung tambah jam tayang baru
                            handleAddShowTime();
                          }
                        }}
                      >
                        <i className="fas fa-plus"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        title="Hapus Jam Tayang"
                        type="button"
                        disabled={!selectedShowTime}
                        onClick={handleDeleteShowTime}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                      <Button
                        variant="outline-primary"
                        title="Simpan Perubahan"
                        type="submit"
                        disabled={!selectedShowTime}
                      >
                        <i className="fas fa-save"></i>
                      </Button>
                    </div>
                  </Form>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TiketFilmApp;
