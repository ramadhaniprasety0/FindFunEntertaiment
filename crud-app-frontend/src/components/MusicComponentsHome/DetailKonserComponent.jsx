import React from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Breadcrumb,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const DetailKonserComponent = ({ konserDetail }) => {
  if (!konserDetail) {
    return (
      <Container className="text-center my-5 detail-konser-error">
        <p>Memuat detail konser...</p>
      </Container>
    );
  }

  // Fungsi untuk menangani gambar yang gagal dimuat
  const handleImageError = (e, placeholderText = "Gambar Error") => {
    // Mencegah loop error jika gambar fallback juga gagal
    e.target.onerror = null;
    // Ganti dengan gambar placeholder
    e.target.src = `https://via.placeholder.com/400x400/f0f0f0/cccccc?text=${placeholderText.replace(/\s/g, '+')}`;
  };

  const paymentLink = konserDetail.id ? `/music/konser/detail/${konserDetail.id}/form` : '#';

  return (
    <Container className="detail-konser-page-wrapper my-4">
      <div className="detail-konser-content-wrapper">
        <Row className="mb-5 main-info-section align-items-start g-md-5">
          <Col md={4} lg={4} className="mb-4 mb-md-0 poster-column">
            <Image
              src={konserDetail.posterImage}
              alt={konserDetail.title}
              fluid
              className="konser-detail-poster"
              onError={(e) => handleImageError(e, 'Poster Tidak Tersedia')}
            />
          </Col>

          <Col md={5} lg={5} className="konser-main-info-text">
            <h1 className="konser-detail-title">{konserDetail.title}</h1>
            <div className="price-rating-container d-flex align-items-center my-3">
              <div className="price-info text-start">
                <span className="price-label d-block">Rentang Harga</span>
                <strong className="price-amount d-block">
                  {konserDetail.priceDisplay}
                </strong>
              </div>
            </div>
          </Col>

          <Col md={3} lg={3} className="konser-sidebar d-flex flex-column">
            <h5 className="sidebar-section-title">Tanggal Konser</h5>
              <div className="info-box date-time-box mb-4">
                <p className="info-box-main-text mb-0">{konserDetail.displayDate}</p>
              </div>
            <h5 className="sidebar-section-title">Lokasi</h5>
            <div className="info-box location-box mb-4">
              <div className="d-flex align-items-center location-content">
                <i className="bi bi-geo-alt-fill location-icon"></i>
                <div>
                  <p className="info-box-main-text location-venue-name mb-1">
                    {konserDetail.location?.venueName}
                  </p>
                  <p className="info-box-sub-text mb-0 location-address">
                    {konserDetail.location?.address}
                  </p>
                </div>
              </div>
            </div>
            <Button
              as={Link}
              to={paymentLink}
              variant="primary"
              className="btn-beli-tiket w-100 mt-auto"
            >
              Beli Tiket
            </Button>
          </Col>
        </Row>

        <section className="detail-section map-section">
          <h3 className="section-heading">
            <b>Peta</b>
          </h3>
          <div className="map-image-container">
            <Image
              src={konserDetail.mapImage || `https://via.placeholder.com/1200x350/f0f0f0/cccccc?text=Peta+Lokasi`}
              alt="Peta Lokasi Konser"
              fluid
              className="map-image"
              onError={(e) => handleImageError(e, 'Peta Gagal Dimuat')}
            />
          </div>
        </section>

        <section className="detail-section venue-section">
          <h3 className="section-heading">
            <b>Tentang Venue</b>
          </h3>
          <p className="info-text-block">{konserDetail.venueInfo}</p>
        </section>

        <section className="detail-section artist-section">
          <h3 className="section-heading">
            <b>Tentang Artis</b>
          </h3>
          <div className="artist-info-container">
            <Image
              src={konserDetail.artistInfo?.image}
              alt={konserDetail.artistInfo?.name}
              roundedCircle
              className="artist-image"
              onError={(e) => handleImageError(e, 'Foto Artis')}
            />
            <span className="artist-label mt-2">Artis</span>
            <span className="artist-name">{konserDetail.artistInfo?.name}</span>
          </div>
        </section>
      </div>
    </Container>
  );
};

export default DetailKonserComponent;