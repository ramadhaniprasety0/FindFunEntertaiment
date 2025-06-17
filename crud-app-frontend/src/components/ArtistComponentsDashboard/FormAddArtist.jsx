import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; // Ganti import axios dengan api dari file axios.js
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const FormAddArtist = () => {
  const navigate = useNavigate();
  // Token tidak perlu diambil manual karena sudah ditangani oleh axios.js
  // const token = localStorage.getItem("token");

  // State for form data
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [genre, setGenre] = useState("");
  const [activeYearStart, setActiveYearStart] = useState("");
  const [activeYearEnd, setActiveYearEnd] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");
  const [website, setWebsite] = useState("");
  const [popularity, setPopularity] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dataArtists, setDataArtists] = useState([]);

  // Fetch existing artists to check for duplicates
  const getData = async () => {
    try {
      const { data } = await api.get("/artists");
      setDataArtists(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL for the selected file
      const filePreview = URL.createObjectURL(file);
      setPreviewImage(filePreview);
    }
  };

  // Handle form submission
  const handleAddData = async (e) => {
    e.preventDefault();

    const existingArtist = dataArtists.find(
      (artist) => artist.name.toLowerCase() === name.toLowerCase()
    );

    if (existingArtist) {
      return Swal.fire(
        "Gagal!",
        "Artist dengan nama ini sudah terdaftar",
        "error"
      );
    }

    if (!name) {
      return Swal.fire("Gagal!", "Semua kolom harus diisi.", "warning");
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (birthDate) formData.append("birth_date", birthDate);
      formData.append("country", country);
      formData.append("genre", genre);
      if (activeYearStart)
        formData.append("active_year_start", activeYearStart);
      if (activeYearEnd) formData.append("active_year_end", activeYearEnd);
      formData.append("instagram", instagram);
      formData.append("twitter", twitter);
      formData.append("youtube", youtube);
      formData.append("website", website);
      if (popularity) formData.append("popularity", popularity);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      await api.post("/artists", formData, { // Hapus URL hardcoded, gunakan endpoint relatif
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization header tidak perlu karena sudah ditangani oleh axios.js
        },
      });

      Swal.fire("Berhasil!", "Artist berhasil ditambahkan.", "success");
      navigate("/dashboard/artists");
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menambahkan artist.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="container">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="card-title m-0">Tambah Artist</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleAddData}>
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nama Artist <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Masukkan nama artist"
                  />
                </div>
              </div>
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
                    placeholder="Pop, Rock, Jazz, dll"
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="bio" className="form-label">
                Biografi
              </label>
              <textarea
                id="bio"
                className="form-control"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="4"
                placeholder="Biografi singkat tentang artist ini"
              ></textarea>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="country" className="form-label">
                    Negara Asal
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Masukkan negara asal"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="birthDate" className="form-label">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="birthDate"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="activeYearStart" className="form-label">
                    Aktif Dari Tahun
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="activeYearStart"
                    value={activeYearStart}
                    onChange={(e) => setActiveYearStart(e.target.value)}
                    min="1900"
                    max={currentYear}
                    placeholder="Contoh: 2010"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="activeYearEnd" className="form-label">
                    Aktif Sampai Tahun
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="activeYearEnd"
                    value={activeYearEnd}
                    onChange={(e) => setActiveYearEnd(e.target.value)}
                    min="1900"
                    max={currentYear}
                    placeholder="Kosongkan jika masih aktif"
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Foto Artist
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              <small className="text-muted">
                Format yang didukung: JPG, JPEG, PNG, GIF (max: 5MB)
              </small>
              {previewImage && (
                <div className="mt-2">
                  <p className="text-muted">Preview:</p>
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ height: "150px", objectFit: "cover" }}
                    className="img-thumbnail"
                  />
                </div>
              )}
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="popularity" className="form-label">
                    Popularitas (0-100)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="popularity"
                    value={popularity}
                    onChange={(e) => setPopularity(e.target.value)}
                    min="0"
                    max="100"
                    placeholder="Tingkat popularitas (0-100)"
                  />
                </div>
              </div>
            </div>

            <h6 className="mt-4 mb-3">Media Sosial</h6>
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="instagram" className="form-label">
                    Instagram
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">@</span>
                    <input
                      type="text"
                      className="form-control"
                      id="instagram"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="twitter" className="form-label">
                    Twitter
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">@</span>
                    <input
                      type="text"
                      className="form-control"
                      id="twitter"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="youtube" className="form-label">
                    YouTube
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="youtube"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="URL saluran YouTube"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="website" className="form-label">
                    Website
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/dashboard/artists")}
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
                  "Simpan Artist"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormAddArtist;
