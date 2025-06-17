const Artist = require('../models/artistModel');



const artistControllers = {
  getAll: (req, res) => {
    Artist.getAll((err, results) => {
      if (err) {
        console.error('Error fetching artists:', err);
        return res.status(500).json({ error: 'Failed to fetch artists' });
      }
      res.json({
        success: true,
        data: results,
        count: results.length
      });
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    Artist.getById(id, (err, result) => {
      if (err) {
        console.error('Error fetching artist:', err);
        return res.status(500).json({ error: 'Failed to fetch artist' });
      }
      
      if (!result || result.length === 0) {
        return res.status(404).json({ error: 'Artist not found' });
      }
      
      res.json({
        success: true,
        data: result[0]
      });
    });
  },

  create: (req, res) => {
    const artist = req.body;
    console.log('Received music data:', req.body);
    console.log('Received file:', req.file);
  
    if (!artist.name) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name']
      });
    }
  

    if (artist.birth_date && !isValidDate(artist.birth_date)) {
      return res.status(400).json({ 
        error: 'Invalid birth_date format. Use YYYY-MM-DD'
      });
    }
  
  
    if (req.file) {
      artist.image = req.file ? `uploads/artists/${req.file.filename}` : null; 
    }
  
    Artist.create(artist, (err, result) => {
      if (err) {
        console.error('Error creating artist:', err);
        return res.status(500).json({ error: 'Failed to create artist' });
      }
      res.status(201).json({
        success: true,
        message: 'Artist created successfully',
        data: { id: result.insertId, ...artist }
      });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const artist = req.body;

    console.log('Received music data:', req.body);
    console.log('Received file:', req.file);

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Validate birth_date format if provided
    if (artist.birth_date && !isValidDate(artist.birth_date)) {
        return res.status(400).json({ 
            error: 'Invalid birth_date format. Use YYYY-MM-DD'
        });
    }

    // Handle image
    if (req.file) {
        artist.image = req.file.path; // Save the image file path
    }

    Artist.update(id, artist, (err, result) => {
        if (err) {
            console.error('Error updating artist:', err);
            return res.status(500).json({ error: 'Failed to update artist' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Artist not found' });
        }
        
        res.json({
            success: true,
            message: 'Artist updated successfully'
        });
    });
  },

  delete: (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    Artist.delete(id, (err, result) => {
      if (err) {
        console.error('Error deleting artist:', err);
        return res.status(500).json({ error: 'Failed to delete artist' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Artist not found' });
      }
      
      res.json({
        success: true,
        message: 'Artist deleted successfully'
      });
    });
  },

  search: (req, res) => {
    const searchTerm = req.query.q;
    
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    Artist.search(searchTerm, (err, results) => {
      if (err) {
        console.error('Error searching artists:', err);
        return res.status(500).json({ error: 'Failed to search artists' });
      }
      
      res.json({
        success: true,
        data: results,
        count: results.length,
        searchTerm: searchTerm
      });
    });
  },

  getByGenre: (req, res) => {
    const genre = req.params.genre;
    
    if (!genre) {
      return res.status(400).json({ error: 'Genre is required' });
    }

    Artist.getByGenre(genre, (err, results) => {
      if (err) {
        console.error('Error fetching artists by genre:', err);
        return res.status(500).json({ error: 'Failed to fetch artists by genre' });
      }
      
      res.json({
        success: true,
        data: results,
        count: results.length,
        genre: genre
      });
    });
  },

  getByCountry: (req, res) => {
    const country = req.params.country;
    
    if (!country) {
      return res.status(400).json({ error: 'Country is required' });
    }

    Artist.getByCountry(country, (err, results) => {
      if (err) {
        console.error('Error fetching artists by country:', err);
        return res.status(500).json({ error: 'Failed to fetch artists by country' });
      }
      
      res.json({
        success: true,
        data: results,
        count: results.length,
        country: country
      });
    });
  },

  getArtistMusic: (req, res) => {
    const artistId = req.params.id;
    
    if (!artistId || isNaN(artistId)) {
      return res.status(400).json({ error: 'Invalid artist ID format' });
    }

    Artist.getArtistMusic(artistId, (err, results) => {
      if (err) {
        console.error('Error fetching artist music:', err);
        return res.status(500).json({ error: 'Failed to fetch artist music' });
      }
      
      res.json({
        success: true,
        data: results,
        count: results.length,
        artistId: artistId
      });
    });
  }
};

// Helper function to validate date format
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  const timestamp = date.getTime();
  
  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;
  
  return dateString === date.toISOString().split('T')[0];
}

module.exports = artistControllers;