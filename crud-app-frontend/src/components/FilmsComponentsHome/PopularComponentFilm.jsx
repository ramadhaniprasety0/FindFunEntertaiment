import { Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
const PopularComponentFilm = () => {
  const [filmsTerbaru, setFilmsTerbaru] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPopularFilms = async () => {
    try {
      setLoading(true);
      const {data} = await axios.get('http://localhost:3000/api/films');
      setFilmsTerbaru(data.data.slice(0, 4));
      setLoading(false);
    } catch (error) {
      console.error(error);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data film.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPopularFilms();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" />
      </div>
    );
  }
  return (
    <>
      {filmsTerbaru.map((films, index) => (
        <Col key={films.id || index} lg={3} md={6} sm={12} className='card-populer-films p-2 mb-3'>
          <Link to={`/films/detail/${films.id}`} className="text-decoration-none text-dark">
            <div className='card-film'>
              <div className='card-film-img'>
                <img src={`http://localhost:3000/${films.image}`} alt={films.title} className='img-fluid mb-2' />
              </div>
              <div className='card-film-caption'>
                <p className='heading'>{films.title}</p>
                <p className="small">Klik untuk melihat detail lengkap</p>
              </div>
            </div>
          </Link>
        </Col>
      ))}
    </>
  );
};

export default PopularComponentFilm;
