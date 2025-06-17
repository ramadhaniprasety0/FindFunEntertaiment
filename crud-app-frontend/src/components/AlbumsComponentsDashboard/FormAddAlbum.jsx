import { useEffect, useState } from "react";
import api from "../../api/axios"; // Ganti import axios dengan api dari file axios.js
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const FormAddAlbum = () => {
    const navigate = useNavigate();
    // Token tidak perlu diambil manual karena sudah ditangani oleh axios.js
    // const token = localStorage.getItem("token");

    const [title, setTitle] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const [genre, setGenre] = useState("");
    const [artist, setArtist] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [artists, setArtists] = useState([]);
    const [dataAlbum, setDataAlbum] = useState([]);

    const getData = async () =>{
        try {
            const { data } = await api.get("/album"); // Hapus URL hardcoded, gunakan endpoint relatif
            setDataAlbum(data.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getArtists = async () => {
        try {
            const { data } = await api.get("/artists"); // Hapus URL hardcoded, gunakan endpoint relatif
            setArtists(data.data);
        } catch (error) {
            console.error(error);
            Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data artist.', 'error');
        }
    };

    useEffect(() => {
        getData();
        getArtists();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleAddAlbum = async (e) => {
        e.preventDefault();
    
        const existingAlbum = dataAlbum.find(album => album.title.toLowerCase() === title.toLowerCase());
        if (existingAlbum) {
            return Swal.fire('Gagal!', 'Album dengan judul yang sama sudah ada.', 'error');
        }
    
        if (!title || !releaseYear || !genre || !artist || !deskripsi || !image) {
            return Swal.fire('Gagal!', 'Harap lengkapi semua bidang yang diperlukan.', 'error');
        }
    
        try {
            setSubmitting(true);
    
            const formData = new FormData();
            formData.append("title", title);
            formData.append("release_year", releaseYear);
            formData.append("artist_id", artist);  // Ensure that this is passing the correct artist ID
            formData.append("deskripsi", deskripsi);
            formData.append("genre", genre);
    
            if (image) {
                formData.append("image", image);  // Image is attached here
            }
    
            // Debugging: Checking form data
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
    
            await api.post("/albums", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    // Authorization header tidak perlu karena sudah ditangani oleh axios.js
                },
            });
            
            Swal.fire('Berhasil!', 'Album berhasil ditambahkan.', 'success');
            navigate("/dashboard/albums");
        } catch (error) {
            console.error(error);
            Swal.fire('Gagal!', 'Terjadi kesalahan saat menambahkan album.', 'error');
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
                    <h5 className="card-title m-0">Tambah Album</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleAddAlbum}>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Judul Album</label>
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
                                    <label htmlFor="releaseYear" className="form-label">Tahun Rilis</label>
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
                                    <label htmlFor="genre" className="form-label">Genre</label>
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
                                    <label htmlFor="deskripsi" className="form-label">Deskripsi</label>
                                    <input type="text" className="form-control" id="deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Deskripsi album" required />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="image" className="form-label">Cover Album</label>
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
                                                style={{height: '150px', objectFit: 'cover'}} 
                                                className="img-thumbnail" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="artist1" className="form-label">Artis 1 <span className="text-danger">*</span></label>
                                    <select 
                                        className="form-control" 
                                        id="artist1" 
                                        value={artist} 
                                        onChange={(e) => setArtist(e.target.value)} 
                                        required
                                    >
                                        <option value="">Pilih Artis</option>
                                        {artists.map((artist) => (
                                            <option key={artist._id} value={artist.id}>{artist.name}</option>
                                        ))}
                                    </select>
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

export default FormAddAlbum;
