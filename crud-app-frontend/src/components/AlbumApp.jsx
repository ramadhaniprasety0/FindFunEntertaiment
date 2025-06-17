import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AlbumApp = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAlbums = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("http://localhost:3000/album/getalbums");
            setAlbums(data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengambil data album");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAlbums();
    }, []);

    const handleDelete = async (id, title) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus album "${title}"?`)) {
            try {
                await axios.delete(`http://localhost:3000/album/deletealbum/${id}`);
                toast.success("Album berhasil dihapus");
                setAlbums(albums.filter((album) => album._id !== id));
            } catch (error) {
                console.error(error);
                toast.error("Terjadi kesalahan saat menghapus album");
            }
        }
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
                    <table className="table table-hover album-table">
                        <thead className="table-light">
                            <tr>
                                <th>No</th>
                                <th>Poster</th>
                                <th>Judul</th>
                                <th>Deskripsi</th>
                                <th>Artist</th>
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
                                    <tr key={album._id}>
                                        <td>{index + 1}</td>
                                        <td>{album.image ? (
                                            <img 
                                            src={`http://localhost:3000/${album.image}`}
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
                                        <td>{truncateText(album.deskripsi, 5)}</td>
                                        <td>{truncateText(album.artist?.map((artist) => artist.name).join(", "), 10)}</td>
                                        <td>{album.genre}</td>
                                        <td>{album.release_year}</td>
                                        <td>
                                            <div className="d-flex gap-2 align-items-center">
                                                <Link to={`/dashboard/editalbums/${album._id}`} title="Edit Album"><i className="bi bi-pencil text-primary"></i></Link>
                                                <Link onClick={() => handleDelete(album._id, album.title)} title="Hapus Album"><i className="bi bi-trash text-danger"></i></Link>
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
