import { useState, useEffect } from "react";
import { Button, Spinner, Modal, Form, Table, Card } from "react-bootstrap";
import api from "../../api/axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate } from "react-router-dom";

const KonserTiketJenisApp = () => {
  const [jenisTiket, setJenisTiket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJenisTiket, setSelectedJenisTiket] = useState(null);
  const [formData, setFormData] = useState({
    jenis_tiket: "",
    harga: "",
  });
  const [konserList, setKonserList] = useState([]);
  const [selectedKonserId, setSelectedKonserId] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Mengambil data jenis tiket untuk konser yang dipilih
  const getJenisTiket = async (konserId) => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/konser/${konserId}/jenis-tiket`,
      );
      setJenisTiket(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat mengambil data jenis tiket konser.",
        "error"
      );
      setLoading(false);
    }
  };

  // Mengambil daftar konser
  const getKonserList = async () => {
    try {
      const { data } = await api.get("/konser");
      setKonserList(data.data || []);
      // Jika ada konser, pilih konser pertama secara default
      if (data.data && data.data.length > 0) {
        setSelectedKonserId(data.data[0].id);
        getJenisTiket(data.data[0].id);
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat mengambil data konser.",
        "error"
      );
    }
  };

  useEffect(() => {
    getKonserList();
  }, []);

  // Handle perubahan konser yang dipilih
  const handleKonserChange = (e) => {
    const konserId = e.target.value;
    setSelectedKonserId(konserId);
    if (konserId) {
      getJenisTiket(konserId);
    } else {
      setJenisTiket([]);
    }
  };

  // Handle perubahan form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Buka modal untuk menambah jenis tiket baru
  const handleOpenAddModal = () => {
    setSelectedJenisTiket(null);
    setFormData({
      jenis_tiket: "",
      harga: "",
    });
    setError("");
    setShowModal(true);
  };

  // Buka modal untuk mengedit jenis tiket
  const handleOpenEditModal = (tiket) => {
    setSelectedJenisTiket(tiket);
    setFormData({
      jenis_tiket: tiket.jenis_tiket,
      harga: tiket.harga,
    });
    setError("");
    setShowModal(true);
  };

  // Tutup modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Validasi form
  const validateForm = () => {
    if (!formData.jenis_tiket.trim()) {
      setError("Jenis tiket harus diisi");
      return false;
    }
    if (!formData.harga || isNaN(formData.harga) || formData.harga <= 0) {
      setError("Harga harus berupa angka positif");
      return false;
    }
    return true;
  };

  // Simpan jenis tiket (tambah atau edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (selectedJenisTiket) {
        // Edit jenis tiket
        await api.put(
          `/konser/jenis-tiket/${selectedJenisTiket.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire("Berhasil!", "Jenis tiket berhasil diperbarui.", "success");
      } else {
        // Tambah jenis tiket baru
        await api.post(
          `/konser/jenis-tiket`,
          {
            ...formData,
            konser_id: selectedKonserId,
          },
        );

        Swal.fire("Berhasil!", "Jenis tiket berhasil ditambahkan.", "success");
      }

      // Tutup modal dan refresh data
      handleCloseModal();
      getJenisTiket(selectedKonserId);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Gagal!",
        `Terjadi kesalahan: ${error.response?.data?.error || error.message}`,
        "error"
      );
    }
  };

  // Hapus jenis tiket
  const handleDelete = (tiket) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: `Jenis tiket ${tiket.jenis_tiket} akan dihapus!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(
            `/konser/jenis-tiket/${tiket.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Swal.fire("Terhapus!", "Jenis tiket berhasil dihapus.", "success");
          getJenisTiket(selectedKonserId);
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Gagal!",
            `Terjadi kesalahan: ${
              error.response?.data?.error || error.message
            }`,
            "error"
          );
        }
      }
    });
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace("Rp", "Rp ");
  };

  return (
    <div className="container mt-4">
      <Card className="mb-4">
        <Card.Header
          as="h5"
          className="d-flex justify-content-between align-items-center"
        >
          <span>Manajemen Jenis Tiket Konser</span>
          <Button
            variant="primary"
            onClick={() => navigate("/dashboard/konser")}
          >
            Kembali ke Daftar Tiket
          </Button>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Pilih Konser</Form.Label>
            <Form.Select
              value={selectedKonserId}
              onChange={handleKonserChange}
              disabled={loading}
            >
              <option value="">-- Pilih Konser --</option>
              {konserList.map((konser) => (
                <option key={konser.id} value={konser.id}>
                  {konser.nama_konser} - {konser.tanggal}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {selectedKonserId && (
            <div className="d-flex justify-content-end mb-3">
              <Button variant="success" onClick={handleOpenAddModal}>
                Tambah Jenis Tiket
              </Button>
            </div>
          )}

          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr className="text-center">
                  <th>No</th>
                  <th>Jenis Tiket</th>
                  <th>Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jenisTiket.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      {selectedKonserId
                        ? "Tidak ada data jenis tiket untuk konser ini"
                        : "Silakan pilih konser terlebih dahulu"}
                    </td>
                  </tr>
                ) : (
                  jenisTiket.map((tiket, index) => (
                    <tr key={tiket.id}>
                      <td className="text-center">{index + 1}</td>
                      <td>{tiket.jenis_tiket}</td>
                      <td className="text-end">
                        {formatCurrency(tiket.harga)}
                      </td>
                      <td className="text-center">
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleOpenEditModal(tiket)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(tiket)}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal Tambah/Edit Jenis Tiket */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedJenisTiket ? "Edit Jenis Tiket" : "Tambah Jenis Tiket"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <div className="alert alert-danger">{error}</div>}

            <Form.Group className="mb-3">
              <Form.Label>Jenis Tiket</Form.Label>
              <Form.Control
                type="text"
                name="jenis_tiket"
                value={formData.jenis_tiket}
                onChange={handleChange}
                placeholder="Contoh: VIP, GOLD, SILVER"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Harga</Form.Label>
              <Form.Control
                type="number"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                placeholder="Masukkan harga tiket"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default KonserTiketJenisApp;
