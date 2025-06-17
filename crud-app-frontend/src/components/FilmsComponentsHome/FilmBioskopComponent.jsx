import { Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../../api/axios"; // Ganti import axios dengan api dari file axios.js
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const FilmsBioskopComponent = () => {
  const [filmsBioskop, setFilmsBioskop] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFilmsBioskop = async () => {
    try {
      setLoading(true);
      const {data} = await api.get("/films/bioskop/2"); // Hapus URL hardcoded, gunakan endpoint relatif
      setFilmsBioskop(data.data.slice(0, 4));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching films:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getFilmsBioskop();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" />
      </div>
    );
  }

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <>
        <Row className="gx-3 mb-3 mt-3">
          {filmsBioskop.map((films, index) => (
            <Col lg={6} md={12} key={films.id || index} className="mb-3">
              <div className="bioskop-film-row d-flex overflow-hidden">
                <div className="bioskop-film-img-col">
                  <div className="bioskop-image-wrapper h-100">
                    <img
                      src={`${import.meta.env.VITE_API_URL_IMAGE}/${films.image}`} // Gunakan variabel lingkungan
                      alt={films.title} 
                      className="img-fluid" 
                    />
                  </div>
                </div>
                <div className="bioskop-film-info-col">
                  <div className="bioskop-film-info-card d-flex flex-column justify-content-center">
                    <div className="d-flex flex-wrap gap-2"> 
                    {[films.genre1, films.genre2, films.genre3].filter(Boolean).map((genre, index) => (
                      <span key={index} className="bioskop-film-genre">{genre}</span>
                    ))}
                    </div>
                    <h3 className="bioskop-film-title">{films.title}</h3>
                    <p className="bioskop-film-desc">{truncateText(films.deskripsi, 100)}</p>
                    <Link to={`/films/detail/${films.id}`} className="bioskop-film-link">
                      Lihat <span className="bioskop-arrow">›</span>
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
    </>
  );
};

export default FilmsBioskopComponent;
