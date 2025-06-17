const db = require('../db');

const Album = {
  getAll: (callback) => {
    db.query('SELECT * FROM albums', callback);
  },
  getById: (id, callback) => {
    db.query('SELECT * FROM albums WHERE id = ?', [id], callback);
  },
  create: (album, callback) => {
    const { title, release_year, deskripsi, artist_id, genre, image } = album;
    
    const query = 'INSERT INTO albums (title, release_year, deskripsi, artist_id, genre, image) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [title, release_year, deskripsi, artist_id, genre, image], callback);
  },
  update: (id, album, callback) => {
    db.query('UPDATE albums SET ? WHERE id = ?', [album, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM albums WHERE id = ?', [id], callback);
  }
};

module.exports = Album;
