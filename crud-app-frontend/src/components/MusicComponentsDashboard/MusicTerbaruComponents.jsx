import { useState, useEffect } from "react";
import api from "../../api/axios";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

function MusicTerbaruComponents() {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMusicTebaru = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/music");
      setMusics(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat mengambil data music.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMusicTebaru();
  }, []);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div>
      <div className="card-body p-0">
        {loading ? (
          <div className="d-flex">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {musics.slice(0, 3).map((music) => (
              <li className="list-group-item d-flex justify-content-between align-items-center p-3" key={music.id}>
                <div className="d-flex align-items-center">
                    <div className="rounded d-flex justify-content-center align-items-center me-3">
                {music.image ? (
                    <img 
                    src={`${import.meta.env.VITE_API_URL_IMAGE}/${music.image}`} 
                    alt={music.title}  
                    style={{ width: '38px', height: '38px' }}/>
                    ):(
                        <i className="bi bi-file-music text-muted"></i>
                    )}
                    </div>
                  
                  <div>
                    <p className="m-0 fw-bold">{truncateText(music.title, 20)}</p>
                    <small className="text-muted">Rating: {music.rating} | {music.release_year}</small>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MusicTerbaruComponents;
