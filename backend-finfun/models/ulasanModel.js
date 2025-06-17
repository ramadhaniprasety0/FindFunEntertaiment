const db = require('../db');

const Ulasan = {

    getAll: (callback) => {
        const query = `SELECT 
    ulasan.*,
    COALESCE(films.title, music.title, albums.title) as content_title,
    COALESCE(films.image_poster, music.image, albums.image) as content_image,
    users.username AS username
    FROM ulasan
    LEFT JOIN films ON ulasan.film_id = films.id
    LEFT JOIN music ON ulasan.music_id = music.id
    LEFT JOIN albums ON ulasan.album_id = albums.id
    JOIN users ON ulasan.user_id = users.id`;
        db.query(query, callback);
    },

    getById: (id, callback) => {
        const query = `SELECT 
    ulasan.*,
    COALESCE(films.title, music.title, albums.title) as content_title,
    COALESCE(films.image_poster, music.image, albums.image) as content_image,
    users.username AS username
    FROM ulasan
    LEFT JOIN films ON ulasan.film_id = films.id
    LEFT JOIN music ON ulasan.music_id = music.id
    LEFT JOIN albums ON ulasan.album_id = albums.id
    JOIN users ON ulasan.user_id = users.id
    WHERE ulasan.id = ?`;
        db.query(query, [id], callback);
    },

    create: (ulasan, callback) => {
        const { 
            user_id, film_id, music_id, album_id, title_review, alur_review, sinematografi_review, pemeran_review,
            review_lain, kategori, rating, like_ulasan, dislike_ulasan
        } = ulasan;
        const query = `INSERT INTO ulasan (
            user_id, film_id, music_id, album_id, title_review, alur_review, sinematografi_review, pemeran_review,
            review_lain, kategori, rating, like_ulasan, dislike_ulasan
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(query, [
            user_id, film_id || null, music_id || null, album_id || null, title_review || null,  alur_review || null, 
            sinematografi_review || null, pemeran_review || null, review_lain || null, 
            kategori || null, rating || 0, like_ulasan || 0, dislike_ulasan || 0
        ], callback);
    },

    update: (id, ulasan, callback) => {
        const { 
            alur_review, sinematografi_review, pemeran_review,
            review_lain, kategori, rating
        } = ulasan;
        const query = `UPDATE ulasan SET 
            alur_review = ?, 
            sinematografi_review = ?, 
            pemeran_review = ?,
            review_lain = ?, 
            kategori = ?, 
            rating = ?,
            updated_at = NOW()
            WHERE id = ?`;
        db.query(query, [
            alur_review || null, 
            sinematografi_review || null, 
            pemeran_review || null, 
            review_lain || null, 
            kategori || null, 
            rating || 0, 
            id
        ], callback);
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM ulasan WHERE id = ?';
        db.query(query, [id], callback);
    },

    getByFilmId: (filmId, callback) => {
        const query = `SELECT 
    ulasan.*,
    films.title,
    films.image_poster,
    users.username
    FROM ulasan
    JOIN films ON ulasan.film_id = films.id
    JOIN users ON ulasan.user_id = users.id
    WHERE ulasan.film_id = ?`;
        db.query(query, [filmId], callback);
    },

    getByMusicId: (musicId, callback) => {
        const query = `SELECT 
    ulasan.*,
    music.title,
    music.image,
    users.username
    FROM ulasan
    JOIN music ON ulasan.music_id = music.id
    JOIN users ON ulasan.user_id = users.id
    WHERE ulasan.music_id = ?`;
        db.query(query, [musicId], callback);
    },

    getByAlbumId: (albumId, callback) => {
        const query = `SELECT 
    ulasan.*,
    albums.title,
    albums.image,
    users.username
    FROM ulasan
    JOIN albums ON ulasan.album_id = albums.id
    JOIN users ON ulasan.user_id = users.id
    WHERE ulasan.album_id = ?`;
        db.query(query, [albumId], callback);
    },

    getByUserId: (userId, callback) => {
        const query = `SELECT 
    ulasan.*,
    COALESCE(films.title, music.title, albums.title) as content_title,
    COALESCE(films.image_poster, music.image, albums.image) as content_image
    FROM ulasan
    LEFT JOIN films ON ulasan.film_id = films.id
    LEFT JOIN music ON ulasan.music_id = music.id
    LEFT JOIN albums ON ulasan.album_id = albums.id
    WHERE ulasan.user_id = ?`;
        db.query(query, [userId], callback);
    }
};

module.exports = Ulasan;