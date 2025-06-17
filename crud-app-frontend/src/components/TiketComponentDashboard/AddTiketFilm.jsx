import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Base API URL
const API_URL = "http://localhost:3000/api";

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
        const filmsResponse = await axios.get(`${API_URL}/films`);
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
      const response = await axios.post(
        `${API_URL}/tiket-film`,
        {
          film_id: formData.film_id,
          venue_name: formData.venue_name,
          cinema_type: formData.cinema_type,
          ticket_type: formData.ticket_type,
          price: parseInt(formData.price),
          show_time: formData.show_time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Tambah Jadwal Film Baru</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="film_id"
          >
            Film
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="film_id"
            name="film_id"
            value={formData.film_id}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Pilih Film</option>
            {films.map((film) => (
              <option key={film.id} value={film.id}>
                {film.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="venue_name"
          >
            Nama Venue Bioskop
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="venue_name"
            type="text"
            name="venue_name"
            value={formData.venue_name}
            onChange={handleChange}
            disabled={loading}
            placeholder="Contoh: CGV Grand Indonesia"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="cinema_type"
          >
            Tipe Bioskop
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="cinema_type"
            type="text"
            name="cinema_type"
            value={formData.cinema_type}
            onChange={handleChange}
            disabled={loading}
            placeholder="Contoh: Regular, IMAX, 4DX"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="ticket_type"
          >
            Tipe Tiket
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="ticket_type"
            type="text"
            name="ticket_type"
            value={formData.ticket_type}
            onChange={handleChange}
            disabled={loading}
            placeholder="Contoh: Regular, VIP, Premium"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="price"
          >
            Harga Tiket
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            disabled={loading}
            placeholder="Contoh: 50000"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="show_time"
          >
            Jam Tayang
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="show_time"
            type="time"
            name="show_time"
            value={formData.show_time}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? "Membuat..." : "Buat Jadwal"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTiketFilm;
