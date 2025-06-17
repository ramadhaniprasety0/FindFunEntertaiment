const db = require('../db');
const { get } = require('../routes');

const Carosel = {

    
    checkDuplicate: (carausel_name, titleImage, callback) => {
        const query = 'SELECT * FROM carousel_items WHERE carausel_name = ? OR titleImage = ?';
        db.query(query, [carausel_name, titleImage], callback);
    },

    // Menambahkan carousel baru
    create: (carousel, callback) => {
        const { carausel_name, titleImage, image, deskripsi, status } = carousel;
        const query = 'INSERT INTO carousel_items (carausel_name, titleImage, image, deskripsi, status) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [carausel_name, titleImage, image, deskripsi, status], callback);
    },

    update: (id, carousel, callback) => {
        const { carausel_name, titleImage, image, deskripsi, status } = carousel;
        const query = 'UPDATE carousel_items SET carausel_name = ?, titleImage = ?, image = ?, deskripsi = ?, status = ? WHERE id = ?';
        
        db.query(query, [carausel_name, titleImage, image, deskripsi, status, id], callback);
    },

    delete: (id, callback) => {
        db.query('DELETE FROM carousel_items WHERE id = ?', [id], callback);
    },
    

    getById: (id, callback) => {
        db.query('SELECT * FROM carousel_items WHERE id = ?', [id], callback);
    },

    carouselAll: (callback) => {
        db.query('SELECT * FROM carousel_items', callback);
    },

    carousel: (callback) => {
        db.query('SELECT * FROM carousel_items WHERE status > 0', callback);
    },

    updateStatus: (id, status, callback) => {
        db.query('UPDATE carousel_items SET status = ? WHERE id = ?', [status, id], callback);
    },

    carouselFilms: (callback) => {
        db.query('SELECT * FROM carousel_items WHERE status = 1', callback);
    },

    carouselMusics: (callback) => {
        db.query('SELECT * FROM carousel_items WHERE status = 2', callback);
    },

    carouselKonser: (callback) => {
        db.query('SELECT * FROM carousel_items WHERE status = 3', callback);
    },
}

module.exports = Carosel;