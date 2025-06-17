import { Carousel, Spinner, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import api, { api_image } from "../../api/axios"; // Ganti import axios dengan api dan api_image dari file axios.js
import Swal from "sweetalert2";

const CarouselComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await api.get("/carousel/all"); // Hapus URL hardcoded, gunakan endpoint relatif
        setData(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Gagal!",
          "Terjadi kesalahan saat mengambil data carousel.",
          "error"
        );
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Col lg={12}>
      <Carousel
        indicators={true}
        controls={false}
        interval={5000}
        className="carousel-container"
      >
        {data.map((item) => (
          <Carousel.Item key={item.id}>
            <img
              className="caraousel-img-dashboard"
              src={`${import.meta.env.VITE_API_URL_IMAGE}/${item.image}`} // Gunakan variabel lingkungan
              alt="Carousel"
              style={{ height: "433px", objectFit: "cover" }}
            />
            <Carousel.Caption
              className="d-flex flex-column align-items-start gap-1 justify-content-center"
              style={{ textAlign: "left" }}
            >
              <img
                src={`${import.meta.env.VITE_API_URL_IMAGE}/${item.titleImage}`} // Gunakan variabel lingkungan
                alt="Carousel Title"
                className="img-fluid"
              />
              <p className="text-white">{item.deskripsi}</p>
              <a href={item.path} className="btn-seemore text-center">
                Lihat
              </a>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </Col>
  );
};

export default CarouselComponent;
