import { useState, useEffect } from "react";
import api from "../../api/axios"; // Ganti import axios dengan api dari file axios.js
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const ArtisApp = () => {
   const [dataArtists, setDataArtists] = useState([]);
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   // Fetch Artists Data
   const getData = async () => {
      try {
         setLoading(true);
         const { data } = await api.get("/artists"); // Hapus URL hardcoded, gunakan endpoint relatif
         setDataArtists(data.data);
         setLoading(false);
      } catch (error) {
         console.error(error);
         Swal.fire("Gagal!", "Terjadi kesalahan saat mengambil data artist.", "error");
         setLoading(false);
      }
   };

   // Delete Artist
   const handleDeleteArtist = async (id, name) => {
      Swal.fire({
         title: `Hapus music "${name}"?`,
         text: "Apakah Anda yakin ingin menghapus Artist ini?",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#8E97FD',
         cancelButtonColor: '#6c757d',
         confirmButtonText: 'Ya, Hapus',
         cancelButtonText: 'Batal',
       }).then(async (result) => {
       if (result.isConfirmed) {
         try {
           await api.delete(`/artists/${id}`); // Hapus URL hardcoded, gunakan endpoint relatif
           await Swal.fire('Terhapus!', 'Music berhasil dihapus.', 'success');
           getData();
         } catch (error) {
           console.error(error);
           Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus music.', 'error');
         }
       }
       });
   };

   useEffect(() => {
      getData();
   }, []);

   const formatDate = (dateString) => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
   };

   const truncateText = (text, maxLength) => {
      if (!text) return "-";
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      }
      return text;
   };

   return (
      <div className="artist-management">
         {loading ? (
            <div className="d-flex justify-content-center my-5">
               <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
               </div>  
            </div>
         ) : (
            <div className="table-responsive">
               <table className="table table-hover artist-table">
                  <thead className="table-light">
                     <tr>
                        <th>No</th>
                        <th>Foto</th>
                        <th>Nama</th>
                        <th>Bio</th>
                        <th>Genre</th>
                        <th>Negara</th>
                        <th>Tanggal Lahir</th>
                        <th>Aktif Dari</th>
                        <th>Popularitas</th>
                        <th>Aksi</th>
                     </tr>
                  </thead>
                  <tbody>
                     {dataArtists.length === 0 ? (
                        <tr>
                           <td colSpan="10" className="text-center">Tidak ada data artist</td>
                        </tr>
                     ) : (
                        dataArtists.map((artist, index) => (
                           <tr key={artist.id}>
                              <td>{index + 1}</td>
                              <td>
                                 {artist.image ? (
                                    <img 
                                       src={`${import.meta.env.VITE_API_URL_IMAGE}/${artist.image}`} 
                                       style={{width: "50px", height: "50px", objectFit: "cover"}} 
                                       alt={artist.name} 
                                       className="img-thumbnail rounded-circle"
                                       onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                                       }}
                                    />
                                 ) : (
                                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width: "50px", height: "50px"}}>
                                       <i className="bi bi-person text-muted"></i>
                                    </div>
                                 )}
                              </td>
                              <td>{artist.name}</td>
                              <td>{truncateText(artist.bio, 20)}</td>
                              <td>{artist.genre || "-"}</td>
                              <td>{artist.country || "-"}</td>
                              <td>{formatDate(artist.birth_date)}</td>
                              <td>{artist.active_year_start || "-"}</td>
                              <td>
                                 <div className="progress" style={{ height: "20px" }}>
                                    <div 
                                       className={`progress-bar ${
                                          artist.popularity >= 70 ? 'bg-success' : 
                                          artist.popularity >= 40 ? 'bg-info' : 
                                          'bg-warning'
                                       }`} 
                                       role="progressbar" 
                                       style={{ width: `${artist.popularity || 0}%` }} 
                                       aria-valuenow={artist.popularity || 0} 
                                       aria-valuemin="0" 
                                       aria-valuemax="100"
                                    >
                                       {artist.popularity || 0}%
                                    </div>
                                 </div>
                              </td>
                              <td className="action-buttons">
                                 <div className="d-flex gap-2 align-items-center">
                                    <Link to={`/dashboard/editartists/${artist.id}`} title="Edit Artist" className="btn btn-sm btn-outline-secondary text-secondary"><i className="bi bi-pencil text-secondary"></i></Link>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteArtist(artist.id, artist.name)} title="Hapus Artist"><i className="bi bi-trash"></i></Button>
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

export default ArtisApp;