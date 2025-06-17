const Ulasan = require("../models/ulasanModel");

const ulasanControllers = {
  getAll: (req, res) => {
    Ulasan.getAll((err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json(result);
      }
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Ulasan.getById(id, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({
          success: true,
          data: result,
          count: result.length,
        });
      }
    });
  },

  create: (req, res) => {
    console.log("Received ulasan data:", req.body);

    const ulasan = req.body;
    ulasan.user_id = req.user.id;

    if (!ulasan) {
      res.status(400).json({ error: "Missing ulasan data" });
      return;
    }

    Ulasan.create(ulasan, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json(result);
      }
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const ulasan = req.body;

    // Pastikan user hanya bisa mengupdate ulasan miliknya sendiri
    Ulasan.getById(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "Ulasan not found" });
      }

      if (result[0].user_id !== req.user.id) {
        return res
          .status(403)
          .json({ error: "You can only update your own reviews" });
      }

      Ulasan.update(id, ulasan, (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res
            .status(200)
            .json({ message: "Ulasan updated successfully", id: id });
        }
      });
    });
  },

  delete: (req, res) => {
    const id = req.params.id;

    // Pastikan user hanya bisa menghapus ulasan miliknya sendiri
    Ulasan.getById(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "Ulasan not found" });
      }

      if (result[0].user_id !== req.user.id) {
        return res
          .status(403)
          .json({ error: "You can only delete your own reviews" });
      }

      Ulasan.delete(id, (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res
            .status(200)
            .json({ message: "Ulasan deleted successfully", id: id });
        }
      });
    });
  },

  getByFilmId: (req, res) => {
    const filmId = req.params.filmId;
    Ulasan.getByFilmId(filmId, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }
      res.json({
        success: true,
        data: result,
        count: result.length,
      });
    });
  },

  getByMusicId: (req, res) => {
    const musicId = req.params.musicId;
    Ulasan.getByMusicId(musicId, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json(result);
      }
    });
  },

  getByAlbumId: (req, res) => {
    const albumId = req.params.albumId;
    Ulasan.getByAlbumId(albumId, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json(result);
      }
    });
  },

  getByUserId: (req, res) => {
    const userId = req.params.userId;
    Ulasan.getByUserId(userId, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json(result);
      }
    });
  },
};

module.exports = ulasanControllers;
