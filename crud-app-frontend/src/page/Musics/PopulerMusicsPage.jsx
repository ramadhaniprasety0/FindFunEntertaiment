// src/pages/PopularMusicPage.js
import React, { useState } from 'react';
import { Container, Row, Button, Dropdown } from 'react-bootstrap';
import CarouselComponentMusic from "../../components/CarouselItemsComponentsHome/CarouselHomePage";
import PopularComponentMusic from "../../components/MusicComponentsHome/PopularComponentMusic";
import 'bootstrap-icons/font/bootstrap-icons.css';

const PopularMusicPage = () => {
  // State HANYA untuk mengontrol UI filter
  const [activeFilter, setActiveFilter] = useState('Lihat Semua');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [ratingSortDirection, setRatingSortDirection] = useState('desc');
  
  // State untuk menampung daftar genre dari komponen anak (via callback)
  const [genres, setGenres] = useState([]);

  // Handler untuk tombol Rating
  const handleRatingClick = () => {
    if (activeFilter === 'Rating') {
      setRatingSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setActiveFilter('Rating');
      setRatingSortDirection('desc');
    }
  };

  // Handler untuk Dropdown Genre
  const handleGenreSelect = (genre) => {
    setActiveFilter('Genre');
    setSelectedGenre(genre);
  };

  // Handler untuk "Lihat Semua"
  const handleShowAllClick = () => {
    setActiveFilter('Lihat Semua');
    setSelectedGenre('');
  };

  return (
    <div className="popular-musics-page">
      <Container className="mt-4">
        <Row className="mb-4 box-carousel-musics">
          <CarouselComponentMusic />
        </Row>

        <Row className="mb-3">
          <h1 className="fw-bold text-primary text-center">Musik Populer di FindFun</h1>
        </Row>

        {/* Filter */}
        <Row className="mb-4">
          <div className="filter-buttons d-flex justify-content-start align-items-center gap-2 flex-wrap">
            <button
              className={`btn rounded-pill px-4 ${activeFilter === 'Lihat Semua' ? 'btn-dark active' : 'btn-outline-dark'}`}
              onClick={handleShowAllClick}
            >
              Lihat Semua
            </button>
            <button
              className={`btn rounded-pill px-4 ${activeFilter === 'Terbaru' ? 'btn-dark active' : 'btn-outline-dark'}`}
              onClick={() => setActiveFilter('Terbaru')}
            >
              Terbaru
            </button>
            <button
              className={`btn rounded-pill px-4 d-flex align-items-center ${activeFilter === 'Rating' ? 'btn-dark active' : 'btn-outline-dark'}`}
              onClick={handleRatingClick}
            >
              Rating
              {activeFilter === 'Rating' && (
                <i className={`bi bi-arrow-${ratingSortDirection === 'desc' ? 'down' : 'up'} ms-2`}></i>
              )}
            </button>
            <Dropdown onSelect={handleGenreSelect}>
              <Dropdown.Toggle 
                variant={activeFilter === 'Genre' ? 'dark' : 'outline-dark'} 
                id="dropdown-genre"
                className="rounded-pill px-4"
              >
                {activeFilter === 'Genre' && selectedGenre ? `Genre: ${selectedGenre}` : 'Genre'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {/* Daftar genre sekarang diisi dari state yang didapat dari callback */}
                {genres.length > 0 ? genres.map(genre => (
                  <Dropdown.Item key={genre} eventKey={genre}>{genre}</Dropdown.Item>
                )) : <Dropdown.Item disabled>Memuat genre...</Dropdown.Item>}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Row>

        {/* Musik Populer */}
        <div className="box-populer-musics p-3 rounded-4" style={{backgroundColor: '#E0D8FF'}}>
            {/* Mengirim state filter sebagai props ke komponen anak */}
            {/* Menambahkan prop callback onGenresLoaded */}
            <PopularComponentMusic 
                activeFilter={activeFilter}
                selectedGenre={selectedGenre}
                ratingSortDirection={ratingSortDirection}
                onGenresLoaded={setGenres} // Kirim fungsi setGenres sebagai callback
            />
        </div>
      </Container>
    </div>
  );
};

export default PopularMusicPage;