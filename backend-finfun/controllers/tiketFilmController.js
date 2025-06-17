const db = require('../db');
const Film = require('../models/filmModel');
const TiketFilm = require('../models/tiketFilmModel');

const tiketFilmController = {
  // Controller untuk menangani pembuatan data di tiga tabel sekaligus
  createTiketFilm: (req, res) => {
    // Ambil data dari request body
    const {
      film_id,
      venue_name,
      cinema_type,
      ticket_type,
      price,
      show_time
    } = req.body;

    // Validasi input
    if (!film_id || !venue_name || !cinema_type || !ticket_type || !price || !show_time) {
      return res.status(400).json({ 
        success: false, 
        message: 'Semua field harus diisi' 
      });
    }

    // Gunakan model untuk membuat tiket film dengan transaksi
    TiketFilm.createTiketFilm({
      film_id,
      venue_name,
      cinema_type,
      ticket_type,
      price,
      show_time
    }, (err, result) => {
      if (err) {
        console.error('Error membuat tiket film:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Terjadi kesalahan pada server', 
          error: err.message 
        });
      }

      res.status(201).json({ 
        success: true, 
        message: 'Tiket film berhasil dibuat',
        data: result
      });
    });
  }
};

module.exports = tiketFilmController;