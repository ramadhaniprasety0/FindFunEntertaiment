import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const FormUpdateCarousel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [carausel_name, setCarauselName] = useState("");
  const [titleImage, setTitleImage] = useState(null); 
  const [image, setImage] = useState(null); 
  const [previewImage, setPreviewImage] = useState(""); 
  const [previewTitleImage, setPreviewTitleImage] = useState(""); 
  const [existingImage, setExistingImage] = useState(""); 
  const [existingTitleImage, setExistingTitleImage] = useState(""); 
  const [deskripsi, setDeskripsi] = useState(""); 
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch carousel data based on ID
  const getCarouselData = async () => {
    try {
      const { data } = await api.get(
        `/carousel/${id}`
      );
      const carousel = data.data[0]; // Assuming it's an array with one item
      setCarauselName(carousel.carausel_name);
      setDeskripsi(carousel.deskripsi);
      setStatus(carousel.status);
      setExistingTitleImage(carousel.titleImage);
      setExistingImage(carousel.image);
      setPreviewTitleImage(`${import.meta.env.VITE_API_URL_IMAGE}/${carousel.titleImage}`);
      setPreviewImage(`${import.meta.env.VITE_API_URL_IMAGE}/${carousel.image}`);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat mengambil data carousel.",
        "error"
      );
    }
  };

  useEffect(() => {
    getCarouselData();
  }, [id]);

  const handleTitleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTitleImage(file);
      setPreviewTitleImage(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdateCarousel = async (e) => {
    e.preventDefault();

    if (!carausel_name || !deskripsi || !status) {
      return Swal.fire("Gagal!", "Harap lengkapi semua data.", "error");
    }

    const formData = new FormData();
    formData.append("carausel_name", carausel_name);
    formData.append("deskripsi", deskripsi);
    formData.append("status", status);

    // Jika ada gambar baru untuk title
    if (titleImage) {
      formData.append("titleImage", titleImage);
    } else {
      formData.append("titleImage", existingTitleImage); // Gunakan gambar lama jika tidak ada yang diupload
    }

    // Jika ada gambar baru untuk carousel
    if (image) {
      formData.append("image", image);
    } else {
      formData.append("image", existingImage); // Gunakan gambar lama jika tidak ada yang diupload
    }

    try {
      setSubmitting(true);
      const response = await api.put(
        `/carousel/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire("Berhasil!", "Carousel berhasil diperbarui.", "success");
        navigate("/dashboard/carousel");
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat memperbarui carousel.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="card-title m-0">Update Carousel</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpdateCarousel}>
            <div className="row mb-3">
              <div className="col-md-12">
                <div className="mb-3">
                  <label htmlFor="carausel_name" className="form-label">
                    Nama Carousel
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="carausel_name"
                    value={carausel_name}
                    onChange={(e) => setCarauselName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
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
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(parseInt(e.target.value))}
                    required
                  >
                    <option value={0}>Tidak Aktif</option>
                    <option value={1}>Aktif Home</option>
                    <option value={2}>Aktif Films</option>
                    <option value={3}>Aktif Music</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="titleImage" className="form-label">
                    Gambar Title
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="titleImage"
                    accept="image/*"
                    onChange={handleTitleImageChange}
                  />
                  <small className="text-muted">
                    Format yang didukung: JPG, JPEG, PNG, GIF (max: 5MB)
                  </small>
                  {previewTitleImage && (
                    <div className="mt-2">
                      <img
                        src={previewTitleImage}
                        alt="Preview Title"
                        style={{ height: "150px", objectFit: "cover" }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Cover Carousel
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
                onClick={() => navigate("/dashboard/carousel")}
                disabled={submitting}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
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
                  "Simpan Carousel"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormUpdateCarousel;
