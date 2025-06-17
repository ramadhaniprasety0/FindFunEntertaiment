const Konser = require("../models/konserModel");
const fs = require("fs");

const konserControllers = {
  // ===== CONTROLLER UNTUK KONSER =====
  getAll: (req, res) => {
    Konser.getAll((err, results) => {
      if (err) {
        console.error("Error fetching konser:", err);
        return res.status(500).json({ error: "Failed to fetch konser" });
      }
      res.json({
        success: true,
        data: results,
        count: results.length,
      });
    });
  },

  getById: (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    Konser.getById(id, (err, result) => {
      if (err) {
        console.error("Error fetching konser:", err);
        return res.status(500).json({ error: "Failed to fetch konser" });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({ error: "Konser not found" });
      }

      const konserData = result[0];

      // Ambil jenis tiket untuk konser ini
      Konser.getAllJenisTiket(id, (err, jenisTiket) => {
        if (err) {
          console.error("Error fetching jenis tiket:", err);
          return res.status(500).json({ error: "Failed to fetch jenis tiket" });
        }

        konserData.jenis_tiket = jenisTiket;

        // Ambil artis untuk konser ini
        Konser.getKonserArtists(id, (err, artists) => {
          if (err) {
            console.error("Error fetching konser artists:", err);
            return res
              .status(500)
              .json({ error: "Failed to fetch konser artists" });
          }

          konserData.artists = artists;

          res.json({
            success: true,
            data: konserData,
          });
        });
      });
    });
  },

  create: (req, res) => {
    const { nama_konser, deskripsi_acara, lokasi, tanggal } = req.body;

    console.log(req.body);
    console.log(req.file);
    let jenis_tiket = [];
    let selected_artists = [];

    // Validasi input
    if (!nama_konser || !lokasi || !tanggal) {
      return res
        .status(400)
        .json({ error: "Nama konser, lokasi, dan tanggal harus diisi" });
    }

    // Parse jenis_tiket jika ada
    if (req.body.jenis_tiket) {
      try {
        jenis_tiket = JSON.parse(req.body.jenis_tiket);

        // Validasi format jenis_tiket
        if (!Array.isArray(jenis_tiket)) {
          return res
            .status(400)
            .json({ error: "Format jenis_tiket tidak valid" });
        }

        for (const tiket of jenis_tiket) {
          if (!tiket.jenis_tiket || !tiket.harga) {
            return res
              .status(400)
              .json({
                error: "Setiap jenis tiket harus memiliki nama dan harga",
              });
          }
        }
      } catch (error) {
        return res
          .status(400)
          .json({ error: "Format jenis_tiket tidak valid" });
      }
    }

    // Parse selected_artists jika ada
    if (req.body.selected_artists) {
      try {
        selected_artists = JSON.parse(req.body.selected_artists);

        // Validasi format selected_artists
        if (!Array.isArray(selected_artists)) {
          return res
            .status(400)
            .json({ error: "Format selected_artists tidak valid" });
        }
      } catch (error) {
        return res
          .status(400)
          .json({ error: "Format selected_artists tidak valid" });
      }
    }

    // Siapkan data konser
    const konserData = {
      nama_konser,
      deskripsi_acara,
      lokasi,
      tanggal,
      jenis_tiket,
      selected_artists,
    };

    console.log(konserData);

    // Tambahkan image jika ada
    if (req.file) {
      konserData.image = req.file.path.replace(/\\/g, "/");
    }

    Konser.create(konserData, (err, result) => {
      if (err) {
        console.error("Error creating konser:", err);
        return res.status(500).json({ error: "Failed to create konser" });
      }

      res.status(201).json({
        success: true,
        message: "Konser berhasil dibuat",
        data: result,
      });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const { nama_konser, deskripsi_acara, lokasi, tanggal } = req.body;
    let selected_artists = [];

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Validasi input
    if (!nama_konser || !lokasi || !tanggal) {
      return res
        .status(400)
        .json({ error: "Nama konser, lokasi, dan tanggal harus diisi" });
    }

    // Parse selected_artists jika ada
    if (req.body.selected_artists) {
      try {
        selected_artists = JSON.parse(req.body.selected_artists);

        // Validasi format selected_artists
        if (!Array.isArray(selected_artists)) {
          return res
            .status(400)
            .json({ error: "Format selected_artists tidak valid" });
        }
      } catch (error) {
        return res
          .status(400)
          .json({ error: "Format selected_artists tidak valid" });
      }
    }

    // Cek apakah konser ada
    Konser.getById(id, (err, result) => {
      if (err) {
        console.error("Error fetching konser:", err);
        return res.status(500).json({ error: "Failed to fetch konser" });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({ error: "Konser not found" });
      }

      const oldImage = result[0].image;

      // Siapkan data konser
      const konserData = {
        nama_konser,
        deskripsi_acara,
        lokasi,
        tanggal,
        selected_artists,
      };

      // Tambahkan image jika ada
      if (req.file) {
        konserData.image = req.file.path.replace(/\\/g, "/");

        // Hapus image lama jika ada
        if (oldImage && fs.existsSync(oldImage)) {
          fs.unlinkSync(oldImage);
        }
      }

      Konser.update(id, konserData, (err, result) => {
        if (err) {
          console.error("Error updating konser:", err);
          return res.status(500).json({ error: "Failed to update konser" });
        }

        res.json({
          success: true,
          message: "Konser berhasil diupdate",
          data: { id, ...konserData },
        });
      });
    });
  },

  delete: (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Cek apakah konser ada
    Konser.getById(id, (err, result) => {
      if (err) {
        console.error("Error fetching konser:", err);
        return res.status(500).json({ error: "Failed to fetch konser" });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({ error: "Konser not found" });
      }

      const image = result[0].image;

      Konser.delete(id, (err, result) => {
        if (err) {
          console.error("Error deleting konser:", err);
          return res.status(500).json({ error: "Failed to delete konser" });
        }

        // Hapus image jika ada
        if (image && fs.existsSync(image)) {
          fs.unlinkSync(image);
        }

        res.json({
          success: true,
          message: "Konser berhasil dihapus",
        });
      });
    });
  },

  // ===== CONTROLLER UNTUK JENIS TIKET =====
  getAllJenisTiket: (req, res) => {
    const konserId = req.params.konserId;

    if (!konserId || isNaN(konserId)) {
      return res.status(400).json({ error: "Invalid konser ID format" });
    }

    Konser.getAllJenisTiket(konserId, (err, results) => {
      if (err) {
        console.error("Error fetching jenis tiket:", err);
        return res.status(500).json({ error: "Failed to fetch jenis tiket" });
      }

      res.json({
        success: true,
        data: results,
        count: results.length,
      });
    });
  },

  createJenisTiket: (req, res) => {
    const { konser_id, jenis_tiket, harga } = req.body;

    // Validasi input
    if (!konser_id || !jenis_tiket || !harga) {
      return res
        .status(400)
        .json({ error: "Konser ID, jenis tiket, dan harga harus diisi" });
    }

    Konser.createJenisTiket(
      { konser_id, jenis_tiket, harga },
      (err, result) => {
        if (err) {
          console.error("Error creating jenis tiket:", err);
          return res
            .status(500)
            .json({ error: "Failed to create jenis tiket" });
        }

        res.status(201).json({
          success: true,
          message: "Jenis tiket berhasil dibuat",
          data: { id: result.insertId, konser_id, jenis_tiket, harga },
        });
      }
    );
  },

  updateJenisTiket: (req, res) => {
    const id = req.params.id;
    const { jenis_tiket, harga } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Validasi input
    if (!jenis_tiket || !harga) {
      return res
        .status(400)
        .json({ error: "Jenis tiket dan harga harus diisi" });
    }

    Konser.updateJenisTiket(id, { jenis_tiket, harga }, (err, result) => {
      if (err) {
        console.error("Error updating jenis tiket:", err);
        return res.status(500).json({ error: "Failed to update jenis tiket" });
      }

      res.json({
        success: true,
        message: "Jenis tiket berhasil diupdate",
        data: { id, jenis_tiket, harga },
      });
    });
  },

  deleteJenisTiket: (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    Konser.deleteJenisTiket(id, (err, result) => {
      if (err) {
        console.error("Error deleting jenis tiket:", err);
        return res.status(500).json({ error: "Failed to delete jenis tiket" });
      }

      res.json({
        success: true,
        message: "Jenis tiket berhasil dihapus",
      });
    });
  },

  // ===== CONTROLLER UNTUK TIKET KONSER (PEMESANAN) =====
  getAllTiket: (req, res) => {
    Konser.getAllTiket((err, results) => {
      if (err) {
        console.error("Error fetching tiket konser:", err);
        return res.status(500).json({ error: "Failed to fetch tiket konser" });
      }

      res.json({
        success: true,
        data: results,
        count: results.length,
      });
    });
  },

  getTiketById: (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    Konser.getTiketById(id, (err, result) => {
      if (err) {
        console.error("Error fetching tiket konser:", err);
        return res.status(500).json({ error: "Failed to fetch tiket konser" });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({ error: "Tiket konser not found" });
      }

      res.json({
        success: true,
        data: result[0],
      });
    });
  },

  getTiketByUserId: (req, res) => {
    const userId = req.params.userId;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    Konser.getTiketByUserId(userId, (err, results) => {
      if (err) {
        console.error("Error fetching tiket konser:", err);
        return res.status(500).json({ error: "Failed to fetch tiket konser" });
      }

      res.json({
        success: true,
        data: results,
        count: results.length,
      });
    });
  },

  getDetailPembayaran: (req, res) => {
        const paymentId = req.params.paymentId;

        Pembayaran.getDetailById(paymentId, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Server error.' });
            }
            if (result.length === 0) {
                return res.status(404).json({ success: false, message: 'Data pembayaran tidak ditemukan.' });
            }
            res.status(200).json({ success: true, data: result[0] });
        });
    },
    
  createTiket: (req, res) => {
    const { nama_konser, deskripsi_acara, lokasi, tanggal, jenis_tiket } =
      req.body;
    const user_id = req.user.id; // Dari middleware authenticateToken
    const email = req.user.email; // Dari middleware authenticateToken

    // Validasi input
    if (!nama_konser || !lokasi || !tanggal || !jenis_tiket) {
      return res
        .status(400)
        .json({
          error: "Nama konser, lokasi, tanggal, dan jenis tiket harus diisi",
        });
    }

    let parsedJenisTiket;
    try {
      parsedJenisTiket =
        typeof jenis_tiket === "string" ? JSON.parse(jenis_tiket) : jenis_tiket;

      // Validasi format jenis_tiket
      if (!Array.isArray(parsedJenisTiket) || parsedJenisTiket.length === 0) {
        return res
          .status(400)
          .json({ error: "Format jenis tiket tidak valid atau kosong" });
      }

      for (const tiket of parsedJenisTiket) {
        if (!tiket.jenis_tiket || !tiket.harga || !tiket.jumlah) {
          return res
            .status(400)
            .json({
              error:
                "Setiap jenis tiket harus memiliki nama, harga, dan jumlah",
            });
        }
      }
    } catch (error) {
      return res.status(400).json({ error: "Format jenis tiket tidak valid" });
    }

    // Siapkan data tiket
    const tiketData = {
      user_id,
      nama_konser,
      deskripsi_acara,
      email,
      lokasi,
      tanggal,
      jenis_tiket: parsedJenisTiket,
    };

    // Tambahkan poster jika ada
    if (req.file) {
      tiketData.poster = req.file.path.replace(/\\/g, "/");
    }

    Konser.createTiket(tiketData, (err, result) => {
      if (err) {
        console.error("Error creating tiket konser:", err);
        return res.status(500).json({ error: "Failed to create tiket konser" });
      }

      res.status(201).json({
        success: true,
        message: "Pemesanan tiket konser berhasil dibuat",
        data: result,
      });
    });
  },

  // ===== CONTROLLER UNTUK PEMBAYARAN =====
  updatePaymentStatus: (req, res) => {
    const paymentId = req.params.id;
    const { status } = req.body;

    if (!paymentId || isNaN(paymentId)) {
      return res.status(400).json({ error: "Invalid payment ID format" });
    }

    // Validasi status
    if (!status || !["PENDING", "ACCEPT", "REJECT"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Status harus PENDING, ACCEPT, atau REJECT" });
    }

    Konser.updatePaymentStatus(paymentId, status, (err, result) => {
      if (err) {
        console.error("Error updating payment status:", err);
        return res
          .status(500)
          .json({ error: "Failed to update payment status" });
      }

      res.json({
        success: true,
        message: `Status pembayaran berhasil diubah menjadi ${status}`,
        data: { id: paymentId, status },
      });
    });
  },

  updateBuktiPembayaran: (req, res) => {
    const paymentId = req.params.id;

    if (!paymentId || isNaN(paymentId)) {
      return res.status(400).json({ error: "Invalid payment ID format" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Bukti pembayaran harus diupload" });
    }

    const buktiPembayaran = req.file.path.replace(/\\/g, "/");

    // Cek apakah pembayaran ada
    Konser.getPaymentById(paymentId, (err, result) => {
      if (err) {
        console.error("Error fetching payment:", err);
        return res.status(500).json({ error: "Failed to fetch payment" });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({ error: "Payment not found" });
      }

      const oldBukti = result[0].bukti_pembayaran;

      Konser.updateBuktiPembayaran(
        paymentId,
        buktiPembayaran,
        (err, result) => {
          if (err) {
            console.error("Error updating bukti pembayaran:", err);
            return res
              .status(500)
              .json({ error: "Failed to update bukti pembayaran" });
          }

          // Hapus bukti pembayaran lama jika ada
          if (oldBukti && fs.existsSync(oldBukti)) {
            fs.unlinkSync(oldBukti);
          }

          res.json({
            success: true,
            message: "Bukti pembayaran berhasil diupload",
            data: { id: paymentId, bukti_pembayaran: buktiPembayaran },
          });
        }
      );
    });
  },

  getPaymentById: (req, res) => {
    const paymentId = req.params.id;

    if (!paymentId || isNaN(paymentId)) {
      return res.status(400).json({ error: "Invalid payment ID format" });
    }

    Konser.getPaymentById(paymentId, (err, result) => {
      if (err) {
        console.error("Error fetching payment:", err);
        return res.status(500).json({ error: "Failed to fetch payment" });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({ error: "Payment not found" });
      }

      res.json({
        success: true,
        data: result[0],
      });
    });
  },

  getPaymentDetails: (req, res) => {
    const paymentId = req.params.id;

    if (!paymentId || isNaN(paymentId)) {
      return res.status(400).json({ error: "Invalid payment ID format" });
    }

    Konser.getPaymentDetails(paymentId, (err, results) => {
      if (err) {
        console.error("Error fetching payment details:", err);
        return res
          .status(500)
          .json({ error: "Failed to fetch payment details" });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({ error: "Payment not found" });
      }

      // Reformat data untuk mengelompokkan detail tiket
      const payment = results[0];
      const tiketDetails = results.map((item) => ({
        jenis_tiket: item.jenis_tiket,
        harga: item.harga,
        jumlah: item.jumlah,
      }));

      // Hapus properti detail dari payment object
      delete payment.jenis_tiket;
      delete payment.harga;
      delete payment.jumlah;

      payment.tiket_details = tiketDetails;

      res.json({
        success: true,
        data: payment,
      });
    });
  },

  getAllPayments: (req, res) => {
    Konser.getAllPayments((err, results) => {
      if (err) {
        console.error("Error fetching payments:", err);
        return res.status(500).json({ error: "Failed to fetch payments" });
      }

      res.json({
        success: true,
        data: results,
        count: results.length,
      });
    });
  },
};

module.exports = konserControllers;
