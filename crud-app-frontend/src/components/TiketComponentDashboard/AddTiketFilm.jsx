import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/axios";

const AddTiketFilm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    film_id: "",
    venue_name: "",
    cinema_type: "",
    ticket_type: "",
    price: "",
    show_time: "",
  });
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch films when component mounts
  useEffect(() => {
    const fetchFilms = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch films
        const filmsResponse = await api.get(`/films`);
        setFilms(filmsResponse.data.data);
      } catch (err) {
        console.error("Error fetching films:", err);
        setError(
          "Gagal mengambil data film. Pastikan server backend berjalan."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (
      !formData.film_id ||
      !formData.venue_name ||
      !formData.cinema_type ||
      !formData.ticket_type ||
      !formData.price ||
      !formData.show_time
    ) {
      setError("Semua field harus diisi");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Menggunakan API baru yang menangani pembuatan data di tiga tabel sekaligus
      const response = await api.post(
        `/tiket-film`,
        {
          film_id: formData.film_id,
          venue_name: formData.venue_name,
          cinema_type: formData.cinema_type,
          ticket_type: formData.ticket_type,
          price: parseInt(formData.price),
          show_time: formData.show_time,
        },
      );

      setLoading(false);
      toast.success("Jadwal film berhasil dibuat!");

      // Reset form
      setFormData({
        film_id: "",
        venue_name: "",
        cinema_type: "",
        ticket_type: "",
        price: "",
        show_time: "",
      });

      // Optionally navigate to schedules list
      // navigate('/admin/schedules');
    } catch (err) {
      console.error("Error creating schedule:", err);
      setError(err.response?.data?.message || "Gagal membuat jadwal film");
      setLoading(false);
      toast.error("Gagal membuat jadwal film");
    }
  };

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Header as="h5" className="text-black" style={{backgroundColor:'#B1B7FE'}}>
          Tambah Jadwal Film Baru
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Film *</Form.Label>
                  <Form.Select
                    name="film_id"
                    value={formData.film_id}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  >
                    <option value="">Pilih Film</option>
                    {films.map((film) => (
                      <option key={film.id} value={film.id}>
                        {film.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Venue Bioskop *</Form.Label>
                  <Form.Control
                    type="text"
                    name="venue_name"
                    value={formData.venue_name}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Contoh: CGV Grand Indonesia"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipe Bioskop *</Form.Label>
                  <Form.Control
                    type="text"
                    name="cinema_type"
                    value={formData.cinema_type}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Contoh: Regular, IMAX, 4DX"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipe Tiket *</Form.Label>
                  <Form.Control
                    type="text"
                    name="ticket_type"
                    value={formData.ticket_type}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Contoh: Regular, VIP, Premium"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Harga Tiket (Rp) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Contoh: 50000"
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Jam Tayang *</Form.Label>
                  <Form.Control
                    type="time"
                    name="show_time"
                    value={formData.show_time}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                onClick={() => navigate("/dashboard/tiket/film")}
              >
                Kembali
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Membuat..." : "Buat Jadwal"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddTiketFilm;
