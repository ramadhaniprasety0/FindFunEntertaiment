import { Col, Container, Row } from "react-bootstrap";

function FooterComponents() {
  return (
    <footer>
      <Row className="footer p-5">
        <Col lg={3} className="findfun">
          <div className="d-flex gap-2 ">
            <img src="/findfun.svg" alt="LogoFooter" width="41" height="40" />
            <h1 className="text-white fs-2 fw-bold">FindFun</h1>
          </div>
          <p className="text-white mt-4 fw-regular">
            FindFun adalah platform hiburan daring inovatif yang dirancang untuk menawarkan pengalaman yang dipersonalisasi dan interaktif kepada pengguna. Platform ini menyediakan beragam konten hiburan, termasuk film, berita hiburan, dan video musik, permainan, serta konten kreatif yang dibuat pengguna.{" "}
          </p>
        </Col>
        <Col lg={3} className="produk d-flex flex-column align-items-center ">
          <div>
            <h1 className="text-white fs-5 fw-bold">Produk</h1>
          </div>
          <ul className="list-unstyled">
            <li className="text-white fw-regular">Musik</li>
            <li className="text-white fw-regular">Berita</li>
            <li className="text-white fw-regular">Film</li>
          </ul>
        </Col>
        <Col lg={3} className="support d-flex flex-column align-items-center">
          <h1 className="text-white fs-5 fw-bold">Support</h1>
          <ul className="list-unstyled ">
            <li className="text-white fw-regular">FAQ</li>
            <li className="text-white fw-regular">Contact Us</li>
            <li className="text-white fw-regular">Privacy Policy</li>
            <li className="text-white fw-regular">Terms & Conditions</li>
          </ul>
        </Col>
        <Col
          lg={3}
          className="icons-sosmed d-flex flex-column align-items-start"
        >
          <h1 className="text-white fs-5 fw-bold">Sosial Media</h1>
          <p className="text-white fw-regular">
            Untuk pembaruan dan berita terkini, ikuti umpan media sosial kami
          </p>
          <ul className="d-flex gap-3 list-unstyled">
            <li>
              <a href="">
                <i class="fa-brands fa-youtube fs-4"></i>
              </a>
            </li>
            <li>
              <a href="">
                <i class="fa-brands fa-instagram fs-4"></i>
              </a>
            </li>
            <li>
              <a href="">
                <i class="fa-brands fa-facebook fs-4"></i>
              </a>
            </li>
            <li>
              <a href="">
                <i class="fa-brands fa-twitter fs-4"></i>
              </a>
            </li>
            <li>
              <a href="">
                <i class="fa-solid fa-envelope fs-4"></i>
              </a>
            </li>
          </ul>
        </Col>
      </Row>
      <Row className="copyright">
        <Col
          lg={12}
          className="d-flex align-content-center justify-content-center"
        >
          <p>Copyright © FindFun.com</p>
        </Col>
      </Row>
    </footer>
  );
}

export default FooterComponents;
