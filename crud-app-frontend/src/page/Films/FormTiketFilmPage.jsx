import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import FormPembayaranTiketFilm from '../../components/FilmsComponentsHome/FormPembayaranFilmComponent';

const FormBayarPage = () => {
  const { id } = useParams();

  const [film, setFilm] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDetailFilm = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:3000/api/films/${id}/tiket`);
      setFilm(data.data);
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
    return <Container className="text-center my-5"><p>Memuat informasi film...</p></Container>;
  }

  return (
    <div className="halaman-pembayaran">
      <Container className="my-4">
        <FormPembayaranTiketFilm film={film} />
      </Container>
    </div>
  );
};

export default FormBayarPage;
