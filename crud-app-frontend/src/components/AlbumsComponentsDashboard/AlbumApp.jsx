import { useState, useEffect } from "react";
import api from "../../api/axios"; // Ganti import axios dengan api dari file axios.js
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const AlbumApp = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAlbums = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/albums"); // Hapus URL hardcoded, gunakan endpoint relatif
            setAlbums(data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data album.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAlbums();
    }, []);

    const handleDelete = async (id, title) => {
        Swal.fire({
            title: `Hapus album "${title}"?`,
            text: "Apakah Anda yakin ingin menghapus album ini?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8E97FD',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await api.delete(`/albums/${id}`); // Hapus URL hardcoded, gunakan endpoint relatif
                await Swal.fire('Terhapus!', 'Album berhasil dihapus.', 'success');
                getAlbums(); // refresh data
            } catch (error) {
                console.error(error);
                Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus album.', 'error');
            }
        }
        });
    };

    const truncateText = (text, maxLength) => {
        if (!text) return "-";
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }
        return text;
    };

    return (
        <div className="album-management">
            {loading ? (
                <div className="d-flex">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover table-bordered album-table">
                        <thead className="table-light">
                            <tr>
                                <th>No</th>
                                <th>Poster</th>
                                <th>Judul</th>
                                <th>Deskripsi</th>
                                <th>Genre</th>
                                <th>Tahun Rilis</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {albums.length === 0 ? (
                                <tr>
                                    <td colSpan="7">Tidak ada album yang tersedia.</td>
                                </tr>
                            ) : ( 
                                albums.map((album, index) => (
                                    <tr key={album.id}>
                                        <td>{index + 1}</td>
                                        <td>{album.image ? (
                                            <img 
                                            src={`${import.meta.env.VITE_API_URL_IMAGE}/${album.image}`}
                                            style={{width: "50px", height: "50px", objectFit: "cover"}} 
                                            alt={album.title}
                                            className="img-thumbnail"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/50x50?text=No+Imag";
                                            }}
                                             />
                                        ) : (
                                            <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{width: "50px", height: "50px"}}>
                                                    <i className="bi bi-image text-muted"></i>
                                            </div>
                                            )
                                        }
                                        </td>
                                        <td>{album.title}</td>
                                        <td>{truncateText(album.deskripsi, 20)}</td>
                                        <td>{album.genre}</td>
                                        <td>{album.release_year}</td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-2 align-items-center">
                                                <Link to={`/dashboard/editalbums/${album.id}`} title="Edit Album"><i className="bi bi-pencil text-primary"></i></Link>
                                                <Link onClick={() => handleDelete(album.id, album.title)} title="Hapus Album"><i className="bi bi-trash text-danger"></i></Link>
                                            </div>
                                        </td>                                        
                                    </tr>
                                ))
                            )}
                        
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );  
 };

export default AlbumApp;
