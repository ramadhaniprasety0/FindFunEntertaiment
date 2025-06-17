// Versi lengkap AppCRUD.jsx dengan endpoint yang benar

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const FilmsApp = () => {
  const navigate = useNavigate();
  const [dataFilms, setDataFilms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ambil data film
  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:3000/api/films?include=all"
      );
      setDataFilms(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat mengambil data film.",
        "error"
      );
      setLoading(false);
    }
  };

  // Hapus film

  const handleDeleteFilm = (id, title) => {
    Swal.fire({
      title: `Hapus film "${title}"?`,
      text: "Apakah Anda yakin ingin menghapus film ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8E97FD",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/api/films/${id}`);
          await Swal.fire("Terhapus!", "Film berhasil dihapus.", "success");
          getData();
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat menghapus film.",
            "error"
          );
        }
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  // Fungsi untuk memotong teks jika terlalu panjang
  const truncateText = (text, maxLength = 60) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div className="film-management">
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          <Table striped bordered hover responsive="sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Poster</th>
                <th>Judul</th>
                <th>Deskripsi</th>
                <th>Tahun</th>
                <th>Genre</th>
                <th>Durasi</th>
                <th>Aktor</th>
                <th>Sutradara</th>
                <th>Rating</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataFilms.length === 0 ? (
                <tr>
                  <td colSpan="13" className="text-center py-4">
                    Tidak ada data film tersedia
                  </td>
                </tr>
              ) : (
                dataFilms.map((data, index) => (
                  <tr key={data.id}>
                    <td>{data.id}</td>
                    <td>
                      {data.image ? (
                        <img
                          src={`http://localhost:3000/${data.image}`}
                          alt={data.title}
                          className="img-thumbnail"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/50x50?text=No+Image";
                          }}
                        />
                      ) : (
                        <div
                          className="bg-light rounded d-flex justify-content-center align-items-center"
                          style={{ width: "50px", height: "50px" }}
                        >
                          <i className="bi bi-film text-muted"></i>
                        </div>
                      )}
                    </td>
                    <td>{truncateText(data.title, 20)}</td>
                    <td>{truncateText(data.deskripsi, 10)}</td>
                    <td>{data.release_year}</td>
                    <td>
                      {truncateText(
                        data.genre1 + ", " + data.genre2 + ", " + data.genre3,
                        10
                      )}
                    </td>
                    <td>{data.duration} min</td>
                    <td>{truncateText(data.artists, 10)}</td>
                    <td>{data.director}</td>
                    <td className="text-center">
                      <span
                        className={`badge ${
                          data.rating >= 8
                            ? "bg-success"
                            : data.rating >= 6
                            ? "bg-warning"
                            : "bg-danger"
                        }`}
                      >
                        {data.rating}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          className="btn-update"
                          variant="outline-secondary"
                          size="sm"
                        >
                          <Link
                            to={`/dashboard/editfilms/${data.id}`}
                            title="Edit Film"
                          >
                            <i className="bi bi-pencil text-secondary"></i>
                          </Link>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="btn-delete"
                        >
                          <Link
                            onClick={() =>
                              handleDeleteFilm(data.id, data.title)
                            }
                            title="Hapus Film"
                          >
                            <i className="bi bi-trash text-danger"></i>
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FilmsApp;
