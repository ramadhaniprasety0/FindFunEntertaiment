const Music = require('../models/musicModel');

const musicControllers = {
  getAll: (req, res) => {
    const includeRelations = req.query.include;

    if (includeRelations === 'all') {
      Music.getAllComplete((err, results) => {
        if (err) {
          console.error('Error fetching complete music:', err);
          return res.status(500).json({ error: 'Failed to fetch music' });
        }
        res.json({
          success: true,
          data: results,
          count: results.length
        });
      });
    } else if (includeRelations === 'artists') {
      Music.getAllWithArtists((err, results) => {
        if (err) {
          console.error('Error fetching music with artists:', err);
          return res.status(500).json({ error: 'Failed to fetch music' });
        }
        res.json({
          success: true,
          data: results,
          count: results.length
        });
      });
    } else if (includeRelations === 'albums') {
      Music.getAllWithAlbums((err, results) => {
        if (err) {
          console.error('Error fetching music with albums:', err);
          return res.status(500).json({ error: 'Failed to fetch music' });
        }
        res.json({
          success: true,
          data: results,
          count: results.length
        });
      });
    } else {
      Music.getAll((err, results) => {
        if (err) {
          console.error('Error fetching music:', err);
          return res.status(500).json({ error: 'Failed to fetch music' });
        }
        res.json({
          success: true,
          data: results,
          count: results.length
        });
      });
    }
  },

  getAllTiket: (req, res) => {
    const id = req.params.id;
    Music.getAllTiket(id, (err, results) => {
      if (err) {
        console.error('Error fetching tiket:', err);
        return res.status(500).json({ error: 'Failed to fetch tiket' });
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
    const includeRelations = req.query.include;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    if (includeRelations === 'all' || includeRelations === 'true') {
      Music.getByIdWithRelations(id, (err, result) => {
        if (err) {
          console.error('Error fetching music with relations:', err);
          return res.status(500).json({ error: 'Failed to fetch music' });
        }
        
        if (!result || result.length === 0) {
          return res.status(404).json({ error: 'Music not found' });
        }
        
        res.json({
          success: true,
          data: result[0]
        });
      });
    } else {
      Music.getById(id, (err, result) => {
        if (err) {
          console.error('Error fetching music:', err);
          return res.status(500).json({ error: 'Failed to fetch music' });
        }
        
        if (!result || result.length === 0) {
          return res.status(404).json({ error: 'Music not found' });
        }
        
        res.json({
          success: true,
          data: result[0]
        });
      });
    }
  },

  create: (req, res) => {
    let artist = req.body.artist;
    let album = req.body.album;

    console.log('Received music data:', req.body);
    console.log('Received file:', req.file);
  
    
    if (typeof artist === 'string') {
      try {
        artist = JSON.parse(artist);  
      } catch (error) {
        return res.status(400).json({ error: 'Invalid artist data format' });
      }
    }
    if (typeof album === 'string') {
      try {
        album = JSON.parse(album);  
      } catch (error) {
        return res.status(400).json({ error: 'Invalid album data format' });
      }
    }
  
    const music = {
      title: req.body.title,
      lirik: req.body.lirik,
      release_year: req.body.release_year,
      rating: req.body.rating,
      genre1: req.body.genre1,
      genre2: req.body.genre2,
      genre3: req.body.genre3,
      artist: artist,  
      album: album,    
      spotify_link: req.body.spotify,
      apple_link: req.body.apple,
      deezer_link: req.body.deezer,
      youtube_link: req.body.ytmusic,
      like_user: 0,
      dislike: 0,
      image: req.file ? `uploads/${req.file.filename}` : null
    };
  
    
    if (!music.title || !music.artist || !music.album || !music.release_year || !music.spotify_link || !music.apple_link || !music.deezer_link || !music.lirik) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    
    Music.create(music, (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to create music' });
  
      const musicId = result.insertId;
  
      
      if (music.artist && music.artist.length > 0) {
        music.artist.forEach(artistId => {
          Music.addMusicToArtist(musicId, artistId, (err) => {
            if (err) {
              console.error('Error adding artist relation:', err);
            }
          });
        });
      }
  
      
      if (Array.isArray(music.album)) {
        music.album.forEach(albumId => {
          Music.addMusicToAlbum(musicId, albumId, (err) => {
            if (err) {
              console.error('Error adding album relation:', err);
            }
          });
        });
      } else {
        Music.addMusicToAlbum(musicId, music.album, (err) => {
          if (err) {
            console.error('Error adding album relation:', err);
          }
        });
      }
  
      res.status(201).json({
        success: true,
        message: 'Music created successfully',
        data: { id: musicId, ...music }
      });
    });
  },
  

  update: (req, res) => {
    const id = req.params.id;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
  
    let artist = req.body.artist;
    let album = req.body.album;
  
    console.log('Received music data:', req.body);
    console.log('Received file:', req.file);
  
    
    if (typeof artist === 'string') {
      try {
        artist = JSON.parse(artist);  
      } catch (error) {
        return res.status(400).json({ error: 'Invalid artist data format' });
      }
    }
    if (typeof album === 'string') {
      try {
        album = JSON.parse(album);  
      } catch (error) {
        return res.status(400).json({ error: 'Invalid album data format' });
      }
    }
  
    
    const music = {
      title: req.body.title,
      lirik: req.body.lirik,
      release_year: req.body.release_year,
      rating: req.body.rating,
      genre1: req.body.genre1,
      genre2: req.body.genre2,
      genre3: req.body.genre3,
      artist: artist,  
      album: album,    
      spotify_link: req.body.spotify,
      apple_link: req.body.apple,
      deezer_link: req.body.deezer,
      youtube_link: req.body.ytmusic,
      like_user: 0,
      dislike: 0,
      image: req.file ? `uploads/${req.file.filename}` : req.body.existingImage
    };
  
    
    if (!music.title || !music.artist || !music.album || !music.release_year || !music.spotify_link || !music.apple_link || !music.deezer_link || !music.lirik) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    
    Music.update(id, music, (err, result) => {
      if (err) {
        console.error('Error updating music:', err);
        return res.status(500).json({ error: 'Failed to update music' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Music not found' });
      }

      Music.removeMusicFromArtistAll(id, (err) => {
        if (err) {
          console.error('Error removing artist relations:', err);
        }
      });
  
      
      Music.removeMusicFromAlbumAll(id, (err) => {
        if (err) {
          console.error('Error removing album relations:', err);
        }
      });

      if (music.artist && music.artist.length > 0) {
        music.artist.forEach(artistId => {
          Music.addMusicToArtist(id, artistId, (err) => {
            if (err) {
              console.error('Error adding artist relation:', err);
            }
          });
        });
      }

      if (music.album && music.album.length > 0) {
        music.album.forEach(albumId => {
          Music.addMusicToAlbum(id, albumId, (err) => {
            if (err) {
              console.error('Error adding album relation:', err);
            }
          });
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Music updated successfully',
        data: { id, ...music }
      });
    });
  },
  
  
  
  
  delete: (req, res) => {
    const id = req.params.id;
    const artistId = req.params.artistId;
    const albumId = req.params.albumId;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    if (artistId && !isNaN(artistId)) {
      Music.removeMusicFromArtistAll(id, (err) => {
        if (err) {
          console.error('Error removing artist relation:', err);
        }
      });
    }

    if (albumId && !isNaN(albumId)) {
      Music.removeMusicFromAlbumAll(id, (err) => {
        if (err) {
          console.error('Error removing album relation:', err);
        }
      });
    }

    Music.delete(id, (err, result) => {
      if (err) {
        console.error('Error deleting music:', err);
        return res.status(500).json({ error: 'Failed to delete music' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Music not found' });
      }
      
      res.json({
        success: true,
        message: 'Music deleted successfully'
      });
    });
  },

  search: (req, res) => {
    const searchTerm = req.query.q;
    
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    Music.search(searchTerm, (err, results) => {
      if (err) {
        console.error('Error searching music:', err);
        return res.status(500).json({ error: 'Failed to search music' });
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

    Music.getByGenre(genre, (err, results) => {
      if (err) {
        console.error('Error fetching music by genre:', err);
        return res.status(500).json({ error: 'Failed to fetch music by genre' });
      }
      
      res.json({
        success: true,
        data: results,
        count: results.length,
        genre: genre
      });
    });
  },

  addMusicToAlbum: (req, res) => {
    const { musicId, albumId } = req.body;
    
    if (!musicId || !albumId || isNaN(musicId) || isNaN(albumId)) {
      return res.status(400).json({ 
        error: 'Invalid input',
        required: ['musicId (number)', 'albumId (number)']
      });
    }

    // Check if relation already exists
    Music.checkMusicAlbumExists(musicId, albumId, (err, result) => {
      if (err) {
        console.error('Error checking music-album relation:', err);
        return res.status(500).json({ error: 'Failed to check relation' });
      }

      if (result[0].count > 0) {
        return res.status(409).json({ 
          error: 'Relation already exists',
          message: 'This music is already in the album'
        });
      }

      Music.addMusicToAlbum(musicId, albumId, (err, result) => {
        if (err) {
          console.error('Error adding music to album:', err);
          return res.status(500).json({ error: 'Failed to add music to album' });
        }
        res.status(201).json({
          success: true,
          message: 'Music added to album successfully',
          data: { musicId, albumId }
        });
      });
    });
  },

  removeMusicFromAlbum: (req, res) => {
    const { musicId, albumId } = req.params;
    
    if (!musicId || !albumId || isNaN(musicId) || isNaN(albumId)) {
      return res.status(400).json({ error: 'Invalid music ID or album ID' });
    }

    Music.removeMusicFromAlbum(musicId, albumId, (err, result) => {
      if (err) {
        console.error('Error removing music from album:', err);
        return res.status(500).json({ error: 'Failed to remove music from album' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Relation not found' });
      }
      
      res.json({
        success: true,
        message: 'Music removed from album successfully'
      });
    });
  },

  getMusicInAlbum: (req, res) => {
    const albumId = req.params.albumId;
    
    if (!albumId || isNaN(albumId)) {
      return res.status(400).json({ error: 'Invalid album ID' });
    }

    Music.getMusicInAlbum(albumId, (err, results) => {
      if (err) {
        console.error('Error fetching music in album:', err);
        return res.status(500).json({ error: 'Failed to fetch music in album' });
      }
      
      res.json({
        success: true,
        data: results,
        count: results.length,
        albumId: albumId
      });
    });
  },

  getAlbumsForMusic: (req, res) => {
    const musicId = req.params.musicId;
    
    if (!musicId || isNaN(musicId)) {
      return res.status(400).json({ error: 'Invalid music ID' });
    }

    Music.getAlbumsForMusic(musicId, (err, results) => {
      if (err) {
        console.error('Error fetching albums for music:', err);
        return res.status(500).json({ error: 'Failed to fetch albums for music' });
      }
      
      res.json({
        success: true,
        data: results,
        count: results.length,
        musicId: musicId
      });
    });
  },

  // ===== MUSIC-ARTISTS RELATIONS =====
  
  addMusicToArtist: (req, res) => {
    const { musicId, artistId } = req.body;
    
    if (!musicId || !artistId || isNaN(musicId) || isNaN(artistId)) {
      return res.status(400).json({ 
        error: 'Invalid input',
        required: ['musicId (number)', 'artistId (number)']
      });
    }

    // Check if relation already exists
    Music.checkMusicArtistExists(musicId, artistId, (err, result) => {
      if (err) {
        console.error('Error checking music-artist relation:', err);
        return res.status(500).json({ error: 'Failed to check relation' });
      }

      if (result[0].count > 0) {
        return res.status(409).json({ 
          error: 'Relation already exists',
          message: 'This music is already linked to the artist'
        });
      }

      Music.addMusicToArtist(musicId, artistId, (err, result) => {
        if (err) {
          console.error('Error adding music to artist:', err);
          return res.status(500).json({ error: 'Failed to add music to artist' });
        }
        res.status(201).json({
          success: true,
          message: 'Music added to artist successfully',
          data: { musicId, artistId }
        });
      });
    });
  },

  removeMusicFromArtist: (req, res) => {
    const { musicId, artistId } = req.params;
    
    if (!musicId || !artistId || isNaN(musicId) || isNaN(artistId)) {
      return res.status(400).json({ error: 'Invalid music ID or artist ID' });
    }

    Music.removeMusicFromArtist(musicId, artistId, (err, result) => {
      if (err) {
        console.error('Error removing music from artist:', err);
        return res.status(500).json({ error: 'Failed to remove music from artist' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Relation not found' });
      }
      
      res.json({
        success: true,
        message: 'Music removed from artist successfully'
      });
    });
  },

  getMusicByArtist: (req, res) => {
    const artistId = req.params.artistId;
    
    if (!artistId || isNaN(artistId)) {
      return res.status(400).json({ error: 'Invalid artist ID' });
    }

    Music.getMusicByArtist(artistId, (err, results) => {
      if (err) {
        console.error('Error fetching music by artist:', err);
        return res.status(500).json({ error: 'Failed to fetch music by artist' });
      }
      
      res.json({
        success: true,
        data: results,
        count: results.length,
        artistId: artistId
      });
    });
  },

  getArtistsForMusic: (req, res) => {
    const musicId = req.params.musicId;
    
    if (!musicId || isNaN(musicId)) {
      return res.status(400).json({ error: 'Invalid music ID' });
    }

    Music.getArtistsForMusic(musicId, (err, results) => {
      if (err) {
        console.error('Error fetching artists for music:', err);
        return res.status(500).json({ error: 'Failed to fetch artists for music' });
      }
      
      res.json({
        success: true,
        data: results,
        count: results.length,
        musicId: musicId
      });
    });
  },
  
  setArtistsForMusic: (req, res) => {
    const musicId = req.params.musicId;
    const { artistIds } = req.body;
    
    if (!musicId || isNaN(musicId)) {
      return res.status(400).json({ error: 'Invalid music ID' });
    }

    if (!Array.isArray(artistIds)) {
      return res.status(400).json({ 
        error: 'artistIds must be an array',
        example: { artistIds: [1, 2, 3] }
      });
    }

    // Validate all artist IDs
    for (let id of artistIds) {
      if (isNaN(id)) {
        return res.status(400).json({ 
          error: 'All artist IDs must be numbers',
          invalid: id
        });
      }
    }

    Music.setArtistsForMusic(musicId, artistIds, (err, result) => {
      if (err) {
        console.error('Error setting artists for music:', err);
        return res.status(500).json({ error: 'Failed to set artists for music' });
      }
      
      res.json({
        success: true,
        message: 'Artists set for music successfully',
        data: { musicId, artistIds, count: artistIds.length }
      });
    });
  },

  setAlbumsForMusic: (req, res) => {
    const musicId = req.params.musicId;
    const { albumIds } = req.body;
    
    if (!musicId || isNaN(musicId)) {
      return res.status(400).json({ error: 'Invalid music ID' });
    }

    if (!Array.isArray(albumIds)) {
      return res.status(400).json({ 
        error: 'albumIds must be an array',
        example: { albumIds: [1, 2, 3] }
      });
    }

    // Validate all album IDs
    for (let id of albumIds) {
      if (isNaN(id)) {
        return res.status(400).json({ 
          error: 'All album IDs must be numbers',
          invalid: id
        });
      }
    }

    Music.setAlbumsForMusic(musicId, albumIds, (err, result) => {
      if (err) {
        console.error('Error setting albums for music:', err);
        return res.status(500).json({ error: 'Failed to set albums for music' });
      }
      
      res.json({
        success: true,
        message: 'Albums set for music successfully',
        data: { musicId, albumIds, count: albumIds.length }
      });
    });
  },

  // ===== COMPLEX QUERIES =====
  
  getMusicComplete: (req, res) => {
    const musicId = req.params.musicId;
    
    if (!musicId || isNaN(musicId)) {
      return res.status(400).json({ error: 'Invalid music ID' });
    }

    Music.getMusicComplete(musicId, (err, result) => {
      if (err) {
        console.error('Error fetching complete music data:', err);
        return res.status(500).json({ error: 'Failed to fetch complete music data' });
      }
      
      if (!result || result.length === 0) {
        return res.status(404).json({ error: 'Music not found' });
      }

      // Parse the concatenated data
      const musicData = result[0];
      
      // Parse artists
      if (musicData.artists) {
        musicData.artists = musicData.artists.split('|').map(artist => {
          const [id, name] = artist.split(':');
          return { id: parseInt(id), name };
        });
      } else {
        musicData.artists = [];
      }

      // Parse albums
      if (musicData.albums) {
        musicData.albums = musicData.albums.split('|').map(album => {
          const [id, title] = album.split(':');
          return { id: parseInt(id), title };
        });
      } else {
        musicData.albums = [];
      }
      
      res.json({
        success: true,
        data: musicData
      });
    });
  },

  getAlbumComplete: (req, res) => {
    const albumId = req.params.albumId;
    
    if (!albumId || isNaN(albumId)) {
      return res.status(400).json({ error: 'Invalid album ID' });
    }

    Music.getAlbumComplete(albumId, (err, result) => {
      if (err) {
        console.error('Error fetching complete album data:', err);
        return res.status(500).json({ error: 'Failed to fetch complete album data' });
      }
      
      if (!result || result.length === 0) {
        return res.status(404).json({ error: 'Album not found' });
      }

      // Parse the concatenated data
      const albumData = result[0];
      
      // Parse music tracks
      if (albumData.music_tracks) {
        albumData.music_tracks = albumData.music_tracks.split('|').map(track => {
          const [id, title] = track.split(':');
          return { id: parseInt(id), title };
        });
      } else {
        albumData.music_tracks = [];
      }
      
      res.json({
        success: true,
        data: albumData
      });
    });
  }
};

module.exports = musicControllers;