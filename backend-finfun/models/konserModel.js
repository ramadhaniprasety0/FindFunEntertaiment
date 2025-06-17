const db = require('../db');

const Konser = {
  // ===== OPERASI UNTUK TABEL KONSER =====
  getAll: (callback) => {
    // db.query('SELECT * FROM konser ORDER BY created_at DESC', callback);
    db.query('SELECT k.*,  GROUP_CONCAT(js.jenis_tiket ORDER BY js.jenis_tiket) AS jenis_tiket FROM konser k JOIN konser_tiket_jenis js ON k.id = js.konser_id GROUP BY k.id  ORDER BY created_at DESC', callback);
  },
  
  getById: (id, callback) => {
    db.query('SELECT * FROM konser WHERE id = ?', [id], callback);
  },
  
  // ===== OPERASI UNTUK TABEL KONSER_ARTIST =====
  getKonserArtists: (konserId, callback) => {
    const query = `
      SELECT a.* 
      FROM artists a
      JOIN konser_artist ka ON a.id = ka.artist_id
      WHERE ka.konser_id = ?
    `;
    db.query(query, [konserId], callback);
  },
  
  addKonserArtist: (konserId, artistId, callback) => {
    db.query(
      'INSERT INTO konser_artist (konser_id, artist_id) VALUES (?, ?)',
      [konserId, artistId],
      callback
    );
  },
  
  addMultipleKonserArtists: (konserId, artistIds, callback) => {
    if (!artistIds || artistIds.length === 0) {
      return callback(null, { message: 'No artists to add' });
    }
    
    const values = artistIds.map(artistId => [konserId, artistId]);
    db.query(
      'INSERT INTO konser_artist (konser_id, artist_id) VALUES ?',
      [values],
      callback
    );
  },
  
  deleteKonserArtist: (konserId, artistId, callback) => {
    db.query(
      'DELETE FROM konser_artist WHERE konser_id = ? AND artist_id = ?',
      [konserId, artistId],
      callback
    );
  },
  
  deleteAllKonserArtists: (konserId, callback) => {
    db.query(
      'DELETE FROM konser_artist WHERE konser_id = ?',
      [konserId],
      callback
    );
  },
  
  create: (konserData, callback) => {
    const { nama_konser, deskripsi_acara, lokasi, tanggal, image, jenis_tiket, selected_artists } = konserData;
    
    // Mulai transaksi database
    db.beginTransaction((err) => {
      if (err) {
        return callback(err);
      }
      
      // Insert data konser
      const konserQuery = 'INSERT INTO konser (nama_konser, deskripsi_acara, lokasi, tanggal, image) VALUES (?, ?, ?, ?, ?)';
      db.query(konserQuery, [nama_konser, deskripsi_acara, lokasi, tanggal, image], (err, result) => {
        if (err) {
          return db.rollback(() => {
            callback(err);
          });
        }
        
        const konserId = result.insertId;
        let hasJenisTiket = jenis_tiket && jenis_tiket.length > 0;
        let hasArtists = selected_artists && selected_artists.length > 0;
        
        // Jika tidak ada jenis tiket dan tidak ada artis, commit transaksi
        if (!hasJenisTiket && !hasArtists) {
          return db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                callback(err);
              });
            }
            callback(null, { id: konserId, message: 'Konser berhasil dibuat tanpa jenis tiket dan artis' });
          });
        }
        
        // Fungsi untuk menangani commit transaksi
        const handleCommit = () => {
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                callback(err);
              });
            }
            callback(null, { id: konserId, message: 'Konser berhasil dibuat dengan semua data terkait' });
          });
        };
        
        // Fungsi untuk menangani insert artis setelah insert jenis tiket
        const handleArtistsInsert = () => {
          if (!hasArtists) {
            return handleCommit();
          }
          
          const artistValues = selected_artists.map(artistId => [konserId, artistId]);
          const artistQuery = 'INSERT INTO konser_artist (konser_id, artist_id) VALUES ?';
          console.log(artistValues);
          db.query(artistQuery, [artistValues], (err) => {
            if (err) {
              return db.rollback(() => {
                callback(err);
              });
            }
            
            handleCommit();
          });
        };
        
        // Jika ada jenis tiket, insert jenis tiket terlebih dahulu
        if (hasJenisTiket) {
          const jenisTiketValues = jenis_tiket.map(tiket => [konserId, tiket.jenis_tiket, tiket.harga]);
          const jenisTiketQuery = 'INSERT INTO konser_tiket_jenis (konser_id, jenis_tiket, harga) VALUES ?';
          console.log(jenisTiketValues);
          db.query(jenisTiketQuery, [jenisTiketValues], (err) => {
            handleArtistsInsert();
            if (err) {
              return db.rollback(() => {
                callback(err);
              });
            }
            
            // Setelah insert jenis tiket, lanjutkan dengan insert artis
            
          });
        } else {
          // Jika tidak ada jenis tiket, langsung insert artis
          handleArtistsInsert();
        }
      });
    });
  },
  
  update: (id, konserData, callback) => {
    const { nama_konser, deskripsi_acara, lokasi, tanggal, image, selected_artists } = konserData;
    
    // Mulai transaksi database
    db.beginTransaction((err) => {
      if (err) {
        return callback(err);
      }
      
      let query = 'UPDATE konser SET nama_konser = ?, deskripsi_acara = ?, lokasi = ?, tanggal = ?';
      let params = [nama_konser, deskripsi_acara, lokasi, tanggal];
      
      // Jika ada image baru, tambahkan ke query
      if (image) {
        query += ', image = ?';
        params.push(image);
      }
      
      query += ' WHERE id = ?';
      params.push(id);
      
      db.query(query, params, (err, result) => {
        if (err) {
          return db.rollback(() => {
            callback(err);
          });
        }
        
        // Jika tidak ada artis yang dipilih, commit transaksi
        if (!selected_artists || selected_artists.length === 0) {
          return db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                callback(err);
              });
            }
            callback(null, { id, message: 'Konser berhasil diupdate tanpa perubahan artis' });
          });
        }
        
        // Hapus semua artis yang terkait dengan konser ini
        db.query('DELETE FROM konser_artist WHERE konser_id = ?', [id], (err) => {
          if (err) {
            return db.rollback(() => {
              callback(err);
            });
          }
          
          // Insert artis baru
          const artistValues = selected_artists.map(artistId => [id, artistId]);
          const artistQuery = 'INSERT INTO konser_artist (konser_id, artist_id) VALUES ?';
          
          db.query(artistQuery, [artistValues], (err) => {
            if (err) {
              return db.rollback(() => {
                callback(err);
              });
            }
            
            // Commit transaksi jika semua operasi berhasil
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  callback(err);
                });
              }
              callback(null, { id, message: 'Konser dan artis berhasil diupdate' });
            });
          });
        });
      });
    });
  },
  
  delete: (id, callback) => {
    db.query('DELETE FROM konser WHERE id = ?', [id], callback);
  },
  
  // ===== OPERASI UNTUK TABEL KONSER_TIKET_JENIS =====
  getAllJenisTiket: (konserId, callback) => {
    db.query('SELECT * FROM konser_tiket_jenis WHERE konser_id = ?', [konserId], callback);
  },
  
  createJenisTiket: (jenisTiketData, callback) => {
    const { konser_id, jenis_tiket, harga } = jenisTiketData;
    db.query(
      'INSERT INTO konser_tiket_jenis (konser_id, jenis_tiket, harga) VALUES (?, ?, ?)',
      [konser_id, jenis_tiket, harga],
      callback
    );
  },
  
  updateJenisTiket: (id, jenisTiketData, callback) => {
    const { jenis_tiket, harga } = jenisTiketData;
    db.query(
      'UPDATE konser_tiket_jenis SET jenis_tiket = ?, harga = ? WHERE id = ?',
      [jenis_tiket, harga, id],
      callback
    );
  },
  
  deleteJenisTiket: (id, callback) => {
    db.query('DELETE FROM konser_tiket_jenis WHERE id = ?', [id], callback);
  },
  
  // ===== OPERASI UNTUK TABEL KONSER_TIKET (PEMESANAN) =====
  getAllTiket: (callback) => {
    const query = `
      SELECT kt.*, kp.status, kp.total_harga, kp.bukti_pembayaran, kp.id as payment_id
      FROM konser_tiket kt
      LEFT JOIN konser_pembayaran kp ON kt.id = kp.konser_tiket_id
      ORDER BY kt.created_at DESC
    `;
    db.query(query, callback);
  },
  
  getTiketById: (id, callback) => {
    const query = `
      SELECT kt.*, kp.status, kp.total_harga, kp.bukti_pembayaran, kp.id as payment_id
      FROM konser_tiket kt
      LEFT JOIN konser_pembayaran kp ON kt.id = kp.konser_tiket_id
      WHERE kt.id = ?
    `;
    db.query(query, [id], callback);
  },
  
  getTiketByUserId: (userId, callback) => {
    const query = `
      SELECT kt.*, kp.status, kp.total_harga, kp.bukti_pembayaran, kp.id as payment_id
      FROM konser_tiket kt
      LEFT JOIN konser_pembayaran kp ON kt.id = kp.konser_tiket_id
      WHERE kt.user_id = ?
      ORDER BY kt.created_at DESC
    `;
    db.query(query, [userId], callback);
  },
  
  createTiket: (tiketData, callback) => {
    const { user_id, nama_konser, deskripsi_acara, email, lokasi, tanggal, poster, jenis_tiket } = tiketData;
    
    // Mulai transaksi database
    db.beginTransaction((err) => {
      if (err) {
        return callback(err);
      }
      
      // Insert data tiket konser
      const tiketQuery = `
        INSERT INTO konser_tiket 
        (user_id, nama_konser, deskripsi_acara, email, lokasi, tanggal, poster) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.query(
        tiketQuery, 
        [user_id, nama_konser, deskripsi_acara, email, lokasi, tanggal, poster],
        (err, result) => {
          if (err) {
            return db.rollback(() => {
              callback(err);
            });
          }
          
          const tiketId = result.insertId;
          let totalHarga = 0;
          
          // Menyiapkan query untuk insert detail tiket
          const detailValues = jenis_tiket.map(tiket => {
            const subtotal = tiket.harga * tiket.jumlah;
            totalHarga += subtotal;
            return [tiketId, tiket.jenis_tiket, tiket.harga, tiket.jumlah];
          });
          
          const detailQuery = 'INSERT INTO konser_tiket_detail (konser_tiket_id, jenis_tiket, harga, jumlah) VALUES ?';
          
          db.query(detailQuery, [detailValues], (err) => {
            if (err) {
              return db.rollback(() => {
                callback(err);
              });
            }
            
            // Insert data pembayaran
            const paymentQuery = 'INSERT INTO konser_pembayaran (konser_tiket_id, total_harga, status) VALUES (?, ?, "PENDING")';
            
            db.query(paymentQuery, [tiketId, totalHarga], (err, paymentResult) => {
              if (err) {
                return db.rollback(() => {
                  callback(err);
                });
              }
              
              // Commit transaksi jika semua operasi berhasil
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    callback(err);
                  });
                }
                callback(null, { 
                  tiket_id: tiketId, 
                  payment_id: paymentResult.insertId,
                  total_harga: totalHarga,
                  message: 'Pemesanan tiket konser berhasil dibuat' 
                });
              });
            });
          });
        }
      );
    });
  },
  
  // ===== OPERASI UNTUK TABEL KONSER_PEMBAYARAN =====
  updatePaymentStatus: (paymentId, status, callback) => {
    db.query(
      'UPDATE konser_pembayaran SET status = ? WHERE id = ?',
      [status, paymentId],
      callback
    );
  },
  
  updateBuktiPembayaran: (paymentId, buktiPembayaran, callback) => {
    db.query(
      'UPDATE konser_pembayaran SET bukti_pembayaran = ? WHERE id = ?',
      [buktiPembayaran, paymentId],
      callback
    );
  },
  
  getPaymentById: (paymentId, callback) => {
    const query = `
      SELECT kp.*, kt.nama_konser, kt.email, kt.lokasi, kt.tanggal, kt.poster, u.username
      FROM konser_pembayaran kp
      JOIN konser_tiket kt ON kp.konser_tiket_id = kt.id
      LEFT JOIN users u ON kt.user_id = u.id
      WHERE kp.id = ?
    `;
    db.query(query, [paymentId], (err, results) => {
      if (err) {
        return callback(err);
      }
      
      if (results.length === 0) {
        return callback(null, null);
      }
      
      const result = results[0];
      
      // Mengubah string jenis_tiket menjadi array JSON
      if (result.jenis_tiket) {
        try {
          // Split string berdasarkan koma dan parse setiap objek JSON
          const tiketArray = result.jenis_tiket.split(',').map(item => JSON.parse(item));
          result.jenis_tiket = tiketArray;
        } catch (e) {
          console.error('Error parsing jenis_tiket:', e);
          result.jenis_tiket = [];
        }
      } else {
        result.jenis_tiket = [];
      }
      
      callback(null, result);
    });
  },
  
  getPaymentDetails: (paymentId, callback) => {
    const query = `
      SELECT kp.*, kt.nama_konser, kt.email, kt.lokasi, kt.tanggal, kt.poster, u.username,
             ktd.jenis_tiket, ktd.harga, ktd.jumlah
      FROM konser_pembayaran kp
      JOIN konser_tiket kt ON kp.konser_tiket_id = kt.id
      LEFT JOIN users u ON kt.user_id = u.id
      JOIN konser_tiket_detail ktd ON kt.id = ktd.konser_tiket_id
      WHERE kp.id = ?
    `;
    db.query(query, [paymentId], callback);
  },
  
  getAllPayments: (callback) => {
    const query = `
      SELECT kp.payment_id, kp.nama, kp.email, kp.bukti_pembayaran, k.nama_konser, k.lokasi, k.tanggal, k.image, u.username,
             ktd.jenis_tiket, kp.total_harga, ktd.jumlah
      FROM konser_pembayaran kp
      JOIN konser k ON kp.konser_tiket_id = k.id
      LEFT JOIN users u ON kp.users_id = u.id
      LEFT JOIN konser_tiket_detail ktd ON kp.konser_tiket_id = ktd.konser_tiket_id
      ORDER BY kp.created_at DESC
    `;
    db.query(query, callback);
  }
};

module.exports = Konser;