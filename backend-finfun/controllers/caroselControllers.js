const Carosel = require("../models/caroselModel");
const fs = require('fs');

const caroselControllers = {

    getCarouselById: (req, res) => {
        const id = req.params.id;

        if(!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        Carosel.getById(id, (err, result) => {
            if (err) {
                console.error('Error fetching carousel:', err);
                return res.status(500).json({ error: 'Failed to fetch carousel' });
            }

            if (!result || result.length === 0) {
                return res.status(404).json({ error: 'Carousel not found' });
            }

            res.json({
                success: true,
                data: result
            })
        });
    },

    create: (req, res) => {
        const carousel = req.body;
        console.log('Creating carousel:', carousel);
        console.log('Received files:', req.files);
    
        // Menangani gambar jika ada (image dan titleImage)
        if (req.files?.image) {
            carousel.image = req.files.image[0].path;  
        }
    
        if (req.files?.titleImage) {
            carousel.titleImage = req.files.titleImage[0].path; 
        }
    
        // Validasi jika semua field yang dibutuhkan ada
        const requiredFields = ['carausel_name', 'titleImage', 'deskripsi', 'status', 'image'];
        for (const field of requiredFields) {
            if (!carousel[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }
    
        // Pastikan carausel_name atau title sudah ada dalam database menggunakan model
        Carosel.checkDuplicate(carousel.carausel_name, carousel.titleImage, (err, results) => {
            if (err) {
                console.error('Error checking duplicates:', err);
                return res.status(500).json({ error: 'Error checking duplicates' });
            }
    
            if (results.length > 0) {
                return res.status(400).json({ error: 'Carousel with this name or title image already exists' });
            }
    
            // Jika tidak ada duplikasi, lanjutkan ke proses penyimpanan data menggunakan model
            Carosel.create(carousel, (err, result) => {
                if (err) {
                    console.error('Error creating carousel:', err);
                    return res.status(500).json({ error: 'Failed to create carousel' });
                }
                res.status(201).json({
                    success: true,
                    message: 'Carousel created successfully',
                    data: { id: result.insertId, ...carousel }
                });
            });
        });
    },

    update: (req, res) => {
        console.log('Received carousel data:', req.body);  // Log body request
        console.log('Received files:', req.files);  // Log files received by multer
    
        const { id } = req.params;
        const carousel = req.body;
    
        if (req.files?.image) {
            carousel.image = req.files.image[0].path;  // Menyimpan path gambar carousel
        } 

        if (req.files?.titleImage) {
            carousel.titleImage = req.files.titleImage[0].path;  // Menyimpan path gambar title
        }   
    
        const requiredFields = ['carausel_name', 'titleImage', 'deskripsi', 'status', 'image'];
        for (const field of requiredFields) {
            if (!carousel[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }
    
        Carosel.update(id, carousel, (err, result) => {
            if (err) {
                console.error('Error updating carousel:', err);
                return res.status(500).json({ error: 'Failed to update carousel' });
            }
            res.status(200).json({
                success: true,
                message: 'Carousel updated successfully',
                data: { id: result.insertId, ...carousel }
            });
        });
    },

    delete:(req, res) =>{
        const {id} = req.params;

        if(!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        
        Carosel.delete(id, (err, result) => {
            if (err) {
                console.error('Error deleting carousel:', err);
                return res.status(500).json({ error: 'Failed to delete carousel' });
            }
            res.json({
                success: true,
                message: 'Carousel deleted successfully'
            });
        });
    },
    

    getCarousel: (req, res) =>{
        Carosel.carousel((err, results) => {
            if (err) {
                console.error('Error fetching carousels:', err);
                return res.status(500).json({ error: 'Failed to fetch carousels' });
            }
            res.json({
                success: true,
                data: results,
                count: results.length
            });
        });
    },

    getAllCarousel: (req, res) =>{
        Carosel.carouselAll((err, results) => {
            if (err) {
                console.error('Error fetching carousels:', err);
                return res.status(500).json({ error: 'Failed to fetch carousels' });
            }
            res.json({
                success: true,
                data: results,
                count: results.length
            });
        });
    },

    getAllCarouselFilms: (req, res) => {
        Carosel.getAllFilms((err, results) => {
            if (err) {
                console.error('Error fetching carousels:', err);
                return res.status(500).json({ error: 'Failed to fetch carousels' });
            }
            res.json({
                success: true,
                data: results,
                count: results.length
            });
        });
    },

    getAllCarouselMusic: (req, res) => {
        Carosel.getAllMusic((err, results) => {
            if (err) {
                console.error('Error fetching carousels:', err);
                return res.status(500).json({ error: 'Failed to fetch carousels' });
            }
            res.json({
                success: true,
                data: results,
                count: results.length
            });
        });
    },

    
    

    updateStatus: (req, res) => {
        const id = req.params.id;
        const status = req.body.status;  // Ambil status dari request body
    
        console.log('Received status data:', req.body);
    
        // Pastikan status adalah 0 atau 1
        if (status !== 0 && status !== 1) {
            return res.status(400).json({ error: 'Status harus berupa 0 atau 1' });
        }
    
        // Update status di tabel carousel_items
        Carosel.updateStatus(id, status, (err, result) => {
            if (err) {
                console.error('Error updating status:', err);
                return res.status(500).json({ error: 'Failed to update status' }); 
            }
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Carousel not found' }); 
            }
    
            res.json({ success: true, message: 'Status updated successfully' }); 
        });
    },
    
};

module.exports = caroselControllers;