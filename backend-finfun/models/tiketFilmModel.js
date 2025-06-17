const db = require('../db');

const TiketFilm = {
  // Fungsi untuk membuat data cinema location
  createCinemaLocation: (venueData, callback) => {
    const { venue_name, cinema_type, film_id } = venueData;
    const query = 'INSERT INTO cinema_locations (venue_name, cinema_type, film_id) VALUES (?, ?, ?)';
    db.query(query, [venue_name, cinema_type, film_id], callback);
  },

  // Fungsi untuk mendapatkan semua lokasi bioskop
  getAllCinemaLocations: (callback) => {
    const query = 'SELECT * FROM cinema_locations ORDER BY id DESC';
    db.query(query, callback);
  },

  // Fungsi untuk mendapatkan lokasi bioskop berdasarkan ID
  getCinemaLocationById: (id, callback) => {
    const query = 'SELECT * FROM cinema_locations WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  // Fungsi untuk mengupdate lokasi bioskop
  updateCinemaLocation: (id, venueData, callback) => {
    const { venue_name, cinema_type, film_id } = venueData;
    const query = 'UPDATE cinema_locations SET venue_name = ?, cinema_type = ?, film_id = ? WHERE id = ?';
    db.query(query, [venue_name, cinema_type, film_id, id], callback);
  },

  // Fungsi untuk menghapus lokasi bioskop
  deleteCinemaLocation: (id, callback) => {
    const query = 'DELETE FROM cinema_locations WHERE id = ?';
    db.query(query, [id], callback);
  },

  // Fungsi untuk membuat data ticket price
  createTicketPrice: (priceData, callback) => {
    const { ticket_type, price, film_id, cinema_id } = priceData;
    const query = 'INSERT INTO ticket_prices (ticket_type, price, film_id, cinema_id) VALUES (?, ?, ?, ?)';
    db.query(query, [ticket_type, price, film_id, cinema_id], callback);
  },

  // Fungsi untuk mendapatkan semua harga tiket
  getAllTicketPrices: (callback) => {
    const query = 'SELECT * FROM ticket_prices ORDER BY id DESC';
    db.query(query, callback);
  },

  // Fungsi untuk mendapatkan harga tiket berdasarkan ID
  getTicketPriceById: (id, callback) => {
    const query = 'SELECT * FROM ticket_prices WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  // Fungsi untuk mengupdate harga tiket
  updateTicketPrice: (id, priceData, callback) => {
    const { ticket_type, price, film_id, cinema_id } = priceData;
    const query = 'UPDATE ticket_prices SET ticket_type = ?, price = ?, film_id = ?, cinema_id = ? WHERE id = ?';
    db.query(query, [ticket_type, price, film_id, cinema_id, id], callback);
  },

  // Fungsi untuk menghapus harga tiket
  deleteTicketPrice: (id, callback) => {
    const query = 'DELETE FROM ticket_prices WHERE id = ?';
    db.query(query, [id], callback);
  },

  // Fungsi untuk membuat data schedule
  createSchedule: (scheduleData, callback) => {
    const { film_id, cinema_location_id, show_time, price_id } = scheduleData;
    const query = 'INSERT INTO schedules (film_id, cinema_location_id, show_time, price_id) VALUES (?, ?, ?, ?)';
    db.query(query, [film_id, cinema_location_id, show_time, price_id], callback);
  },

  // Fungsi untuk membuat tiket film (transaksi)
  createTiketFilm: (data, callback) => {
    const { film_id, venue_name, cinema_type, ticket_type, price, show_time } = data;
    
    // Mulai transaksi dengan callback pattern
    db.beginTransaction((err) => {
      if (err) {
        return callback(err);
      }

      // 1. Buat cinema location baru
      const cinemaLocationQuery = 'INSERT INTO cinema_locations (venue_name, cinema_type, film_id) VALUES (?, ?, ?)';
      db.query(cinemaLocationQuery, [venue_name, cinema_type, film_id], (err, cinemaLocationResult) => {
        if (err) {
          return db.rollback(() => {
            callback(err);
          });
        }

        const cinema_location_id = cinemaLocationResult.insertId;

        // 2. Buat ticket price baru
        const ticketPriceQuery = 'INSERT INTO ticket_prices (ticket_type, price, film_id, cinema_id) VALUES (?, ?, ?, ?)';
        db.query(ticketPriceQuery, [ticket_type, price, film_id, cinema_location_id], (err, ticketPriceResult) => {
          if (err) {
            return db.rollback(() => {
              callback(err);
            });
          }

          const price_id = ticketPriceResult.insertId;

          // 3. Buat schedule baru
          const scheduleQuery = 'INSERT INTO schedules (film_id, cinema_location_id, show_time, price_id) VALUES (?, ?, ?, ?)';
          db.query(scheduleQuery, [film_id, cinema_location_id, show_time, price_id], (err, scheduleResult) => {
            if (err) {
              return db.rollback(() => {
                callback(err);
              });
            }

            // Commit transaksi jika semua operasi berhasil
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  callback(err);
                });
              }
              
              callback(null, {
                cinema_location_id,
                price_id,
                schedule_id: scheduleResult.insertId
              });
            });
          });
        });
      });
    });
  }
};

module.exports = TiketFilm;