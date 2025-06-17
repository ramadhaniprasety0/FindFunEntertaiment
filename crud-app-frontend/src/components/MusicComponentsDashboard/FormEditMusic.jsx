import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const FormEditMusic = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState([""]); 
  const [album, setAlbum] = useState([""]);
  const [rating, setRating] = useState("");
  const [genres, setGenres] = useState([""]); 
  const [release_year, setReleaseYear] = useState("");
  const [spotify, setSpotify] = useState("");
  const [apple, setApple] = useState("");
  const [deezer, setDeezer] = useState("");
  const [ytmusic, setYtmusic] = useState(""); 
  const [lirik, setLirik] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);

  
  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        setLoading(true);
        
        const { data } = await api.get(`/music/${id}?include=all`);
        
        const { data: data_artist } = await api.get(`/music/${id}/artists`);
        
        const { data: data_album } = await api.get(`/music/${id}/albums`);
        
        if (data && data.data && data_artist && data_artist.data && data_album && data_album.data) {
          const music = data.data;
          const music_artists = data_artist.data;
          const music_albums = data_album.data;
          
          setTitle(music.title || "");
          setLirik(music.lirik || "");
          setArtist(music_artists.map(artist => artist.id) || []); 
          setAlbum(music_albums.map(album => album.id) || []);
          setRating(music.rating || "");
          
          const fetchedGenres = [music.genre1, music.genre2, music.genre3].filter(Boolean);
          setGenres(fetchedGenres);
          
          setReleaseYear(music.release_year || "");
          setPreviewImage(music.image || "");
          setSpotify(music.spotify_link || "");
          setApple(music.apple_link || "");
          setDeezer(music.deezer_link || "");
          setYtmusic(music.youtube_link || "");

          if (music.image) {
            setExistingImage(music.image);
            setPreviewImage(`${import.meta.env.VITE_API_URL_IMAGE}/${music.image}`);
          }
        
        } else {
          Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data music atau artis.', 'error');
          navigate("/dashboard/music");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching music data:", error);
        setLoading(false);
        Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data music.', 'error');
        navigate("/dashboard/music");
      }
    };

    if (id) {
      fetchMusicData();
    }
  }, [id, navigate]);

  useEffect(() => {
    const getArtists = async () => {
        try {
            const { data } = await api.get("/artists");
            setArtists(data.data);
        } catch (error) {
            console.error(error);
            Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data artist.', 'error');
        }
    };

    const getAlbums = async () => {
        try {
            const { data } = await api.get("/albums");
            setAlbums(data.data);
        } catch (error) {
            console.error(error);
            Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data album.', 'error');
        }
    };

    getArtists();
    getAlbums();
  }, []);

  
  const handleAddGenre = () => {
    if(genres.length >= 3){
      return Swal.fire('Gagal!', 'Maaf, hanya boleh maksimal 3 genre.', 'error');
    }
    setGenres([...genres, ""]);
  };

  const handleRemoveGenre = (index) => {
    const newGenres = genres.filter((_, i) => i !== index);
    setGenres(newGenres);
  };

  // Handle artist management
  const handleAddArtist = () => {
    if(artist.length >= 3){
      return Swal.fire('Gagal!', 'Maaf, hanya boleh maksimal 3 artis.', 'error');
    }
    setArtist([...artist, ""]);
  };

  const handleRemoveArtist = (index) => {
    const newArtists = artist.filter((_, i) => i !== index);
    setArtist(newArtists);
  };

  // Handle album management
  const handleAddAlbum = () => {
    if(album.length >= 3){
      return Swal.fire('Gagal!', 'Maaf, hanya boleh maksimal 3 album.', 'error');
    }
    setAlbum([...album, ""]);
  };

  const handleRemoveAlbum = (index) => {
    const newAlbums = album.filter((_, i) => i !== index);
    setAlbum(newAlbums);
  };

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const filePreview = URL.createObjectURL(file);
      setPreviewImage(filePreview);
    }
  };
  const handleUpdateData = async (e) => {
    e.preventDefault();
  
    if (!title || artist.length === 0 || album.length === 0 || !release_year || !spotify || !apple || !deezer || !lirik) {
      return Swal.fire('Gagal!', 'Semua kolom harus diisi.', 'error');
    }
  
    try {
      setSubmitting(true);
  
      const formData = new FormData();
      formData.append("title", title);
      formData.append("artist", JSON.stringify(artist)); 
      formData.append("album", JSON.stringify(album));   
      formData.append("rating", rating);
      formData.append("genre1", genres[0] || "");
      formData.append("genre2", genres[1] || "");
      formData.append("genre3", genres[2] || "");
      formData.append("release_year", release_year);
      formData.append("spotify", spotify);
      formData.append("apple", apple);
      formData.append("deezer", deezer);
      formData.append("lirik", lirik);
      formData.append("ytmusic", ytmusic);
      formData.append("existingImage", existingImage);
  
      if (imageFile) {
        formData.append("image", imageFile);
      }
  
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      await api.put(`/music/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      Swal.fire('Berhasil!', 'Data music berhasil diperbarui.', 'success');
      navigate("/dashboard/music");
    } catch (error) {
      console.error("Error updating music data:", error);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat memperbarui data music.', 'error');
      setSubmitting(false);
    }
  };
  
  
  

  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="card-title m-0">Edit Music</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpdateData}>
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Judul Music <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Masukkan judul music" />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="release_year" className="form-label">Tahun Rilis <span className="text-danger">*</span></label>
                        <input type="text" 
                            className="form-control" 
                            id="release_year" 
                            value={release_year} 
                            onChange={(e) => setReleaseYear(e.target.value)} 
                            min="1900" 
                            max={currentYear + 5} 
                            required 
                            placeholder="Contoh: 2023"/>
                    </div>
                </div>
            </div>

            <div className="row mb-3">
                <div className="mb-3">
                    <label htmlFor="lirik" className="form-label">Lirik Music <span className="text-danger">*</span></label>
                    <textarea id="lirik" className="form-control" value={lirik} onChange={(e) => setLirik(e.target.value)} required placeholder="Masukkan lirik music"></textarea>
                </div>
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
                  <div className="mb-3 d-flex flex-row ">
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
                </div>
              ))}

            </div>

            <div className="row mb-3">
              <div className="col-md-12 d-flex justify-content-end align-items-center">
                <h6 className="me-2 mb-0 mt-2">Tambah Album</h6>
                <button type="button" className="mt-2 btn-sm btn btn-add" style={{ width: "36px", height: "36px" }} onClick={handleAddAlbum}>
                  <i className="bi bi-plus"></i>
                </button>
              </div>
                {album.map((albumItem, index) => (
                    <div className="col-md-4" key={index}>
                        <label htmlFor={`album${index + 1}`} className="form-label">Album {index + 1}</label>
                        <div className="mb-3 d-flex flex-row">
                            <select className="form-control" id={`album${index + 1}`} value={albumItem} onChange={(e) => {
                                const newAlbums = [...album];
                                newAlbums[index] = e.target.value;
                                setAlbum(newAlbums);
                                }}>
                                <option value="">Pilih Album</option>
                                {albums.map((album) => (
                                    <option key={album.id} value={album.id}>{album.title}</option>
                                ))}
                            </select>
                            {index > 0 && (
                                <button type="button" className="btn btn-danger btn-sm ms-2" onClick={() => handleRemoveAlbum(index)}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">Poster Film</label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <small className="text-muted">
                  Format yang didukung: JPG, JPEG, PNG, GIF (max: 5MB) - Biarkan kosong jika tidak ingin mengubah gambar.
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

            <div className="row mb-3">
                <div className="col-md-3">
                    <label htmlFor="spotify" className="form-label"> Link Spotify <span className="text-danger">*</span></label>
                    <input type="string" id="spotify" className="form-control" value={spotify} onChange={(e) => setSpotify(e.target.value)} placeholder="Masukkan link musik" />
                </div>
                <div className="col-md-3">
                    <label htmlFor="apple" className="form-label"> Link Apple Music <span className="text-danger">*</span></label>
                    <input type="string" id="apple" className="form-control" value={apple} onChange={(e) => setApple(e.target.value)} placeholder="Masukkan link musik" />
                </div>
                <div className="col-md-3">
                    <label htmlFor="deezer" className="form-label"> Link Deezer <span className="text-danger">*</span></label>
                    <input type="string" id="deezer" className="form-control" value={deezer} onChange={(e) => setDeezer(e.target.value)} placeholder="Masukkan link musik" />
                </div>
                <div className="col-md-3">
                    <label htmlFor="ytmusic" className="form-label"> Link Yt Music <span className="text-danger">*</span></label>
                    <input type="string" id="ytmusic" className="form-control" value={ytmusic} onChange={(e) => setYtmusic(e.target.value)} placeholder="Masukkan link musik" />
                </div>
            </div>
            
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate("/dashboard/music")}
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
                  "Simpan Perubahan Music"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormEditMusic;
