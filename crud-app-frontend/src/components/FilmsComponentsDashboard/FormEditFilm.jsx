import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import api from "../../api/axios";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const FormEditData = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [release_year, setReleaseYear] = useState("");
  const [rating, setRating] = useState("");
  const [genres, setGenres] = useState([""]);
  const [aktors, setAktors] = useState([]);
  const [artists, setArtists] = useState([]);
  const [artist, setArtist] = useState([""]);
  const [duration, setDuration] = useState("");
  const [status_film, setStatus] = useState("");
  const [netflix, setNetflix] = useState("");
  const [appletv, setAppletv] = useState("");
  const [hbogo, setHbogo] = useState("");
  const [bioskop, setBioskop] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [posterImage, setPosterImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [existingPosterImage, setExistingPosterImage] = useState("");
  const [previewPosterImage, setPreviewPosterImage] = useState("");
  const [director, setDirector] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const getDataFilms = async () => {
    try {
      const { data } = await api.get(`/films/${id}`);

      const { data: data_artist } = await api.get(`/films/${id}/artists`);

      if(data && data.data && data_artist && data_artist.data){
        const film = data.data;
        const film_artists = data_artist.data;

        setTitle(film.title);
        setDeskripsi(film.deskripsi);
        setReleaseYear(film.release_year);
        setRating(film.rating);
        const fetchedGenres =[film.genre1, film.genre2, film.genre3].filter(Boolean);
        setGenres(fetchedGenres);
        setDuration(film.duration);
        setStatus(film.status_film);
        setNetflix(film.netflix_link);
        setAppletv(film.appletv_link);
        setHbogo(film.hbogo_link);
        setBioskop(film.bioskop_link);
        setArtist(film_artists.map((artist) => artist.id) || []);
        setAktors(film_artists.map((actor) => actor.pemeran) || []);
        setDirector(film.director);
        setExistingImage(film.image);
        setExistingPosterImage(film.image_poster);
        setPreviewImage(`${import.meta.env.VITE_API_URL_IMAGE}/${film.image}`);
        setPreviewPosterImage(`${import.meta.env.VITE_API_URL_IMAGE}/${film.image_poster}`);
      }

    } catch (error) {
      console.error(error);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data film.', 'error');
    }
  };

  const getArtists = async () => {
    try {
        const { data } = await api.get("/artists");
        setArtists(data.data);
    } catch (error) {
        console.error(error);
        Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data artist.', 'error');
    }
};

  useEffect(() => {
    getDataFilms();
    getArtists();
  }, [id]);


  const handleAddGenre = () => {
    setGenres([...genres, ""]); 
  };

  const handleRemoveGenre = (index) => {
    const newGenres = genres.filter((_, i) => i !== index); // Menghapus genre yang dipilih
    setGenres(newGenres);
  };

  const handleAddArtist = () => {
    setArtist([...artist, ""]);
    setAktors([...aktors, ""]);
  };

  const handleRemoveArtist = (index) => {
    const newsAcktors = aktors.filter((_, i) => i !== index);
    const newArtists = artist.filter((_, i) => i !== index);
    setArtist(newArtists);
    setAktors(newsAcktors);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };


  const handlePosterImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterImage(file);
      setPreviewPosterImage(URL.createObjectURL(file));
    }
  };

  const handleUpdateData = async (e) => {
    e.preventDefault();
    
    if (!title || !deskripsi || !release_year || !rating || !genres || !artist || !duration || !aktors || !director || !status_film) {
          return Swal.fire('Gagal!', 'Harap lengkapi semua bidang yang diperlukan.', 'error');
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("deskripsi", deskripsi);
    formData.append("release_year", release_year);
    formData.append("rating", rating);
    formData.append("genre1", genres[0]);
    formData.append("genre2", genres[1] || "");
    formData.append("genre3", genres[2] || "");
    formData.append("artist", JSON.stringify(artist));
    formData.append("aktors", JSON.stringify(aktors));
    formData.append("duration", duration);
    formData.append("director", director);
    formData.append("status_film", status_film);
    formData.append("netflix", netflix);
    formData.append("appletv", appletv);
    formData.append("hbogo", hbogo);
    formData.append("bioskop", bioskop);

    
    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", existingImage); 
    }

    if (posterImage) {
      formData.append("posterImage", posterImage);
    } else {
      formData.append("posterImage", existingPosterImage);  
    }
    
    try {
      setSubmitting(true);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await api.put(`/films/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if(response.data.success){
        Swal.fire('Berhasil!', 'Data film berhasil diperbarui.', 'success');
        navigate("/dashboard/films");
      }
    } catch (error) {
      console.error("Error updating film:", error);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat memperbarui data film.', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  
  const currentYear = new Date().getFullYear();


  return (
    <div className="container">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="card-title m-0">Edit Film</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpdateData}>
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Judul <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Masukkan judul film"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="release_year" className="form-label">Tahun Rilis <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    id="release_year"
                    value={release_year}
                    onChange={(e) => setReleaseYear(e.target.value)}
                    min="1900"
                    max={currentYear + 5}
                    required
                    placeholder="Contoh: 2023"
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="deskripsi" className="form-label">Deskripsi <span className="text-danger">*</span></label>
              <textarea
                className="form-control"
                id="deskripsi"
                rows="3"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
                placeholder="Masukkan deskripsi atau sinopsis film"
              ></textarea>
            </div>
            <div className="row mb-3 ">
                <div className="col-md-12 d-flex justify-content-end align-items-center">
                  <h6 className="me-2 mb-0 mt-2">Tambah Genre</h6>
                    <button
                    type="button"
                    className="mt-2 btn-sm btn btn-add"
                    style={{ width: "36px", height: "36px" }}
                    onClick={handleAddGenre}
                    >
                    <i className="bi bi-plus"></i>
                    </button>
                </div>
                        
            {genres.map((genre, index) => (
                <div className="col-md-4 mb-3" key={index}>
                    <label htmlFor={`genre${index + 1}`} className="form-label">
                    Genre {index + 1}
                                </label>
                <div className="mb-3 d-flex flex-row ">
                    <input
                    type="text"
                    className="form-control"
                    id={`genre${index + 1}`}
                    value={genre}
                    onChange={(e) => {
                        const newGenres = [...genres];
                        newGenres[index] = e.target.value;
                        setGenres(newGenres);
                    }}
                    placeholder="Masukkan genre"
                    />
                    {index > 0 && (
                    <button
                        type="button"
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => handleRemoveGenre(index)}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                    )}
                </div>
              </div>
            ))}       
          </div>

          <div className="row mb-3">
              <div className="col-md-12 d-flex justify-content-end align-items-center">
                  <h6 className="me-2 mb-0 mt-2">Tambah Artist</h6>
                  <button
                  type="button"
                  className="mt-2 btn-sm btn btn-add"
                  style={{ width: "36px", height: "36px" }}
                  onClick={handleAddArtist}
                  >
                  <i className="bi bi-plus"></i>
                  </button>
              </div>
              {artist.map((artistItem, index) => (
              <div className="col-md-4" key={index}>
                <label htmlFor={`artist${index + 1}`} className="form-label">
                  Artist {index + 1}
                </label>
                <div className="mb-3 d-flex flex-row">
                  <select
                    className="form-control"
                    id={`artist${index + 1}`}
                    value={artistItem}
                    onChange={(e) => {
                      const newArtists = [...artist];
                      newArtists[index] = e.target.value;
                      setArtist(newArtists);
                    }}
                  >
                    <option value="">Pilih Artis</option>
                    {artists.map((artist) => (
                      <option key={artist.id} value={artist.id}>
                        {artist.name}
                      </option>
                    ))}
                  </select>
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleRemoveArtist(index)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>

                {/* Add a field for the actor's role */}
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id={`aktorRole${index + 1}`}
                    value={aktors[index]}
                    onChange={(e) => {
                      const newAktor = [...aktors];
                      newAktor[index] = e.target.value;
                      setAktors(newAktor);
                    }}
                    placeholder="Berperan Sebagai Apa?"
                  />
                </div>
              </div>
            ))}

          </div>

          
            <div className="row mb-3">
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="rating" className="form-label">Rating <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    className="form-control"
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                    placeholder="Skala 0-10"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="duration" className="form-label">Durasi (menit) <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                    required
                    placeholder="Contoh: 120"
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="image" className="form-label">Poster Film</label>
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
                        style={{ height: '150px', objectFit: 'cover' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                <label htmlFor="image" className="form-label">Benner Film</label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  accept="image/*"
                  onChange={handlePosterImageChange}
                />
                <small className="text-muted">
                  Format yang didukung: JPG, JPEG, PNG, GIF (max: 5MB)
                </small>
                {previewPosterImage && (
                  <div className="mt-2">
                      <p className="text-muted">Preview:</p>
                      <img 
                        src={previewPosterImage} 
                        alt="previewPosterImage" 
                        style={{ height: '150px', objectFit: 'cover' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </div>
            </div>

              <div className="row mb-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="director" className="form-label">Sutradara</label>
                  <input
                    type="text"
                    className="form-control"
                    id="director"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    placeholder="Nama sutradara"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="status_film" className="form-label">Status <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    id="status_film"
                    value={status_film}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="">Pilih Tayang</option>
                    <option value="1">Tayang di Platform</option>
                    <option value="2">Tayang di Cinema</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-3">
                <div className="mb-3">
                  <label htmlFor="netflix" className="form-label">Link Netflix</label>
                  <input type="string" className="form-control" id="netflix" value={netflix} onChange={(e) => setNetflix(e.target.value)} placeholder="Masukkan link Netflix" />
                </div>
              </div>
              <div className="col-md-3">
                <div className="mb-3">
                  <label htmlFor="appletv" className="form-label">Link Apple TV</label>
                  <input type="string" className="form-control" id="appletv" value={appletv} onChange={(e) => setAppletv(e.target.value)} placeholder="Masukkan link Apple TV" />
                </div>
              </div>
              <div className="col-md-3">
                <div className="mb-3">
                  <label htmlFor="hbogo" className="form-label">Link Hbo Go</label>
                  <input type="string" className="form-control" id="hbogo" value={hbogo} onChange={(e) => setHbogo(e.target.value)} placeholder="Masukkan link Hbo Go" />
                </div>
              </div>
              <div className="col-md-3">
                <div className="mb-3">
                  <label htmlFor="bioskop" className="form-label">Link Penayangan Bioskop</label>
                  <input type="string" className="form-control" id="bioskop" value={bioskop} onChange={(e) => setBioskop(e.target.value)} placeholder="Masukkan link Penayangan" />
                </div>
              </div>
              
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate("/dashboard/films")}
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
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Film"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormEditData;