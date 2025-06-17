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
  const handleImageError = (e) => {
    // Mencegah loop error jika gambar fallback juga gagal
    e.target.onerror = null;
    // Ganti dengan gambar placeholder
    e.target.src = `${import.meta.env.VITE_API_URL_IMAGE}/uploads/system/no-pictures.png`;
  };

  const paymentLink = konserDetail.id ? `/music/konser/detail/${konserDetail.id}/form` : '#';
  
  const defaultMapsUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63440.77370058938!2d106.77659787650023!3d-6.387761612531104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69e95620a297d3%3A0x1cfd4042316fb217!2sKota%20Depok%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1750186598629!5m2!1sid!2sid";
  
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
              onError={(e) => handleImageError(e)}
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
          <div className="map-container" style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <iframe 
              src={konserDetail.maps_embed_url || defaultMapsUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
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
              onError={(e) => handleImageError(e)}
            />
            <span className="artist-label mt-2">Artis</span>
            <span className="artist-name">{konserDetail.artistInfo?.name}</span>
          </div>
        </section>

        <section className="detail-section photos-section">
          <h3 className="section-heading">
            <b>Foto Langsung</b>
          </h3>
          <div className="live-photos-container d-flex flex-wrap">
            {konserDetail.livePhotos && konserDetail.livePhotos.map((photo, index) => (
              <div key={index} className="live-photo-item me-3 mb-3">
                <Image
                  src={photo}
                  alt={`Live photo ${index + 1}`}
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  onError={(e) => handleImageError(e)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
};

export default DetailKonserComponent;