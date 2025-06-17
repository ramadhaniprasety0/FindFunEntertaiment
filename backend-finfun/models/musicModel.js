const db = require('../db');

const Music = {
  getAll: (callback) => {
    db.query('SELECT * FROM music ORDER BY created_at DESC', callback);
  },
  
  getById: (id, callback) => {
    db.query('SELECT * FROM music WHERE id = ?', [id], callback);
  },
  
  // Get music with its artists and albums
  getByIdWithRelations: (id, callback) => {
    const query = `
      SELECT 
        m.*,
        GROUP_CONCAT(DISTINCT a.name) as artists,
        GROUP_CONCAT(DISTINCT al.title) as albums
      FROM music m
      LEFT JOIN music_artists ma ON m.id = ma.music_id
      LEFT JOIN artists a ON ma.artist_id = a.id
      LEFT JOIN music_albums mal ON m.id = mal.music_id
      LEFT JOIN albums al ON mal.album_id = al.id
      WHERE m.id = ?
      GROUP BY m.id
    `;
    db.query(query, [id], callback);
  },
  
  create: (music, callback) => {
    const { 
      title, lirik, release_year, rating, genre1, genre2, genre3, 
      image, like_user, dislike, spotify_link, apple_link, 
      youtube_link, deezer_link 
    } = music;
    
    const query = `INSERT INTO music (
      title, lirik, release_year, rating, genre1, genre2, genre3, 
      image, like_user, dislike, spotify_link, apple_link, 
      youtube_link, deezer_link
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [
      title, lirik, release_year, rating, genre1, genre2, genre3,
      image, like_user || 0, dislike || 0, spotify_link, apple_link,
      youtube_link, deezer_link
    ], callback);
  },
  
  update: (id, music, callback) => {
    const { 
      title, lirik, release_year, rating, genre1, genre2, genre3, 
      image, like_user, dislike, spotify_link, apple_link, 
      youtube_link, deezer_link 
    } = music;
    
    const query = `UPDATE music SET 
      title=?, lirik=?, release_year=?, rating=?, genre1=?, genre2=?, genre3=?, 
      image=?, like_user=?, dislike=?, spotify_link=?, apple_link=?, 
      youtube_link=?, deezer_link=?, updated_at=CURRENT_TIMESTAMP 
      WHERE id=?`;
    
    db.query(query, [
      title, lirik, release_year, rating, genre1, genre2, genre3,
      image, like_user, dislike, spotify_link, apple_link,
      youtube_link, deezer_link, id
    ], callback);
  },
  
  delete: (id, callback) => {
    db.query('DELETE FROM music WHERE id = ?', [id], callback);
  },

  // Search music by title or genres
  search: (searchTerm, callback) => {
    const query = `SELECT * FROM music 
      WHERE title LIKE ? OR genre1 LIKE ? OR genre2 LIKE ? OR genre3 LIKE ? 
      ORDER BY created_at DESC`;
    const searchPattern = `%${searchTerm}%`;
    db.query(query, [searchPattern, searchPattern, searchPattern, searchPattern], callback);
  },

  // Get music by genre
  getByGenre: (genre, callback) => {
    const query = `SELECT * FROM music 
      WHERE genre1 = ? OR genre2 = ? OR genre3 = ? 
      ORDER BY created_at DESC`;
    db.query(query, [genre, genre, genre], callback);
  },

  // Get music with artists
  getAllWithArtists: (callback) => {
    const query = `
      SELECT 
        m.*,
        GROUP_CONCAT(DISTINCT a.name) as artists
      FROM music m
      LEFT JOIN music_artists ma ON m.id = ma.music_id
      LEFT JOIN artists a ON ma.artist_id = a.id
      GROUP BY m.id
      ORDER BY m.created_at DESC
    `;
    db.query(query, callback);
  },

  // Get music with albums
  getAllWithAlbums: (callback) => {
    const query = `
      SELECT 
        m.*,
        GROUP_CONCAT(DISTINCT al.title) as albums
      FROM music m
      LEFT JOIN music_albums mal ON m.id = mal.music_id
      LEFT JOIN albums al ON mal.album_id = al.id
      GROUP BY m.id
      ORDER BY m.created_at DESC
    `;
    db.query(query, callback);
  },

  // Get complete music data with all relations
  getAllComplete: (callback) => {
    const query = `
      SELECT 
        m.*,
        GROUP_CONCAT(DISTINCT a.name) as artists,
        GROUP_CONCAT(DISTINCT al.title) as albums
      FROM music m
      LEFT JOIN music_artists ma ON m.id = ma.music_id
      LEFT JOIN artists a ON ma.artist_id = a.id
      LEFT JOIN music_albums mal ON m.id = mal.music_id
      LEFT JOIN albums al ON mal.album_id = al.id
      GROUP BY m.id
      ORDER BY m.created_at DESC
    `;
    db.query(query, callback);
  },
  addMusicToAlbum: (musicId, albumId, callback) => {
    const query = 'INSERT INTO music_albums (music_id, album_id) VALUES (?, ?)';
    db.query(query, [musicId, albumId], callback);
  },

  // Remove music from album
  removeMusicFromAlbum: (musicId, albumId, callback) => {
    const query = 'DELETE FROM music_albums WHERE music_id = ? AND album_id = ?';
    db.query(query, [musicId, albumId], callback);
  },

  // Get all music in an album
  getMusicInAlbum: (albumId, callback) => {
    const query = `
      SELECT m.*, ma.album_id 
      FROM music m 
      JOIN music_albums ma ON m.id = ma.music_id 
      WHERE ma.album_id = ? 
      ORDER BY m.created_at DESC
    `;
    db.query(query, [albumId], callback);
  },

  // Get all albums containing a music
  getAlbumsForMusic: (musicId, callback) => {
    const query = `
      SELECT a.*, ma.music_id 
      FROM albums a 
      JOIN music_albums ma ON a.id = ma.album_id 
      WHERE ma.music_id = ? 
      ORDER BY a.created_at DESC
    `;
    db.query(query, [musicId], callback);
  },

  // ===== MUSIC-ARTISTS RELATIONS =====
  
  // Add music to artist
  addMusicToArtist: (musicId, artistId, callback) => {
    const query = 'INSERT INTO music_artists (music_id, artist_id) VALUES (?, ?)';
    db.query(query, [musicId, artistId], callback);
  },

  // Remove music from artist
  removeMusicFromArtist: (musicId, artistId, callback) => {
    const query = 'DELETE FROM music_artists WHERE music_id = ? AND artist_id = ?';
    db.query(query, [musicId, artistId], callback);
  },

  // Get all music by an artist
  getMusicByArtist: (artistId, callback) => {
    const query = `
      SELECT m.*, ma.artist_id 
      FROM music m 
      JOIN music_artists ma ON m.id = ma.music_id 
      WHERE ma.artist_id = ? 
      ORDER BY m.created_at DESC
    `;
    db.query(query, [artistId], callback);
  },

  // Get all artists of a music
  getArtistsForMusic: (musicId, callback) => {
    const query = `
      SELECT a.*, ma.music_id 
      FROM artists a 
      JOIN music_artists ma ON a.id = ma.artist_id 
      WHERE ma.music_id = ? 
      ORDER BY a.popularity DESC
    `;
    db.query(query, [musicId], callback);
  },

  // ===== BATCH OPERATIONS =====
  
  // Set multiple artists for a music (replace existing)
  setArtistsForMusic: (musicId, artistIds, callback) => {
    // First remove existing relations
    const deleteQuery = 'DELETE FROM music_artists WHERE music_id = ?';
    db.query(deleteQuery, [musicId], (err) => {
      if (err) return callback(err);
      
      if (!artistIds || artistIds.length === 0) {
        return callback(null, { message: 'All artists removed' });
      }
      
      // Then add new relations
      const values = artistIds.map(artistId => [musicId, artistId]);
      const insertQuery = 'INSERT INTO music_artists (music_id, artist_id) VALUES ?';
      db.query(insertQuery, [values], callback);
    });
  },

  // Set multiple albums for a music (replace existing)
  setAlbumsForMusic: (musicId, albumIds, callback) => {
    // First remove existing relations
    const deleteQuery = 'DELETE FROM music_albums WHERE music_id = ?';
    db.query(deleteQuery, [musicId], (err) => {
      if (err) return callback(err);
      
      if (!albumIds || albumIds.length === 0) {
        return callback(null, { message: 'All albums removed' });
      }
      
      // Then add new relations
      const values = albumIds.map(albumId => [musicId, albumId]);
      const insertQuery = 'INSERT INTO music_albums (music_id, album_id) VALUES ?';
      db.query(insertQuery, [values], callback);
    });
  },

  // ===== VALIDATION HELPERS =====
  
  // Check if music-album relation exists
  checkMusicAlbumExists: (musicId, albumId, callback) => {
    const query = 'SELECT COUNT(*) as count FROM music_albums WHERE music_id = ? AND album_id = ?';
    db.query(query, [musicId, albumId], callback);
  },

  // Check if music-artist relation exists
  checkMusicArtistExists: (musicId, artistId, callback) => {
    const query = 'SELECT COUNT(*) as count FROM music_artists WHERE music_id = ? AND artist_id = ?';
    db.query(query, [musicId, artistId], callback);
  },

  // ===== COMPLEX QUERIES =====
  
  // Get complete music data with all relations
  getMusicComplete: (musicId, callback) => {
    const query = `
      SELECT 
        m.*,
        GROUP_CONCAT(DISTINCT CONCAT(a.id, ':', a.name) SEPARATOR '|') as artists,
        GROUP_CONCAT(DISTINCT CONCAT(al.id, ':', al.title) SEPARATOR '|') as albums
      FROM music m
      LEFT JOIN music_artists ma ON m.id = ma.music_id
      LEFT JOIN artists a ON ma.artist_id = a.id
      LEFT JOIN music_albums mal ON m.id = mal.music_id
      LEFT JOIN albums al ON mal.album_id = al.id
      WHERE m.id = ?
      GROUP BY m.id
    `;
    db.query(query, [musicId], callback);
  },

  // Get album complete data with all music
  getAlbumComplete: (albumId, callback) => {
    const query = `
      SELECT 
        a.*,
        GROUP_CONCAT(DISTINCT CONCAT(m.id, ':', m.title) SEPARATOR '|') as music_tracks
      FROM albums a
      LEFT JOIN music_albums ma ON a.id = ma.album_id
      LEFT JOIN music m ON ma.music_id = m.id
      WHERE a.id = ?
      GROUP BY a.id
    `;
    db.query(query, [albumId], callback);
  },

  addMusicToAlbum: (musicId, albumId, callback) => {
    // Check if the relation already exists
    const checkQuery = 'SELECT * FROM music_albums WHERE music_id = ? AND album_id = ?';
    db.query(checkQuery, [musicId, albumId], (err, result) => {
      if (err) return callback(err);
      if (result.length > 0) {
        // Skip inserting if the relation already exists
        return callback(null);
      }
  
      // Insert if no existing relation
      const query = 'INSERT INTO music_albums (music_id, album_id) VALUES (?, ?)';
      db.query(query, [musicId, albumId], callback);
    });
  },

  // Remove music from album
  removeMusicFromAlbum: (musicId, albumId, callback) => {
    const query = 'DELETE FROM music_albums WHERE music_id = ? AND album_id = ?';
    db.query(query, [musicId, albumId], callback);
  },

  removeMusicFromAlbumAll: (musicId, callback) => {
    const query = 'DELETE FROM music_albums WHERE music_id = ?';
    db.query(query, [musicId], callback);
  },

  // Get all music in an album
  getMusicInAlbum: (albumId, callback) => {
    const query = `
      SELECT m.*, ma.album_id 
      FROM music m 
      JOIN music_albums ma ON m.id = ma.music_id 
      WHERE ma.album_id = ? 
      ORDER BY m.created_at DESC
    `;
    db.query(query, [albumId], callback);
  },

  // Get all albums containing a music
  getAlbumsForMusic: (musicId, callback) => {
    const query = `
      SELECT a.*, ma.music_id 
      FROM albums a 
      JOIN music_albums ma ON a.id = ma.album_id 
      WHERE ma.music_id = ? 
      ORDER BY a.created_at DESC
    `;
    db.query(query, [musicId], callback);
  },

  // ===== MUSIC-ARTISTS RELATIONS =====
  
  // Add music to artist
  // addMusicToArtist: (musicId, artistId, callback) => {
  //   const query = 'INSERT INTO music_artists (music_id, artist_id) VALUES (?, ?)';
  //   db.query(query, [musicId, artistId], callback);
  // },

  addMusicToArtist: (musicId, artistId, callback) => {
    const checkQuery = 'SELECT * FROM music_artists WHERE music_id = ? AND artist_id = ?';
    db.query(checkQuery, [musicId, artistId], (err, result) => {
      if (err) return callback(err);
      if (result.length > 0) {
        return callback(null);
      }
      const query = 'INSERT INTO music_artists (music_id, artist_id) VALUES (?, ?)';
      db.query(query, [musicId, artistId], callback);
    });
  },
  
  removeMusicFromArtist: (musicId, artistId, callback) => {
    const query = 'DELETE FROM music_artists WHERE music_id = ? AND artist_id = ?';
    db.query(query, [musicId, artistId], callback);
  },

  removeMusicFromArtistAll: (musicId, callback) => {
    const query = 'DELETE FROM music_artists WHERE music_id = ?';
    db.query(query, [musicId], callback); 
  },

  // Get all music by an artist
  getMusicByArtist: (artistId, callback) => {
    const query = `
      SELECT m.*, ma.artist_id 
      FROM music m 
      JOIN music_artists ma ON m.id = ma.music_id 
      WHERE ma.artist_id = ? 
      ORDER BY m.created_at DESC
    `;
    db.query(query, [artistId], callback);
  },

  // Get all artists of a music
  getArtistsForMusic: (musicId, callback) => {
    const query = `
      SELECT a.*, ma.music_id 
      FROM artists a 
      JOIN music_artists ma ON a.id = ma.artist_id 
      WHERE ma.music_id = ? 
      ORDER BY a.popularity DESC
    `;
    db.query(query, [musicId], callback);
  },

  // ===== BATCH OPERATIONS =====
  
  // Set multiple artists for a music (replace existing)
  setArtistsForMusic: (musicId, artistIds, callback) => {
    // First remove existing relations
    const deleteQuery = 'DELETE FROM music_artists WHERE music_id = ?';
    db.query(deleteQuery, [musicId], (err) => {
      if (err) return callback(err);
      
      if (!artistIds || artistIds.length === 0) {
        return callback(null, { message: 'All artists removed' });
      }
      
      // Then add new relations
      const values = artistIds.map(artistId => [musicId, artistId]);
      const insertQuery = 'INSERT INTO music_artists (music_id, artist_id) VALUES ?';
      db.query(insertQuery, [values], callback);
    });
  },

  // Set multiple albums for a music (replace existing)
  setAlbumsForMusic: (musicId, albumIds, callback) => {
    // First remove existing relations
    const deleteQuery = 'DELETE FROM music_albums WHERE music_id = ?';
    db.query(deleteQuery, [musicId], (err) => {
      if (err) return callback(err);
      
      if (!albumIds || albumIds.length === 0) {
        return callback(null, { message: 'All albums removed' });
      }
      
      // Then add new relations
      const values = albumIds.map(albumId => [musicId, albumId]);
      const insertQuery = 'INSERT INTO music_albums (music_id, album_id) VALUES ?';
      db.query(insertQuery, [values], callback);
    });
  },

  // ===== VALIDATION HELPERS =====
  
  // Check if music-album relation exists
  checkMusicAlbumExists: (musicId, albumId, callback) => {
    const query = 'SELECT COUNT(*) as count FROM music_albums WHERE music_id = ? AND album_id = ?';
    db.query(query, [musicId, albumId], callback);
  },

  // Check if music-artist relation exists
  checkMusicArtistExists: (musicId, artistId, callback) => {
    const query = 'SELECT COUNT(*) as count FROM music_artists WHERE music_id = ? AND artist_id = ?';
    db.query(query, [musicId, artistId], callback);
  },

  // ===== COMPLEX QUERIES =====
  
  // Get complete music data with all relations
  getMusicComplete: (musicId, callback) => {
    const query = `
      SELECT 
        m.*,
        GROUP_CONCAT(DISTINCT CONCAT(a.id, ':', a.name) SEPARATOR '|') as artists,
        GROUP_CONCAT(DISTINCT CONCAT(al.id, ':', al.title) SEPARATOR '|') as albums
      FROM music m
      LEFT JOIN music_artists ma ON m.id = ma.music_id
      LEFT JOIN artists a ON ma.artist_id = a.id
      LEFT JOIN music_albums mal ON m.id = mal.music_id
      LEFT JOIN albums al ON mal.album_id = al.id
      WHERE m.id = ?
      GROUP BY m.id
    `;
    db.query(query, [musicId], callback);
  },

  // Get album complete data with all music
  getAlbumComplete: (albumId, callback) => {
    const query = `
      SELECT 
        a.*,
        GROUP_CONCAT(DISTINCT CONCAT(m.id, ':', m.title) SEPARATOR '|') as music_tracks
      FROM albums a
      LEFT JOIN music_albums ma ON a.id = ma.album_id
      LEFT JOIN music m ON ma.music_id = m.id
      WHERE a.id = ?
      GROUP BY a.id
    `;
    db.query(query, [albumId], callback);
  }


};

module.exports = Music;