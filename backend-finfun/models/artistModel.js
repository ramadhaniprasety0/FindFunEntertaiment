const db = require('../db');

const Artist = {
  getAll: (callback) => {
    db.query('SELECT * FROM artists ORDER BY popularity DESC, created_at DESC', callback);
  },
  
  getById: (id, callback) => {
    db.query('SELECT * FROM artists WHERE id = ?', [id], callback);
  },
  
  create: (artist, callback) => {
    const { 
      name, bio, birth_date, country, genre, image, 
      active_year_start, active_year_end, instagram, twitter, 
      youtube, website, popularity 
    } = artist;
    
    const query = `INSERT INTO artists (
      name, bio, birth_date, country, genre, image, 
      active_year_start, active_year_end, instagram, twitter, 
      youtube, website, popularity
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [
      name, bio, birth_date, country, genre, image,
      active_year_start, active_year_end, instagram, twitter,
      youtube, website, popularity || 0
    ], callback);
  },
  
  update: (id, artist, callback) => {
    const { 
      name, bio, birth_date, country, genre, image, 
      active_year_start, active_year_end, instagram, twitter, 
      youtube, website, popularity 
    } = artist;
    
    const query = `UPDATE artists SET 
      name=?, bio=?, birth_date=?, country=?, genre=?, image=?, 
      active_year_start=?, active_year_end=?, instagram=?, twitter=?, 
      youtube=?, website=?, popularity=?, updated_at=CURRENT_TIMESTAMP 
      WHERE id=?`;
    
    db.query(query, [
      name, bio, birth_date, country, genre, image,
      active_year_start, active_year_end, instagram, twitter,
      youtube, website, popularity, id
    ], callback);
  },
  
  delete: (id, callback) => {
    db.query('DELETE FROM artists WHERE id = ?', [id], callback);
  },

  // Search artists by name or genre
  search: (searchTerm, callback) => {
    const query = 'SELECT * FROM artists WHERE name LIKE ? OR genre LIKE ? ORDER BY popularity DESC';
    const searchPattern = `%${searchTerm}%`;
    db.query(query, [searchPattern, searchPattern], callback);
  },

  // Get artists by genre
  getByGenre: (genre, callback) => {
    db.query('SELECT * FROM artists WHERE genre = ? ORDER BY popularity DESC', [genre], callback);
  },

  // Get artists by country
  getByCountry: (country, callback) => {
    db.query('SELECT * FROM artists WHERE country = ? ORDER BY popularity DESC', [country], callback);
  },

  // Get artist's music
  getArtistMusic: (artistId, callback) => {
    const query = `
      SELECT m.*, ma.artist_id 
      FROM music m 
      JOIN music_artists ma ON m.id = ma.music_id 
      WHERE ma.artist_id = ? 
      ORDER BY m.created_at DESC
    `;
    db.query(query, [artistId], callback);
  }
};

module.exports = Artist;