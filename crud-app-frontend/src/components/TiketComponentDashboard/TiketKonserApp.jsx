import { useState, useEffect } from "react";
import { Accordion, Button, Spinner, Modal, Form } from "react-bootstrap";
import api from "../../api/axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate } from "react-router-dom";

const TiketKonserApp = () => {
  const [tikets, setTikets] = useState([]);
  const token = localStorage.getItem("token");
  const [paymentData, setPaymentData] = useState([]);
  const [filteredPaymentData, setFilteredPaymentData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("WAITING");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedKonser, setSelectedKonser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nama_konser: "",
    deskripsi_acara: "",
    lokasi: "",
    tanggal: "",
  });
  const navigate = useNavigate();

  const handleOpenModal = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleOpenEditModal = (konser) => {
    setSelectedKonser(konser);
    setEditFormData({
      nama_konser: konser.nama_konser,
      deskripsi_acara: konser.deskripsi_acara,
      lokasi: konser.lokasi,
      tanggal: konser.tanggal,
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => setShowEditModal(false);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/konser/${selectedKonser.id}`, editFormData);

      Swal.fire({
        title: "Berhasil!",
        text: "Data konser berhasil diperbarui",
        icon: "success",
        confirmButtonText: "OK",
      });

      handleCloseEditModal();
      getDataTiket();
    } catch (error) {
      console.error("Error updating konser:", error);
      Swal.fire({
        title: "Gagal!",
        text: `Terjadi kesalahan: ${
          error.response?.data?.error || error.message
        }`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDelete = (konser) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: `Konser ${konser.nama_konser} akan dihapus. Tindakan ini tidak dapat dibatalkan!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/konser/${konser.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          Swal.fire({
            title: "Terhapus!",
            text: "Data konser berhasil dihapus",
            icon: "success",
            confirmButtonText: "OK",
          });

          getDataTiket();
        } catch (error) {
          console.error("Error deleting konser:", error);
          Swal.fire({
            title: "Gagal!",
            text: `Terjadi kesalahan: ${
              error.response?.data?.error || error.message
            }`,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  const getDataTiket = async () => {
    try {
      setLoading(true);
      // Mengambil data konser
      const { data } = await api.get("/konser");
      // Mengambil data pembayaran
      const { data: paymentData } = await api.get("/konser/payments/all");
      console.log(paymentData);
      setPaymentData(paymentData.data || []);
      setTikets(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat mengambil data tiket konser.",
        "error"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataTiket();
  }, []);

  // Filter data berdasarkan status
  useEffect(() => {
    if (statusFilter === "ALL") {
      setFilteredPaymentData(paymentData || []);
    } else {
      const filtered = paymentData
        ? paymentData.filter((payment) => payment.status === statusFilter)
        : [];
      setFilteredPaymentData(filtered);
    }
  }, [statusFilter, paymentData]);

  // Handle perubahan filter status
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
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
          <Accordion.Header>Pesanan Tiket Konser Terbaru!</Accordion.Header>
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
                    <td>Konser</td>
                    <td>Tanggal</td>
                    <td>Lokasi</td>
                    <td>Jenis Tiket</td>
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
                        Tidak ada data pesanan tiket konser
                      </td>
                    </tr>
                  ) : (
                    filteredPaymentData.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.payment_id || "-"}</td>
                        <td>{payment.username || "-"}</td>
                        <td>{truncateText(payment.nama_konser, 10)}</td>
                        <td>{payment.tanggal}</td>
                        <td>{truncateText(payment.lokasi, 10)}</td>
                        <td>{payment.jenis_tiket}</td>
                        <td>{formatCurrency(payment.total_harga, "Rp")}</td>
                        <td>
                          {payment.bukti_pembayaran ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL_IMAGE}/${
                                payment.bukti_pembayaran
                              }`}
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
                              payment.status === "ACCEPT"
                                ? "badge bg-success"
                                : payment.status === "REJECT"
                                ? "badge bg-danger"
                                : "badge bg-warning text-dark"
                            }
                          >
                            {payment.status || "PENDING"}
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
                <th>Nama Konser</th>
                <th>Poster</th>
                <th>Deskripsi</th>
                <th>Lokasi</th>
                <th>Tanggal</th>
                <th>Jenis Tiket</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tikets.length === 0 ? (
                <tr>
                  <td colSpan={7}>Tidak ada data tiket konser</td>
                </tr>
              ) : (
                tikets.map((tiket, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{tiket.nama_konser}</td>
                    <td>
                      {tiket.image ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL_IMAGE}/${
                            tiket.image
                          }`}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          alt={tiket.nama_konser}
                          className="img-thumbnail"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://dummyimage.com/50x50/cccccc/ffffff&text=No+Image";
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
                    <td>{truncateText(tiket.deskripsi_acara, 20)}</td>
                    <td>{tiket.lokasi}</td>
                    <td>{tiket.tanggal}</td>
                    <td>
                      <ul className="list-unstyled mb-0">
                        {tiket.jenis_tiket}
                      </ul>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleOpenEditModal(tiket)}
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(tiket)}
                        >
                          <i className="bi bi-trash-fill"></i>
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

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detail Pesanan Tiket Konser</Modal.Title>
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
                        <td className="fw-bold">ID Pembayaran</td>
                        <td>{selectedPayment.payment_id || "-"}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Nama</td>
                        <td>{selectedPayment.nama || "-"}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Email</td>
                        <td>{selectedPayment.email || "-"}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Konser</td>
                        <td>{selectedPayment.nama_konser}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Tanggal</td>
                        <td>{selectedPayment.tanggal}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Lokasi</td>
                        <td>{selectedPayment.lokasi}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Jenis Tiket</td>
                        <td>{selectedPayment.jenis_tiket}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Total Harga</td>
                        <td>
                          {formatCurrency(selectedPayment.total_harga, "Rp")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <h5>Bukti Pembayaran</h5>
                  {selectedPayment.bukti_pembayaran ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL_IMAGE}/${selectedPayment.bukti_pembayaran}`}
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
          {selectedPayment && selectedPayment.bukti_pembayaran && (
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
                      console.log(selectedPayment.payment_id);
                      api
                        .put(
                          `/konser/payment/${selectedPayment.id}/status`,
                          { status: "REJECT" }
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
                          `/konser/payment/${selectedPayment.id}/status`,
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

      {/* Modal Edit Konser */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Konser</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nama Konser</Form.Label>
              <Form.Control
                type="text"
                name="nama_konser"
                value={editFormData.nama_konser}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="deskripsi_acara"
                value={editFormData.deskripsi_acara}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lokasi</Form.Label>
              <Form.Control
                type="text"
                name="lokasi"
                value={editFormData.lokasi}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tanggal</Form.Label>
              <Form.Control
                type="datetime-local"
                name="tanggal"
                value={editFormData.tanggal}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              Simpan Perubahan
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default TiketKonserApp;
