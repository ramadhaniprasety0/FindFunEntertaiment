const db = require("../db");

const Film = {
  getAll: (callback) => {
    db.query("SELECT * FROM films ORDER BY created_at DESC", callback);
  },

  getAllComplete: (callback) => {
    const query = `
    SELECT 
    m.*,
    GROUP_CONCAT(DISTINCT a.name ORDER BY a.name SEPARATOR ', ') AS artists
    FROM films m
    LEFT JOIN film_artists ma ON m.id = ma.film_id
    LEFT JOIN artists a ON ma.artist_id = a.id
    GROUP BY m.id
    ORDER BY m.created_at DESC
    `;
    db.query(query, callback);
  },

  getAllSeat: (id, callback) => {
    const query = "SELECT seat_id FROM reserved_seats WHERE schedule_id = ?";
    db.query(query, [id], callback);
  },

  getHargaTicket: (id, callback) => {
    const query =
      "SELECT p.id, p.ticket_type, p.price, p.cinema_id, l.venue_name, l.cinema_type, l.film_id FROM ticket_prices p JOIN cinema_locations l ON p.cinema_id = l.id WHERE l.film_id = ?";
    db.query(query, [id], callback);
  },

  getschedule1: (id, callback) => {
    const query =
      "SELECT s.id AS schedule_id, s.show_time, p.price, l.venue_name, l.cinema_type, l.film_id FROM schedules s JOIN cinema_locations l ON s.cinema_location_id = l.id JOIN ticket_prices p ON l.id = p.cinema_id WHERE l.film_id = ?";
    db.query(query, [id], callback);
  },

  getschedule: (id, locationId, callback) => {
    // Query untuk mengambil jadwal film berdasarkan film_id dan location_id
    const query = `
    SELECT 
        s.id AS schedule_id, 
        s.show_time, 
        p.price, 
        l.venue_name, 
        l.cinema_type, 
        s.film_id,
        s.cinema_location_id 
    FROM 
        schedules s
    JOIN 
        cinema_locations l ON s.cinema_location_id = l.id
    JOIN 
        ticket_prices p ON l.id = p.cinema_id
    WHERE 
        s.film_id = ? AND l.id = ?;
    `;
    db.query(query, [id, locationId], callback); // Menyaring hasil berdasarkan id film dan id lokasi
  },

  getSchedules: (id, locationId, callback) => {
    const query =
      "SELECT * FROM schedules WHERE film_id = ? AND cinema_location_id = ?";
    db.query(query, [id, locationId], callback);
  },

  getCinemaLocation: (id, callback) => {
    const query = "SELECT * FROM cinema_locations WHERE film_id = ?";
    db.query(query, [id], callback);
  },

  getAllBioskop: (id, callback) => {
    db.query(
      "SELECT * FROM films WHERE status_film = ? ORDER BY created_at DESC",
      [id],
      callback
    );
  },

  getAllTiket: (id, callback) => {
    const query =
      "SELECT f.*,  cl.* FROM films f JOIN cinema_locations cl ON f.id = cl.film_id WHERE f.id = ?";
    db.query(query, [id], callback);
  },

  getAllTikets: (callback) => {
    const query = `SELECT 
    f.id AS film_id, 
    f.title, 
    f.image, 
    f.director, 
    cl.venue_name, 
    cl.cinema_type,
    sc.cinema_location_id,
    sc.price_id,
    GROUP_CONCAT(sc.show_time ORDER BY sc.show_time) AS show_times, 
    p.ticket_type, 
    p.price  
    FROM schedules sc 
    JOIN cinema_locations cl ON sc.cinema_location_id = cl.id 
    JOIN films f ON sc.film_id = f.id 
    JOIN ticket_prices p ON sc.price_id = p.id
    GROUP BY 
    f.id, 
    f.title,
    f.image,
    f.director,
    cl.venue_name, 
    cl.cinema_type,
    sc.cinema_location_id,
    sc.price_id,
    p.ticket_type, 
    p.price
    `;
    db.query(query, callback);
  },

  updateShowtime: (id, schedule_id, showtime, callback) => {
    const query = "UPDATE schedules SET show_time = ? WHERE id = ? AND film_id = ?";
    db.query(query, [showtime, schedule_id, id], callback);
  },

  getPaymentUser: (callback) => {
    const query = `SELECT
    t.id, 
    t.payment_id AS "NoVA", 
    t.nama AS "Nama", 
    t.email AS "Email", 
    f.title AS "Film", 
    s.show_time AS "Jam",
	 l.venue_name AS "Bioskop", 
    t.seats AS "Kursi", 
    t.total_price AS "Harga", 
    t.image AS "Bukti",
    t.status AS "Status"
    FROM 
        tickets t
    JOIN 
        films f ON t.film_id = f.id
    JOIN 
        schedules s ON t.schedule_id = s.id
    JOIN 
        cinema_locations l ON s.cinema_location_id = l.id
    ORDER BY 
    t.updated_at DESC LIMIT 50
    `;
    db.query(query, callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM films WHERE id = ?", [id], callback);
  },

  addFilmToArtist: (filmId, artistId, pemeran, callback) => {
    const checkQuery =
      "SELECT * FROM film_artists WHERE film_id = ? AND artist_id = ?";
    db.query(checkQuery, [filmId, artistId, pemeran], (err, result) => {
      if (err) return callback(err);
      if (result.length > 0) {
        return callback(null);
      }
      const query =
        "INSERT INTO film_artists (film_id, artist_id, pemeran) VALUES (?, ?, ?)";
      db.query(query, [filmId, artistId, pemeran], callback);
    });
  },

  getArtistsForFilm: (filmId, callback) => {
    const query = `
      SELECT a.*, fa.film_id, fa.pemeran 
      FROM artists a 
      JOIN film_artists fa ON a.id = fa.artist_id 
      WHERE fa.film_id = ? 
      ORDER BY a.popularity DESC
    `;
    db.query(query, [filmId], callback);
  },

  removeFilmToArtistAll: (filmId, callback) => {
    const query = "DELETE FROM film_artists WHERE film_id = ?";
    db.query(query, [filmId], callback);
  },

  reserveSeat: (schedule_id, seat_id, user_id, callback) => {
    const query = `
      INSERT INTO reserved_seats (schedule_id, seat_id, user_id, reserved_at)
      VALUES (?, ?, ?, NOW())
    `;
    const values = [schedule_id, seat_id, user_id];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error during seat reservation:", err); // Log error di server
        callback(err, null); // Mengirimkan error ke callback
      } else {
        callback(null, result); // Jika berhasil, kirimkan result
      }
    });
  },

  // Buy ticket (membeli tiket setelah kursi dipesan)
  buyTicket: (
    user_id,
    nama,
    email,
    schedule_id,
    seat_ids,
    film_id,
    total_price,
    callback
  ) => {
    const query = `
      INSERT INTO tickets (user_id, nama, email, schedule_id, seats, film_id, total_price, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const values = [
      user_id,
      nama,
      email,
      schedule_id,
      JSON.stringify(seat_ids),
      film_id,
      total_price,
    ];

    db.query(query, values, callback);
  },

  updatePayTiket: (id, payment, callback) => {
    const {
      user_id,
      nama,
      email,
      schedule_id,
      seat_id,
      film_id,
      total_price,
      payment_id,
      image,
    } = payment;
    console.log(payment);

    const query = `
      UPDATE tickets 
      SET user_id = ?, nama = ?, email = ?, schedule_id = ?, seats = ?, film_id = ?, total_price = ?, payment_id = ?, image = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    db.query(
      query,
      [
        user_id,
        nama,
        email,
        schedule_id,
        JSON.stringify(seat_id),
        film_id,
        total_price,
        payment_id,
        image,
        id,
      ],
      callback
    );
  },

  updatePaymentStatus: (id, status, callback) => {
    const query = `
      UPDATE tickets 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;

    db.query(query, [status, id], callback);
  },

  getTikets: (id, schedule_id, callback) => {
    const query = `SELECT 
    tickets.*, 
    films.title AS film_title, 
    films.image, 
    schedules.show_time, 
    cinema_locations.venue_name AS cinema,
    JSON_LENGTH(tickets.seats) AS seat_count, 
    GROUP_CONCAT(reserved_seats.seat_id ORDER BY reserved_seats.seat_id) AS seat_ids
    FROM tickets 
    JOIN films ON tickets.film_id = films.id 
    JOIN reserved_seats ON JSON_CONTAINS(tickets.seats, CAST(reserved_seats.id AS JSON))
    JOIN schedules ON tickets.schedule_id = schedules.id 
    JOIN cinema_locations ON schedules.cinema_location_id = cinema_locations.id
    WHERE tickets.id = ? AND tickets.schedule_id = ? 
    GROUP BY tickets.id, films.title, films.image, schedules.show_time, cinema_locations.venue_name`;
    db.query(query, [id, schedule_id], callback);
  },

  createSchedule: (schedule, callback) => {
    const {
      film_id,
      cinema_location_id,
      show_time,
      price_id,
    } = schedule;
    if (!show_time || !price_id || !cinema_location_id || !film_id) {
      return res.status(400).json({ error: 'Invalid schedule data format' });
    }
    const query = `INSERT INTO schedules (film_id, cinema_location_id, show_time, price_id) VALUES (?, ?, ?, ?)`;
    db.query(query, [film_id, cinema_location_id, show_time, price_id], callback);
  },

  deleteSchedule: (schedule_id, callback) => {
    const query = `DELETE FROM schedules WHERE id = ?`;
    db.query(query, [schedule_id], callback);
  },

  create: (film, callback) => {
    const {
      title,
      deskripsi,
      release_year,
      rating,
      genre1,
      genre2,
      genre3,
      duration,
      image,
      posterImage,
      director,
      status_film,
      netflix_link,
      appletv_link,
      hbogo_link,
      bioskop_link,
      like_user,
      dislike,
    } = film;

    const query = `INSERT INTO films (
      title, deskripsi, release_year, rating, genre1, genre2, genre3, duration, image, image_poster, 
      director, status_film, netflix_link, appletv_link, 
      hbogo_link, bioskop_link, like_user, dislike
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      query,
      [
        title,
        deskripsi,
        release_year,
        rating,
        genre1,
        genre2,
        genre3,
        duration,
        image,
        posterImage,
        director,
        status_film,
        netflix_link,
        appletv_link,
        hbogo_link,
        bioskop_link,
        like_user || 0,
        dislike || 0,
      ],
      callback
    );
  },

  update: (id, film, callback) => {
    const {
      title,
      deskripsi,
      release_year,
      rating,
      genre1,
      genre2,
      genre3,
      duration,
      image,
      posterImage,
      director,
      status_film,
      netflix_link,
      appletv_link,
      hbogo_link,
      bioskop_link,
      like_user = 0,
      dislike = 0,
    } = film;

    console.log("Received film data:", film);

    const query = `UPDATE films SET 
      title=?, deskripsi=?, release_year=?, rating=?, genre1=?, genre2=?, genre3=?, duration=?, image=?, image_poster=?, 
      director=?, status_film=?, netflix_link=?, appletv_link=?, 
      hbogo_link=?, bioskop_link=?, like_user=?, dislike=?, updated_at=CURRENT_TIMESTAMP 
      WHERE id=?`;

    db.query(
      query,
      [
        title,
        deskripsi,
        release_year,
        rating,
        genre1,
        genre2,
        genre3,
        duration,
        image,
        posterImage,
        director,
        status_film,
        netflix_link,
        appletv_link,
        hbogo_link,
        bioskop_link,
        like_user,
        dislike,
        id,
      ],
      callback
    );
  },

  delete: (id, callback) => {
    db.query("DELETE FROM films WHERE id = ?", [id], callback);
  },

  // Search films by title or genre
  search: (searchTerm, callback) => {
    const query =
      "SELECT * FROM films WHERE title LIKE ? OR genre LIKE ? ORDER BY created_at DESC";
    const searchPattern = `%${searchTerm}%`;
    db.query(query, [searchPattern, searchPattern], callback);
  },

  // Get films by genre
  getByGenre: (genre, callback) => {
    db.query(
      "SELECT * FROM films WHERE genre = ? ORDER BY created_at DESC",
      [genre],
      callback
    );
  },
};

module.exports = Film;
