import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const CaraouselApp = () => {
    const [carousel, setCarousel] = useState([]);
    const [loading, setLoading] = useState(false);

    const getCarousel = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/carousel");
            setCarousel(data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data Carousel.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCarousel();
    }, []);

    const handleDelete = async (id, title) => {
        Swal.fire({
            title: `Hapus Carousel "${title}"?`,
            text: "Apakah Anda yakin ingin menghapus Carousel ini?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8E97FD',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await api.delete(`/carousel/${id}`);
                await Swal.fire('Terhapus!', 'Album berhasil dihapus.', 'success');
                getCarousel(); 
            } catch (error) {
                console.error(error);
                Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus Carousel.', 'error');
            }
        }
        });
    };

    const handleUpdateStatus = async (id, newStatus) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Status akan diubah menjadi ${newStatus === 1 ? 'Aktif' : 'Tidak Aktif'}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Ubah!',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#8E97FD',
            cancelButtonColor: '#6c757d',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Menggunakan PUT untuk mengupdate status
                    const response = await api.put(`/carousel/status/${id}`, { status: newStatus });
                    
                    // Update status di UI tanpa reload
                    setCarousel(prevCarousel => 
                        prevCarousel.map(item => 
                            item.id === id ? { ...item, status: newStatus } : item
                        )
                    );
    
                    Swal.fire(
                        'Status Diubah!',
                        `Status carousel berhasil diubah menjadi ${newStatus === 1 ? 'Aktif' : 'Tidak Aktif'}.`,
                        'success'
                    );
                } catch (error) {
                    console.error(error);
                    Swal.fire('Gagal!', 'Terjadi kesalahan saat mengubah status.', 'error');
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
        <div>
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
                                <th>Nama</th>
                                <th className="text-center">Poster</th>
                                <th>Title</th>
                                <th>Deskripsi</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carousel.length === 0 ? (
                                <tr>
                                    <td colSpan="7">Tidak ada album yang tersedia.</td>
                                </tr>
                            ) : ( 
                                carousel.map((carausels, index) => (
                                    <tr key={carausels.id}>
                                        <td>{index + 1}</td>
                                        <td>{carausels.carausel_name}</td>
                                        <td>{carausels.image ? (
                                            <img 
                                            src={`${import.meta.env.VITE_API_URL_IMAGE}/${carausels.image}`}
                                            style={{width: "100%", height: "50px", objectFit: "cover"}} 
                                            alt={carausels.title}
                                            className="img-fluid"
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
                                        <td>{carausels.titleImage ? (
                                            <img 
                                            src={`${import.meta.env.VITE_API_URL_IMAGE}/${carausels.titleImage}`}
                                            style={{width: "50px", height: "50px", objectFit: "cover"}} 
                                            alt="Carausel Image" 
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
                                        <td>{truncateText(carausels.deskripsi, 20)}</td>
                                        <td>
                                            <select
                                                className="form-select form-select-sm"
                                                value={carausels.status}
                                                onChange={(e) => handleUpdateStatus(carausels.id, parseInt(e.target.value))}
                                                style={{ width: "auto", maxWidth: "100px", minWidth: "80px", display: "inline-block" }}
                                            >
                                                <option value={0}>Tidak</option>
                                                <option value={1}>Aktif Home</option>
                                                <option value={2}>Aktif Films</option>
                                                <option value={3}>Aktif Music</option>
                                            </select>
                                        </td>

                                        <td>
                                            <div className="d-flex gap-2 align-items-center">
                                                <Link to={`/dashboard/editcarousel/${carausels.id}`} title="Edit Carausel"><i className="bi bi-pencil text-primary"></i></Link>
                                                <Link onClick={() => handleDelete(carausels.id, carausels.title)} title="Hapus Carausel"><i className="bi bi-trash text-danger"></i></Link>
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

export default CaraouselApp;
