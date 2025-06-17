import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import CarouselComponentMusic from "../../components/CarouselItemsComponentsHome/CarouselHomePage";
import KonserComponentMusic from "../../components/MusicComponentsHome/KonserMendatangComponent";
import 'bootstrap-icons/font/bootstrap-icons.css';


const KonserMusicsPage = () => {

  const [activeFilter, setActiveFilter] = useState('semua'); 
  const [priceSort, setPriceSort] = useState(null); 


  const handleShowAll = () => {
    setActiveFilter('semua');
    setPriceSort(null);
  };

  const handleAvailableOnly = () => {
    setActiveFilter('tersedia');
    setPriceSort(null);
  };

  const handlePriceSort = () => {
    setPriceSort(prev => {
      if (prev === 'desc') return 'asc';
      if (prev === 'asc') return null;
      return 'desc';
    });
    setActiveFilter('semua'); 
  };

  return (
    <div className="konser-musics-page">
      <Container className="mt-4">
        <Row className="mb-4 box-carousel-musics">
          <CarouselComponentMusic />
        </Row>

        <Row className="mb-3">
          <h1 className="fw-bold text-center" style={{color:'#2F3881'}}>Konser Mendatang</h1>
        </Row>

        {/* Filter & Sortir UI */}
        <Row className="mb-4">
          <div className="filter-buttons d-flex justify-content-start align-items-center gap-2 flex-wrap">
            <button
              className={`btn rounded-pill px-4 ${activeFilter === 'semua' && priceSort === null ? 'btn-dark active' : 'btn-outline-dark'}`}
              onClick={handleShowAll}
            >
              Lihat Semua
            </button>
            <button
              className={`btn rounded-pill px-4 ${activeFilter === 'tersedia' ? 'btn-dark active' : 'btn-outline-dark'}`}
              onClick={handleAvailableOnly}
            >
              Tiket Tersedia
            </button>
            <button
              className={`btn rounded-pill px-4 d-flex align-items-center ${priceSort !== null ? 'btn-dark active' : 'btn-outline-dark'}`}
              onClick={handlePriceSort}
            >
              Harga
              {priceSort && (
                <i className={`bi bi-arrow-${priceSort === 'desc' ? 'down' : 'up'} ms-2`}></i>
              )}
            </button>
          </div>
        </Row>

        <div className="box-konser-musics p-3 rounded-4" style={{backgroundColor: '#E0D8FF'}}>
            <KonserComponentMusic 
                filterBy={activeFilter}
                sortByPrice={priceSort}
            />
        </div>
      </Container>
    </div>
  );
};

export default KonserMusicsPage;