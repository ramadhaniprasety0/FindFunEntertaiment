const Film = require('../models/filmModel');
const Users = require('../models/userModel');
const fs = require("fs");

const filmControllers = {
  getAll: (req, res) => {
    const includeRelations = req.query.include;

    if (includeRelations === 'all') {
      Film.getAllComplete((err, results) => {
        if (err) {
          console.error('Error fetching complete films:', err);
          return res.status(500).json({ error: 'Failed to fetch films' });
        }
        res.json({
          success: true,
          data: results,
          count: results.length
        });
      });
    }else{
      Film.getAll((err, results) => {
        if (err) {
          console.error('Error fetching films:', err);
          return res.status(500).json({ error: 'Failed to fetch films' });
        }
        res.json({
          success: true,
          data: results,
          count: results.length
        });
      });
    }

  },

  getAllBioskop: (req, res) => {
    const id = req.params.id;
    Film.getAllBioskop(id, (err, results) => {
      if (err) {
        console.error('Error fetching films:', err);
        return res.status(500).json({ error: 'Failed to fetch films' });
      }
      res.json({
        success: true,
        data: results,
        count: results.length
      });
    });
  },

  getAllTiket: (req, res) => {
    const id = req.params.id;
    Film.getAllTiket(id, (err, results) => {
      if (err) {
        console.error('Error fetching tiket:', err);
        return res.status(500).json({ error: 'Failed to fetch tiket' });
      }
      res.json({
        success: true,
        data: results[0]
        
      });
    });
  },

  getAllTikets:(req, res) => {
    Film.getAllTikets((err, results) => {
      if (err) {
        console.error('Error fetching tiket:', err);
        return res.status(500).json({ error: 'Failed to fetch tiket' });
      }
      res.json({
        success: true,
        data: results,
        count: results.length
      });
    })
  },

  getPaymentUser : (req, res) =>{
    Film.getPaymentUser((err, results) => {
      if (err) {
        console.error('Error fetching payment:', err);
        return res.status(500).json({ error: 'Failed to fetch payment' });
      }
      res.json({
        success: true,
        data: results,
        count: results.length
      });
    })
  },

  getAllSeat: (req, res) => {
    const id = req.params.id;
    Film.getAllSeat(id, (err, results) => {
      if (err) {
        console.error('Error fetching tiket:', err);
        return res.status(500).json({ error: 'Failed to fetch tiket' });
      }

      const reservedSeats = results.map(result => result.seat_id);
      res.json({ success: true, data: reservedSeats });
    });
  },

  getHargaTicket: (req, res) => {
    const id = req.params.id;
    Film.getHargaTicket(id, (err, results) => {
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

  getCinemaLocation: (req, res) => {
    const id = req.params.id;
    Film.getCinemaLocation(id, (err, results) => {
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

  getSchedule: (req, res) => {
    const id = req.params.id;
    const locationId = req.params.locationId;
    Film.getSchedules(id, locationId, (err, results) => {
      if (err) {
        console.error('Error fetching schedule:', err);
        return res.status(500).json({ error: 'Failed to fetch schedule' });
      }
      res.json({
        success: true,
        data: results,
        count: results.length
      });
    });
  },

  getScheduleFilm: (req, res) => {
    // Mendapatkan id film dan id lokasi dari parameter URL
    const { id, locationId } = req.params;
    // Memanggil fungsi getschedule dengan id film dan id lokasi
    Film.getschedule(id, locationId, (err, results) => {
        if (err) {
            console.error('Error fetching tiket:', err);
            return res.status(500).json({ error: 'Failed to fetch tiket' });
        }

        // Mengembalikan hasil jadwal film dalam format JSON
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

    Film.getById(id, (err, result) => {
      if (err) {
        console.error('Error fetching film:', err);
        return res.status(500).json({ error: 'Failed to fetch film' });
      }
      
      if (!result || result.length === 0) {
        return res.status(404).json({ error: 'Film not found' });
      }
      
      res.json({
        success: true,
        data: result[0]
      });
    });
  },

  getTikets: (req, res) => {
    const id = req.params.id;
    const schedule_id = req.params.schedule_id;
    Film.getTikets(id, schedule_id, (err, results) => {
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
  
  buyTicket: (req, res) => {
  const { user_id, nama, email, schedule_id, seat_id, film_id, total_price } = req.body;

  // Validasi input
  if (!user_id || isNaN(user_id) || !film_id || isNaN(film_id) || !Array.isArray(seat_id) || seat_id.length === 0 || !schedule_id || isNaN(schedule_id) || !total_price || isNaN(total_price)) {
    return res.status(400).json({ error: 'Invalid ticket data format' });
  }

  // Proses reservasi kursi satu per satu menggunakan Promise.all
  const reservedSeatsPromises = seat_id.map((seat) => {
    return new Promise((resolve, reject) => {
      // Memanggil function reserveSeat untuk setiap seat_id
      Film.reserveSeat(schedule_id, seat, user_id, (err, result) => {
        if (err) {
          console.error('Error reserving seat:', err);
          reject({ error: 'Failed to reserve seat' }); // Menyertakan error untuk debugging lebih lanjut
        } else {
          resolve(result.insertId); // Mengembalikan ID kursi yang dipesan
        }
      });
    });
  });

  // Tunggu hingga semua kursi berhasil dipesan
  Promise.all(reservedSeatsPromises)
    .then((reservedSeats) => {
      // Jika semua kursi berhasil dipesan, simpan transaksi tiket
      Film.buyTicket(user_id, nama, email, schedule_id, reservedSeats, film_id, total_price, (err, result) => {
        if (err) {
          console.error('Error buying ticket:', err);
          return res.status(500).json({ error: 'Failed to buy ticket' });
        }

        res.json({
          success: true,
          data: result
        });
      });
    })
    .catch((err) => {
      console.error('Error during seat reservation:', err);
      res.status(500).json(err);  
    });
},

updatePayTiket: (req, res) => {
  const {id} = req.params;

  console.log('Received film data:', req.body); 
  console.log('Received files:', req.files);

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ticket data format' });
  }

  const payment = {
    user_id : req.body.user_id,
    nama : req.body.nama,
    email : req.body.email,
    schedule_id : req.body.schedule_id,
    seat_id : req.body.seat_id,
    film_id : req.body.film_id,
    total_price : req.body.total_price,
    payment_id : req.body.payment_id,
  };

  if (req.files?.image && req.files.image[0]) {
    payment.image = req.files.image[0].path;
  } else {
    payment.image = req.body.image;
  }

  Film.updatePayTiket(id, payment, (err, result) => {
    if (err) {
      console.error('Error buying ticket:', err);
      return res.status(500).json({ error: 'Failed to buy ticket' });
    }

    res.json({
      success: true,
      data: result
    })
  })
},

updateShowtime: (req, res) => {
  const { id, schedule_id } = req.params;
  const { showtime } = req.body;

  if (!id || isNaN(id) || !schedule_id || isNaN(schedule_id) || !showtime) {
    return res.status(400).json({ error: 'Invalid showtime data format' });
  }

  Film.updateShowtime(id, schedule_id, showtime, (err, result) => {
    if (err) {
      console.error('Error updating showtime:', err);
      return res.status(500).json({ error: 'Failed to update showtime' });
    }

    res.json({
      success: true,
      data: result
    });
  });
},

createSchedule: (req, res) => {
  const schedule = {
    film_id: req.body.film_id,
    cinema_location_id: req.body.cinema_location_id,
    show_time: req.body.show_time,
    price_id: req.body.price_id,
  }

  console.log(schedule);

  if (!schedule) {
    return res.status(400).json({ error: 'Invalid schedule data format' });
  }

  Film.createSchedule(schedule, (err, result) => {
    if (err) {
      console.error('Error creating schedule:', err);
      return res.status(500).json({ error: 'Failed to create schedule' });
    }

    res.json({
      success: true,
      data: result
    });
  });
},

deleteSchedule: (req, res) => {
  const schedule_id = req.params.schedule_id;

  if (!schedule_id || isNaN(schedule_id)) {
    return res.status(400).json({ error: 'Invalid schedule ID' });
  }

  Film.deleteSchedule(schedule_id, (err, result) => {
    if (err) {
      console.error('Error deleting schedule:', err);
      return res.status(500).json({ error: 'Failed to delete schedule' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  });
},

  create: (req, res) => {
    let artist = req.body.artist;  
    let aktors = req.body.aktors; 

    if (typeof artist === 'string') {
        try {
            artist = JSON.parse(artist);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid artist data format' });
        }
    }

    if (typeof aktors === 'string') {
      try {
          aktors = JSON.parse(aktors);
      } catch (error) {
          return res.status(400).json({ error: 'Invalid aktor data format' });
      }
  }

    const film = {
        title: req.body.title,
        deskripsi: req.body.description,
        release_year: req.body.release_year,
        rating: req.body.rating,
        genre1: req.body.genre1,
        genre2: req.body.genre2,
        genre3: req.body.genre3,
        artist: artist,
        aktors: aktors, 
        duration: req.body.duration,
        director: req.body.director,
        status_film: req.body.status_film,
        netflix_link: req.body.netflix,
        appletv_link: req.body.appletv,
        hbogo_link: req.body.hbogo,
        bioskop_link: req.body.bioskop,
        like_user: 0,
        dislike: 0
    };

    if (req.files?.image) {
        film.image = req.files.image[0].path;
    }

    if (req.files?.posterImage) {
        film.posterImage = req.files.posterImage[0].path;
    }

    if (!film.title) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    Film.create(film, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create film' });
        }
        const filmId = result.insertId;

        let addedArtistsCount = 0;
        if (film.artist && film.artist.length > 0) {
            film.artist.forEach((artistId, index) => {
                const pemeran = aktors[index] || '';  
                if (!pemeran.trim()) {
                    console.log(`Invalid role for artist ID ${artistId}`);
                    return;  
                }

                Film.addFilmToArtist(filmId, artistId, pemeran, (err, result) => {
                    if (err) {
                        console.error('Error adding artist to film:', err);
                        return res.status(500).json({ error: 'Failed to add artist to film' });
                    }
                    addedArtistsCount++;

                    if (addedArtistsCount === film.artist.length) {
                        res.status(201).json({
                            success: true,
                            message: 'Film created',
                            data: { id: result.insertId, ...film }
                        });
                    }
                });
            });
        } else {
            res.status(201).json({
                success: true,
                message: 'Film created without artists',
                data: { id: result.insertId, ...film }
            });
        }
    });
},


  update: (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    let artist = req.body.artist;  
    let aktors = req.body.aktors;

    if (typeof artist === 'string') {
      try {
          artist = JSON.parse(artist);
      } catch (error) {
          return res.status(400).json({ error: 'Invalid artist data format' });
      }
    }

    if (typeof aktors === 'string') {
      try {
          aktors = JSON.parse(aktors);
      } catch (error) {
          return res.status(400).json({ error: 'Invalid aktor data format' });
      }
    }

    console.log('Received film data:', req.body); 
    console.log('Received files:', req.files);

    const film = {
      title: req.body.title,
      deskripsi: req.body.deskripsi,
      release_year: req.body.release_year,
      rating: req.body.rating,
      genre1: req.body.genre1,
      genre2: req.body.genre2,
      genre3: req.body.genre3,
      artist: artist,
      aktors: aktors, 
      duration: req.body.duration,
      director: req.body.director,
      status_film: req.body.status_film,
      netflix_link: req.body.netflix,
      appletv_link: req.body.appletv,
      hbogo_link: req.body.hbogo,
      bioskop_link: req.body.bioskop,
      like_user: 0,
      dislike: 0
    };

    
    if (req.files?.image && req.files.image[0]) {
      film.image = req.files.image[0].path;
    } else {
      // fallback: pakai image lama dari form body
      film.image = req.body.image;
    }
    
    if (req.files?.posterImage && req.files.posterImage[0]) {
      film.posterImage = req.files.posterImage[0].path;
    } else {
      film.posterImage = req.body.posterImage;
    }

    
    const requiredFields = ['title', 'release_year', 'rating', 'duration', 'artist', 'aktors', 'director', 'status_film'];
    for (const field of requiredFields) {
        if (!film[field]) {
            return res.status(400).json({ error: `Missing required field: ${field}` });
        }
    }

    Film.update(id, film, (err, result) => {
      if (err) {
          console.error('Error updating film:', err);
          return res.status(500).json({ error: 'Failed to update film' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Music not found' });
      }

      Film.removeFilmToArtistAll(id, (err) => {
        if (err) {
          console.error('Error removing film from artists:', err);
        }
      });

      if (film.artist && film.artist.length > 0) {
        film.artist.forEach((artistId, index) => {
            const pemeran = aktors[index] || '';  
            
            if (!pemeran.trim()) {
                console.log(`Invalid role for artist ID ${artistId}`);
                return;  
            }

            Film.addFilmToArtist(id, artistId, pemeran, (err, result) => {
                if (err) {
                    console.error('Error adding artist to film:', err);
                    return res.status(500).json({ error: 'Failed to add artist to film' });
                }
            });
        });
      }

      res.status(200).json({
          success: true,
          message: 'Film updated successfully',
          data: { id, ...film }
      });
    });
  },


  
  delete: (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    Film.delete(id, (err, result) => {
      if (err) {
        console.error('Error deleting film:', err);
        return res.status(500).json({ error: 'Failed to delete film' });
      }

      Film.removeFilmToArtistAll(id, (err, result) => {
        if (err) {
          console.error('Error removing film from artists:', err);
          return res.status(500).json({ error: 'Failed to remove film from artists' });
        }
      });
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Film not found' });
      }
      
      res.json({
        success: true,
        message: 'Film deleted successfully'
      });
    });
  },

  getArtistsForFilm: (req, res) => {
    const filmId = req.params.filmId;

    if (!filmId || isNaN(filmId)) {
      return res.status(400).json({ error: 'Invalid film ID' });
    }

    Film.getArtistsForFilm(filmId, (err, results) => {
      if (err) {
        console.error('Error fetching artists for film:', err);
        return res.status(500).json({ error: 'Failed to fetch artists for film' });
      }
      
      res.json({
        success: true,
        data: results,
        count: results.length,
        filmId: filmId
      });
    });
  },

  search: (req, res) => {
    const searchTerm = req.query.q;
    
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    Film.search(searchTerm, (err, results) => {
      if (err) {
        console.error('Error searching films:', err);
        return res.status(500).json({ error: 'Failed to search films' });
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

    Film.getByGenre(genre, (err, results) => {
      if (err) {
        console.error("Error getting films by genre:", err);
        return res.status(500).json({ error: "Failed to get films by genre" });
      }

      res.json({
        success: true,
        data: results,
      });
    });
  },

  updatePaymentStatus: (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID tiket tidak valid' });
    }
    
    if (!status || (status !== 'ACCEPT' && status !== 'REJECT')) {
      return res.status(400).json({ error: 'Status tidak valid. Gunakan ACCEPT atau REJECT' });
    }
    
    Film.updatePaymentStatus(id, status, (err, result) => {
      if (err) {
        console.error('Error updating payment status:', err);
        return res.status(500).json({ error: 'Gagal mengubah status pembayaran' });
      }
      
      res.json({
        success: true,
        message: `Status pembayaran berhasil diubah menjadi ${status}`,
        data: result
      });
    });
  }
};

module.exports = filmControllers;