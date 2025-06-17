import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios"; // Ganti import axios dengan api dari file axios.js
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const FormAddMusic = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Menangkap data dari Form
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
    const [dataMusic, setDataMusic] = useState([]);
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);

    const handleAddGenre = () => {
        setGenres([...genres, ""]); 
      };
      
      const handleRemoveGenre = (index) => {
        const newGenres = genres.filter((_, i) => i !== index); // Menghapus genre yang dipilih
        setGenres(newGenres);
      };

      const handleAddAlbum = () => {
        setAlbum([...album, ""]);
      };
    
      const handleRemoveAlbum = (index) => {
        const newAlbums = album.filter((_, i) => i !== index);
        setAlbum(newAlbums);
      };

      const handleAddArtist = () => {
        setArtist([...artist, ""]); // Menambah input artis baru
      };
      
      const handleRemoveArtist = (index) => {
        const newArtists = artist.filter((_, i) => i !== index); // Menghapus artis yang dipilih
        setArtist(newArtists);
      };

    const getData = async () => {
        try {
            const { data } = await api.get("/music");
            setDataMusic(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getArtists = async () => {
        try {
            const { data } = await api.get("/artists"); // Hapus URL hardcoded, gunakan endpoint relatif
            setArtists(data.data);
        } catch (error) {
            console.error(error);
            Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data artist.', 'error');
        }
    };

    const getAlbums = async () => {
        try {
            const { data } = await api.get("/albums"); // Hapus URL hardcoded, gunakan endpoint relatif
            setAlbums(data.data);
        } catch (error) {
            console.error(error);
            Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data album.', 'error');
        }
    };

    useEffect(() =>{
        getData();
        getArtists();
        getAlbums();
    },[]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create a preview URL for the selected file
            const filePreview = URL.createObjectURL(file);
            setPreviewImage(filePreview);
        }
    };

    const handleAddData = async (e) => {
        e.preventDefault();
      
        const exitingMusic = dataMusic.find(music => music.title.toLowerCase() === title.toLowerCase());
        if (exitingMusic) {
          return Swal.fire('Gagal!', 'Music dengan judul ini sudah terdaftar', 'error');
        }
      
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
          formData.append("genre1", genres[0]);
          formData.append("genre2", genres[1] || "");
          formData.append("genre3", genres[2] || "");
          formData.append("release_year", release_year);
          formData.append("spotify", spotify);
          formData.append("apple", apple);
          formData.append("deezer", deezer);
          formData.append("lirik", lirik);
          formData.append("ytmusic", ytmusic);
      
          if (imageFile) {
            formData.append("image", imageFile);
          }
      
          for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
          }
      
          await api.post("/music", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
      
          Swal.fire('Berhasil!', 'Music berhasil ditambahkan.', 'success');
          navigate("/dashboard/music");
        } catch (error) {
          console.error(error);
          Swal.fire('Gagal!', 'Terjadi kesalahan saat menambahkan music.', 'error');
        } finally {
          setSubmitting(false);
        }
      };
      
      
      
      

    const currentYear = new Date().getFullYear();

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    return (
        <div className="container">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                    <h5 className="card-title m-0">Tambah Music</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleAddData}>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Judul Music <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Masukkan judul music" />
                                </div>
                            </div>
                            <div className="col-md-4">
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
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lirik" className="form-label">Lirik Music <span className="text-danger">*</span></label>
                            <textarea id="lirik" className="form-control" value={lirik} onChange={(e) => setLirik(e.target.value)} required placeholder="Masukkan lirik music"></textarea>
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
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="spotify" className="form-label"> Link Spotify <span className="text-warning">*</span></label>
                                    <input type="string" id="spotify" className="form-control" value={spotify} onChange={(e) => setSpotify(e.target.value)} placeholder="Masukkan link musik" />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="apple" className="form-label"> Link Apple Music <span className="text-warning">*</span></label>
                                    <input type="string" id="apple" className="form-control" value={apple} onChange={(e) => setApple(e.target.value)} placeholder="Masukkan link musik" />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="deezer" className="form-label"> Link Deezer <span className="text-warning">*</span></label>
                                    <input type="string" id="deezer" className="form-control" value={deezer} onChange={(e) => setDeezer(e.target.value)} placeholder="Masukkan link musik" />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="ytmusic" className="form-label"> Link Yt Music <span className="text-warning">*</span></label>
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

export default FormAddMusic;