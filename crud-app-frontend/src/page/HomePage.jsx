import { Container, Row, Col } from "react-bootstrap";
import CarouselComponent from "../components/CarouselItemsComponentsHome/CarouselHomePage";
import MusicHitsComponents from "../components/MusicComponentsHome/MusicHitsComponents";
import PopularComponentFilm from "../components/FilmsComponentsHome/PopularComponentFilm";
import NewsTerbaruAllComponents from "../components/NewsComponentsHome/NewsTerbaruAllComponents";
const HomePage = () => {
  return (
    <div>
      <header className="w-100 min-vh-100 d-flex align-items-center justify-content-center">
        <Container>
          <div className="d-flex flex-column align-items-center">
            <h1 className="montserrat-font fw-bold">
              Selamat datang di FindFun!
            </h1>
            <p>
              Tempat dimana para cinephile dan audiophile saling bertemu secara
              online
            </p>
            <a href="#homepage" className="btn-explore mt-3">
              Mulai Berksplorasi
            </a>
          </div>
        </Container>
      </header>
      <div className="homepage w-100 min-vh-100" id="homepage">
        <div>
          <Container>
            <Row className="header-box d-flex align-items-center">
              <h1 className="text-start">
                <b>Populer di FindFun</b>
              </h1>
              <CarouselComponent  className="rounded-4"/>
            </Row>
            <Row className="box-hits">
              <Col lg={12}>
                <h1 className="judul-hits ms-4 mt-3 mb-3">
                  <b>Musik Hits hari ini</b>
                </h1>
              </Col>
              <MusicHitsComponents />
            </Row>
          </Container>
        </div>
        <div>
          <Container>
            <Row className="p-3 box-hits">
              <Col lg={12}>
                <h1 className="judul-hits ms-1 mt-3 mb-3">
                  <b>Film Terkini</b>
                </h1>
              </Col>
              <PopularComponentFilm />
            </Row>
          </Container>
        </div>
        <div>
          <Container>
            <Row className="box-hots-news p-3">
              <Col lg={12} className="mb-3">
                <h1>
                  <b>Berita hari ini</b>
                </h1>
              </Col>
              <NewsTerbaruAllComponents />
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
