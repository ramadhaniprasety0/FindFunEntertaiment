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
  },

  // Controller untuk mendapatkan semua lokasi bioskop
  getAllCinemaLocations: (req, res) => {
    TiketFilm.getAllCinemaLocations((err, results) => {
      if (err) {
        console.error('Error mendapatkan lokasi bioskop:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Terjadi kesalahan pada server', 
          error: err.message 
        });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Berhasil mendapatkan data lokasi bioskop',
        data: results
      });
    });
  },

  // Controller untuk mendapatkan lokasi bioskop berdasarkan ID
  getCinemaLocationById: (req, res) => {
    const id = req.params.id;
    TiketFilm.getCinemaLocationById(id, (err, result) => {
      if (err) {
        console.error('Error mendapatkan lokasi bioskop:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Terjadi kesalahan pada server', 
          error: err.message 
        });
      }

      if (!result) {
        return res.status(404).json({ 
          success: false, 
          message: 'Lokasi bioskop tidak ditemukan' 
        });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Berhasil mendapatkan data lokasi bioskop',
        data: result
      });
    });
  },

  // Controller untuk membuat lokasi bioskop baru
  createCinemaLocation: (req, res) => {
    const { film_id, venue_name, cinema_type } = req.body;

    // Validasi input
    if (!film_id || !venue_name || !cinema_type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Semua field harus diisi' 
      });
    }

    TiketFilm.createCinemaLocation({ film_id, venue_name, cinema_type }, (err, result) => {
      if (err) {
        console.error('Error membuat lokasi bioskop:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Terjadi kesalahan pada server', 
          error: err.message 
        });
      }

      res.status(201).json({ 
        success: true, 
        message: 'Lokasi bioskop berhasil dibuat',
        data: { id: result.insertId, film_id, venue_name, cinema_type }
      });
    });
  },

  // Controller untuk mengupdate lokasi bioskop
  updateCinemaLocation: (req, res) => {
    const id = req.params.id;
    const { film_id, venue_name, cinema_type } = req.body;

    // Validasi input
    if (!film_id || !venue_name || !cinema_type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Semua field harus diisi' 
      });
    }

    TiketFilm.updateCinemaLocation(id, { film_id, venue_name, cinema_type }, (err, result) => {
      if (err) {
        console.error('Error mengupdate lokasi bioskop:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Terjadi kesalahan pada server', 
          error: err.message 
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Lokasi bioskop tidak ditemukan' 
        });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Lokasi bioskop berhasil diupdate',
        data: { id, film_id, venue_name, cinema_type }
      });
    });
  },

  // Controller untuk menghapus lokasi bioskop
  deleteCinemaLocation: (req, res) => {
    const id = req.params.id;

    TiketFilm.deleteCinemaLocation(id, (err, result) => {
      if (err) {
        console.error('Error menghapus lokasi bioskop:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Terjadi kesalahan pada server', 
          error: err.message 
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Lokasi bioskop tidak ditemukan' 
        });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Lokasi bioskop berhasil dihapus'
      });
    });
  },

  // Controller untuk mendapatkan semua harga tiket
  getAllTicketPrices: (req, res) => {
    TiketFilm.getAllTicketPrices((err, results) => {
      if (err) {
        console.error('Error mendapatkan harga tiket:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Terjadi kesalahan pada server', 
          error: err.message 
        });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Berhasil mendapatkan data harga tiket',
        data: results
      });
    });
  },

  // Controller untuk mendapatkan harga tiket berdasarkan ID
  getTicketPriceById: (req, res) => {
    const id = req.params.id;
    TiketFilm.getTicketPriceById(id, (err, result) => {
      if (err) {
        console.error('Error mendapatkan harga tiket:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Terjadi kesalahan pada server', 
          error: err.message 
        });
      }

      if (!result) {
        return res.status(404).json({ 
          success: false, 
          message: 'Harga tiket tidak ditemukan' 
        });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Berhasil mendapatkan data harga tiket',
        data: result
      });
    });
  },

  // Controller untuk membuat harga tiket baru
  createTicketPrice: (req, res) => {
    const { film_id, cinema_id, ticket_type, price } = req.body;

    // Validasi input
    if (!film_id || !cinema_id || !ticket_type || !price) {
      return res.status(400).json({ 
        success: false, 
        message: 'Semua field harus diisi' 
      });
    }

    TiketFilm.createTicketPrice({ film_id, cinema_id, ticket_type, price }, (err, result) => {
      if (err) {
        console.error('Error membuat harga tiket:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Terjadi kesalahan pada server', 
          error: err.message 
        });
      }

      res.status(201).json({ 
        success: true, 
        message: 'Harga tiket berhasil dibuat',
        data: { id: result.insertId, film_id, cinema_id, ticket_type, price }
      });
    });
  },

  // Controller untuk mengupdate harga tiket
  updateTicketPrice: (req, res) => {
    const id = req.params.id;
    const { film_id, cinema_id, ticket_type, price } = req.body;

    // Validasi input
    if (!film_id || !cinema_id || !ticket_type || !price) {
      return res.status(400).json({ 
        success: false, 
        message: 'Semua field harus diisi' 
      });
    }

    TiketFilm.updateTicketPrice(id, { film_id, cinema_id, ticket_type, price }, (err, result) => {
      if (err) {
        console.error('Error mengupdate harga tiket:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Terjadi kesalahan pada server', 
          error: err.message 
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Harga tiket tidak ditemukan' 
        });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Harga tiket berhasil diupdate',
        data: { id, film_id, cinema_id, ticket_type, price }
      });
    });
  },

  // Controller untuk menghapus harga tiket
  deleteTicketPrice: (req, res) => {
    const id = req.params.id;

    TiketFilm.deleteTicketPrice(id, (err, result) => {
      if (err) {
        console.error('Error menghapus harga tiket:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Terjadi kesalahan pada server', 
          error: err.message 
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Harga tiket tidak ditemukan' 
        });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Harga tiket berhasil dihapus'
      });
    });
  }
};

module.exports = tiketFilmController;