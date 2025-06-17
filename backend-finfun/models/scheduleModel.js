const db = require("../db");

const Schedule = {
  getAll: (callback) => {
    db.query("SELECT * FROM schedules ORDER BY created_at DESC", callback);
  },

  getAllComplete: (callback) => {
    const query = `
    SELECT 
      s.id, s.film_id, s.cinema_location_id, s.show_time, s.price_id, s.created_at, s.updated_at,
      f.title as film_title,
      cl.venue_name, cl.cinema_type,
      tp.ticket_type, tp.price
    FROM schedules s
    JOIN films f ON s.film_id = f.id
    JOIN cinema_locations cl ON s.cinema_location_id = cl.id
    JOIN ticket_prices tp ON s.price_id = tp.id
    ORDER BY s.created_at DESC
    `;
    db.query(query, callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM schedules WHERE id = ?", [id], callback);
  },

  getByIdComplete: (id, callback) => {
    const query = `
    SELECT 
      s.id, s.film_id, s.cinema_location_id, s.show_time, s.price_id, s.created_at, s.updated_at,
      f.title as film_title,
      cl.venue_name, cl.cinema_type,
      tp.ticket_type, tp.price
    FROM schedules s
    JOIN films f ON s.film_id = f.id
    JOIN cinema_locations cl ON s.cinema_location_id = cl.id
    JOIN ticket_prices tp ON s.price_id = tp.id
    WHERE s.id = ?
    `;
    db.query(query, [id], callback);
  },

  getByFilmId: (filmId, callback) => {
    const query = `
    SELECT 
      s.id, s.film_id, s.cinema_location_id, s.show_time, s.price_id, s.created_at, s.updated_at,
      f.title as film_title,
      cl.venue_name, cl.cinema_type,
      tp.ticket_type, tp.price
    FROM schedules s
    JOIN films f ON s.film_id = f.id
    JOIN cinema_locations cl ON s.cinema_location_id = cl.id
    JOIN ticket_prices tp ON s.price_id = tp.id
    WHERE s.film_id = ?
    ORDER BY s.show_time ASC
    `;
    db.query(query, [filmId], callback);
  },

  create: (scheduleData, callback) => {
    db.query("INSERT INTO schedules SET ?", scheduleData, callback);
  },

  update: (id, scheduleData, callback) => {
    db.query("UPDATE schedules SET ? WHERE id = ?", [scheduleData, id], callback);
  },

  delete: (id, callback) => {
    db.query("DELETE FROM schedules WHERE id = ?", [id], callback);
  },
};

module.exports = Schedule;