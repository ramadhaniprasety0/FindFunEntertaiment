import { Container, Carousel, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';
import DetailFilmComponent from "../../components/FilmsComponentsHome/DetailFilmsComponent";

const DetailFilmPage = () => {
  const { id } = useParams();

  const [images, setImages] = useState(null);
  const [title, setTitle] = useState("");
  const [film, setFilm] = useState([]);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDetailFilm = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:3000/api/films/${id}`);
      const { data: data_actors } = await axios.get(`http://localhost:3000/api/films/${id}/artists`);
      setActors(data_actors.data);
      setFilm(data.data);
      const films = data.data;
      setImages(`http://localhost:3000/${films.image_poster}`);
      setTitle(films.title);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat mengambil data film.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetailFilm();
  }, []);

  if (loading) {
    return (
      <div className="w-100 min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="w-100 min-vh-100 detail-film-page">
      <Container>
        <div className="box-carousel-film mt-4 mb-4">
        <Carousel controls={false} indicators={false}>
            <Carousel.Item>
              <img
                className="d-block w-100 rounded-4"
                src={images}
                alt={title}
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </Carousel.Item>
          </Carousel>
        </div>
        <DetailFilmComponent film={film} actors={actors} />
      </Container>
    </div>
  );
};

export default DetailFilmPage;
