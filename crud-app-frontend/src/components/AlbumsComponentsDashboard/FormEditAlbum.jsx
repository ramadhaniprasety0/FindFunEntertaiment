import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios"; 

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const FormEditAlbum = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [genre, setGenre] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(""); 
  const [previewImage, setPreviewImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const { data } = await api.get(`/albums/${id}`); 
        const album = data.data;
        setTitle(album.title);
        setReleaseYear(album.release_year);
        setGenre(album.genre);
        setDeskripsi(album.deskripsi);
        setExistingImage(album.image);

        setPreviewImage(`${import.meta.env.VITE_API_URL_IMAGE}/${album.image}`);
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Gagal!",
          "Terjadi kesalahan saat mengambil data album.",
          "error"
        );
      }
    };

    fetchAlbum();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleEditAlbum = async (e) => {
    e.preventDefault();

    if (!title || !releaseYear || !genre) {
      return Swal.fire(
        "Gagal!",
        "Harap lengkapi semua bidang yang diperlukan.",
        "error"
      );
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("release_year", releaseYear);
      formData.append("genre", genre);
      formData.append("deskripsi", deskripsi);

      if (image) {
        formData.append("image", image);
      } else if (existingImage) {
        formData.append("image", existingImage);
      }

      await api.put(`/albums/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization header tidak perlu karena sudah ditangani oleh axios.js
        },
      });

      Swal.fire("Berhasil!", "Album berhasil diperbarui.", "success");
      navigate("/dashboard/albums");
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat memperbarui album.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h5>Edit Album</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleEditAlbum}>
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Judul Album
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="releaseYear" className="form-label">
                    Tahun Rilis
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="releaseYear"
                    value={releaseYear}
                    min="1900"
                    max={currentYear + 5}
                    onChange={(e) => setReleaseYear(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="genre" className="form-label">
                    Genre
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="deskripsi" className="form-label">
                    Deskripsi
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="deskripsi"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Cover Album
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <small className="text-muted">
                    Format yang didukung: JPG, JPEG, PNG, GIF (max: 5MB) -
                    Biarkan kosong jika tidak ingin mengubah gambar.
                  </small>
                  {previewImage && (
                    <div className="mt-2">
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{ height: "150px", objectFit: "cover" }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/dashboard/albums")}
                disabled={submitting}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-add"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Album"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormEditAlbum;
