import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Tabs,
  Tab,
  Spinner,
  Alert
} from "react-bootstrap";
import api from "../../api/axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const FilmTiketJenis = () => {
  // State untuk data
  const [cinemaLocations, setCinemaLocations] = useState([]);
  const [ticketPrices, setTicketPrices] = useState([]);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State untuk modal tambah cinema location
  const [showAddCinemaModal, setShowAddCinemaModal] = useState(false);
  const [newCinemaLocation, setNewCinemaLocation] = useState({
    film_id: "",
    venue_name: "",
    cinema_type: ""
  });

  // State untuk modal edit cinema location
  const [showEditCinemaModal, setShowEditCinemaModal] = useState(false);
  const [editCinemaLocation, setEditCinemaLocation] = useState({
    id: "",
    film_id: "",
    venue_name: "",
    cinema_type: ""
  });

  // State untuk modal tambah ticket price
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [newTicketPrice, setNewTicketPrice] = useState({
    film_id: "",
    cinema_id: "",
    ticket_type: "",
    price: ""
  });

  // State untuk modal edit ticket price
  const [showEditTicketModal, setShowEditTicketModal] = useState(false);
  const [editTicketPrice, setEditTicketPrice] = useState({
    id: "",
    film_id: "",
    cinema_id: "",
    ticket_type: "",
    price: ""
  });

  // Fetch data saat komponen dimount
  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk mengambil semua data yang diperlukan
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch films
      const filmsResponse = await api.get("/films");
      setFilms(filmsResponse.data.data);

      // Fetch cinema locations
      const cinemaResponse = await api.get("/cinema-locations");
      setCinemaLocations(cinemaResponse.data.data);

      // Fetch ticket prices
      const ticketResponse = await api.get("/ticket-prices");
      setTicketPrices(ticketResponse.data.data);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal mengambil data. Pastikan server backend berjalan.");
      setLoading(false);
    }
  };

  // Handler untuk input form cinema location
  const handleCinemaInputChange = (e) => {
    const { name, value } = e.target;
    setNewCinemaLocation({
      ...newCinemaLocation,
      [name]: value
    });
  };

  // Handler untuk input form edit cinema location
  const handleEditCinemaInputChange = (e) => {
    const { name, value } = e.target;
    setEditCinemaLocation({
      ...editCinemaLocation,
      [name]: value
    });
  };

  // Handler untuk input form ticket price
  const handleTicketInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicketPrice({
      ...newTicketPrice,
      [name]: value
    });
  };

  // Handler untuk input form edit ticket price
  const handleEditTicketInputChange = (e) => {
    const { name, value } = e.target;
    setEditTicketPrice({
      ...editTicketPrice,
      [name]: value
    });
  };

  // Fungsi untuk menambah cinema location
  const handleAddCinemaLocation = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!newCinemaLocation.film_id || !newCinemaLocation.venue_name || !newCinemaLocation.cinema_type) {
      Swal.fire("Error", "Semua field harus diisi", "error");
      return;
    }

    try {
      setLoading(true);
      
      // Kirim data ke API
      await api.post("/cinema-locations", newCinemaLocation);
      
      // Reset form dan tutup modal
      setNewCinemaLocation({
        film_id: "",
        venue_name: "",
        cinema_type: ""
      });
      setShowAddCinemaModal(false);
      
      // Refresh data
      fetchData();
      
      Swal.fire("Sukses", "Lokasi bioskop berhasil ditambahkan", "success");
    } catch (err) {
      console.error("Error adding cinema location:", err);
      Swal.fire("Error", "Gagal menambahkan lokasi bioskop", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengedit cinema location
  const handleEditCinemaLocation = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!editCinemaLocation.film_id || !editCinemaLocation.venue_name || !editCinemaLocation.cinema_type) {
      Swal.fire("Error", "Semua field harus diisi", "error");
      return;
    }

    try {
      setLoading(true);
      
      // Kirim data ke API
      await api.put(`/cinema-locations/${editCinemaLocation.id}`, {
        film_id: editCinemaLocation.film_id,
        venue_name: editCinemaLocation.venue_name,
        cinema_type: editCinemaLocation.cinema_type
      });
      
      // Reset form dan tutup modal
      setShowEditCinemaModal(false);
      
      // Refresh data
      fetchData();
      
      Swal.fire("Sukses", "Lokasi bioskop berhasil diperbarui", "success");
    } catch (err) {
      console.error("Error updating cinema location:", err);
      Swal.fire("Error", "Gagal memperbarui lokasi bioskop", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menghapus cinema location
  const handleDeleteCinemaLocation = async (id) => {
    // Konfirmasi penghapusan
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus lokasi bioskop ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        
        // Kirim request delete ke API
        await api.delete(`/cinema-locations/${id}`);
        
        // Refresh data
        fetchData();
        
        Swal.fire("Sukses", "Lokasi bioskop berhasil dihapus", "success");
      } catch (err) {
        console.error("Error deleting cinema location:", err);
        Swal.fire("Error", "Gagal menghapus lokasi bioskop", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Fungsi untuk menambah ticket price
  const handleAddTicketPrice = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!newTicketPrice.film_id || !newTicketPrice.cinema_id || !newTicketPrice.ticket_type || !newTicketPrice.price) {
      Swal.fire("Error", "Semua field harus diisi", "error");
      return;
    }

    try {
      setLoading(true);
      
      // Kirim data ke API
      await api.post("/ticket-prices", {
        ...newTicketPrice,
        price: parseFloat(newTicketPrice.price)
      });
      
      // Reset form dan tutup modal
      setNewTicketPrice({
        film_id: "",
        cinema_id: "",
        ticket_type: "",
        price: ""
      });
      setShowAddTicketModal(false);
      
      // Refresh data
      fetchData();
      
      Swal.fire("Sukses", "Harga tiket berhasil ditambahkan", "success");
    } catch (err) {
      console.error("Error adding ticket price:", err);
      Swal.fire("Error", "Gagal menambahkan harga tiket", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengedit ticket price
  const handleEditTicketPrice = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!editTicketPrice.film_id || !editTicketPrice.cinema_id || !editTicketPrice.ticket_type || !editTicketPrice.price) {
      Swal.fire("Error", "Semua field harus diisi", "error");
      return;
    }

    try {
      setLoading(true);
      
      // Kirim data ke API
      await api.put(`/ticket-prices/${editTicketPrice.id}`, {
        film_id: editTicketPrice.film_id,
        cinema_id: editTicketPrice.cinema_id,
        ticket_type: editTicketPrice.ticket_type,
        price: parseFloat(editTicketPrice.price)
      });
      
      // Reset form dan tutup modal
      setShowEditTicketModal(false);
      
      // Refresh data
      fetchData();
      
      Swal.fire("Sukses", "Harga tiket berhasil diperbarui", "success");
    } catch (err) {
      console.error("Error updating ticket price:", err);
      Swal.fire("Error", "Gagal memperbarui harga tiket", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menghapus ticket price
  const handleDeleteTicketPrice = async (id) => {
    // Konfirmasi penghapusan
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus harga tiket ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        
        // Kirim request delete ke API
        await api.delete(`/ticket-prices/${id}`);
        
        // Refresh data
        fetchData();
        
        Swal.fire("Sukses", "Harga tiket berhasil dihapus", "success");
      } catch (err) {
        console.error("Error deleting ticket price:", err);
        Swal.fire("Error", "Gagal menghapus harga tiket", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Fungsi untuk membuka modal edit cinema location
  const openEditCinemaModal = (cinema) => {
    setEditCinemaLocation({
      id: cinema.id,
      film_id: cinema.film_id,
      venue_name: cinema.venue_name,
      cinema_type: cinema.cinema_type
    });
    setShowEditCinemaModal(true);
  };

  // Fungsi untuk membuka modal edit ticket price
  const openEditTicketModal = (ticket) => {
    setEditTicketPrice({
      id: ticket.id,
      film_id: ticket.film_id,
      cinema_id: ticket.cinema_id,
      ticket_type: ticket.ticket_type,
      price: ticket.price
    });
    setShowEditTicketModal(true);
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Mendapatkan nama film berdasarkan ID
  const getFilmName = (filmId) => {
    const film = films.find(film => film.id === parseInt(filmId));
    return film ? film.title : "Film tidak ditemukan";
  };

  // Mendapatkan nama cinema berdasarkan ID
  const getCinemaName = (cinemaId) => {
    const cinema = cinemaLocations.find(cinema => cinema.id === parseInt(cinemaId));
    return cinema ? cinema.venue_name : "Bioskop tidak ditemukan";
  };

  return (
    <Container fluid>
      <h2 className="mb-4">Kelola Tiket Bioskop</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Tabs defaultActiveKey="cinemaLocations" id="tiket-management-tabs" className="mb-3">
        <Tab eventKey="cinemaLocations" title="Lokasi Bioskop">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Daftar Lokasi Bioskop</h5>
              <Button variant="primary" onClick={() => setShowAddCinemaModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>Tambah Lokasi Bioskop
              </Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Film</th>
                      <th>Nama Venue</th>
                      <th>Tipe Bioskop</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cinemaLocations.length > 0 ? (
                      cinemaLocations.map((cinema, index) => (
                        <tr key={cinema.id}>
                          <td>{index + 1}</td>
                          <td>{getFilmName(cinema.film_id)}</td>
                          <td>{cinema.venue_name}</td>
                          <td>{cinema.cinema_type}</td>
                          <td>
                            <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => openEditCinemaModal(cinema)}>
                              <i className="bi bi-pencil-square"></i>
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCinemaLocation(cinema.id)}>
                              <i className="bi bi-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">Tidak ada data lokasi bioskop</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="ticketPrices" title="Harga Tiket">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Daftar Harga Tiket</h5>
              <Button variant="primary" onClick={() => setShowAddTicketModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>Tambah Harga Tiket
              </Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Film</th>
                      <th>Lokasi Bioskop</th>
                      <th>Tipe Tiket</th>
                      <th>Harga</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticketPrices.length > 0 ? (
                      ticketPrices.map((ticket, index) => (
                        <tr key={ticket.id}>
                          <td>{index + 1}</td>
                          <td>{getFilmName(ticket.film_id)}</td>
                          <td>{getCinemaName(ticket.cinema_id)}</td>
                          <td>{ticket.ticket_type}</td>
                          <td>{formatCurrency(ticket.price)}</td>
                          <td>
                            <Button variant="warning" size="sm" className="me-2" onClick={() => openEditTicketModal(ticket)}>
                              <i className="bi bi-pencil-square"></i> Edit
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteTicketPrice(ticket.id)}>
                              <i className="bi bi-trash"></i> Hapus
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">Tidak ada data harga tiket</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Modal Tambah Lokasi Bioskop */}
      <Modal show={showAddCinemaModal} onHide={() => setShowAddCinemaModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Tambah Lokasi Bioskop</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddCinemaLocation}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Film</Form.Label>
              <Form.Select 
                name="film_id" 
                value={newCinemaLocation.film_id} 
                onChange={handleCinemaInputChange}
                required
              >
                <option value="">Pilih Film</option>
                {films.map(film => (
                  <option key={film.id} value={film.id}>{film.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Venue</Form.Label>
              <Form.Control 
                type="text" 
                name="venue_name" 
                value={newCinemaLocation.venue_name} 
                onChange={handleCinemaInputChange}
                placeholder="Masukkan nama venue"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipe Bioskop</Form.Label>
              <Form.Control 
                type="text" 
                name="cinema_type" 
                value={newCinemaLocation.cinema_type} 
                onChange={handleCinemaInputChange}
                placeholder="Masukkan tipe bioskop (contoh: Regular, IMAX, dll)"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddCinemaModal(false)}>
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Simpan"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Edit Lokasi Bioskop */}
      <Modal show={showEditCinemaModal} onHide={() => setShowEditCinemaModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Edit Lokasi Bioskop</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditCinemaLocation}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Film</Form.Label>
              <Form.Select 
                name="film_id" 
                value={editCinemaLocation.film_id} 
                onChange={handleEditCinemaInputChange}
                required
              >
                <option value="">Pilih Film</option>
                {films.map(film => (
                  <option key={film.id} value={film.id}>{film.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Venue</Form.Label>
              <Form.Control 
                type="text" 
                name="venue_name" 
                value={editCinemaLocation.venue_name} 
                onChange={handleEditCinemaInputChange}
                placeholder="Masukkan nama venue"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipe Bioskop</Form.Label>
              <Form.Control 
                type="text" 
                name="cinema_type" 
                value={editCinemaLocation.cinema_type} 
                onChange={handleEditCinemaInputChange}
                placeholder="Masukkan tipe bioskop (contoh: Regular, IMAX, dll)"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditCinemaModal(false)}>
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Simpan"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Tambah Harga Tiket */}
      <Modal show={showAddTicketModal} onHide={() => setShowAddTicketModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Tambah Harga Tiket</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddTicketPrice}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Film</Form.Label>
              <Form.Select 
                name="film_id" 
                value={newTicketPrice.film_id} 
                onChange={handleTicketInputChange}
                required
              >
                <option value="">Pilih Film</option>
                {films.map(film => (
                  <option key={film.id} value={film.id}>{film.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lokasi Bioskop</Form.Label>
              <Form.Select 
                name="cinema_id" 
                value={newTicketPrice.cinema_id} 
                onChange={handleTicketInputChange}
                required
                disabled={!newTicketPrice.film_id}
              >
                <option value="">Pilih Lokasi Bioskop</option>
                {cinemaLocations
                  .filter(cinema => cinema.film_id === parseInt(newTicketPrice.film_id))
                  .map(cinema => (
                    <option key={cinema.id} value={cinema.id}>{cinema.venue_name} - {cinema.cinema_type}</option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipe Tiket</Form.Label>
              <Form.Control 
                type="text" 
                name="ticket_type" 
                value={newTicketPrice.ticket_type} 
                onChange={handleTicketInputChange}
                placeholder="Masukkan tipe tiket (contoh: Regular, Premium, dll)"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Harga</Form.Label>
              <Form.Control 
                type="number" 
                name="price" 
                value={newTicketPrice.price} 
                onChange={handleTicketInputChange}
                placeholder="Masukkan harga tiket"
                required
                min="0"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddTicketModal(false)}>
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Simpan"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Edit Harga Tiket */}
      <Modal show={showEditTicketModal} onHide={() => setShowEditTicketModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Edit Harga Tiket</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditTicketPrice}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Film</Form.Label>
              <Form.Select 
                name="film_id" 
                value={editTicketPrice.film_id} 
                onChange={handleEditTicketInputChange}
                required
              >
                <option value="">Pilih Film</option>
                {films.map(film => (
                  <option key={film.id} value={film.id}>{film.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lokasi Bioskop</Form.Label>
              <Form.Select 
                name="cinema_id" 
                value={editTicketPrice.cinema_id} 
                onChange={handleEditTicketInputChange}
                required
                disabled={!editTicketPrice.film_id}
              >
                <option value="">Pilih Lokasi Bioskop</option>
                {cinemaLocations
                  .filter(cinema => cinema.film_id === parseInt(editTicketPrice.film_id))
                  .map(cinema => (
                    <option key={cinema.id} value={cinema.id}>{cinema.venue_name} - {cinema.cinema_type}</option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipe Tiket</Form.Label>
              <Form.Control 
                type="text" 
                name="ticket_type" 
                value={editTicketPrice.ticket_type} 
                onChange={handleEditTicketInputChange}
                placeholder="Masukkan tipe tiket (contoh: Regular, Premium, dll)"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Harga</Form.Label>
              <Form.Control 
                type="number" 
                name="price" 
                value={editTicketPrice.price} 
                onChange={handleEditTicketInputChange}
                placeholder="Masukkan harga tiket"
                required
                min="0"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditTicketModal(false)}>
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Simpan"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default FilmTiketJenis;