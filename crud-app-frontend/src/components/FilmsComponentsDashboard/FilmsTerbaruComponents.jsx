import { useState, useEffect } from "react";
import api from "../../api/axios";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

function FilmTerbaruComponents() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFilmsTebaru = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/films");
      setFilms(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat mengambil data film.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFilmsTebaru();
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
            {films.slice(0, 3).map((film) => (
              <li className="list-group-item d-flex justify-content-between align-items-center p-3" key={film.id}>
                <div className="d-flex align-items-center">
                    <div className="rounded d-flex justify-content-center align-items-center me-3">
                {film.image ? (
                    <img 
                    src={`${import.meta.env.VITE_API_URL_IMAGE}/${film.image}`} 
                    alt={film.title}  
                    style={{ width: '38px', height: '38px' }}/>
                    ):(
                        <i className="bi bi-file-music text-muted"></i>
                    )}
                    </div>
                  
                  <div>
                    <p className="m-0 fw-bold">{truncateText(film.title, 20)}</p>
                    <small className="text-muted">Rating: {film.rating} | {film.release_year}</small>
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

export default FilmTerbaruComponents;
