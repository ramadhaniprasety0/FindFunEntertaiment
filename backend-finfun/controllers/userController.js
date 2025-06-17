const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const userController = {
  // Mendapatkan semua pengguna
  getAllUsers: (req, res) => {
    User.getAllUsers((err, results) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ error: 'Gagal mengambil data pengguna' });
      }
      res.json({ data: results });
    });
  },

  // Mendapatkan pengguna berdasarkan role
  getUsersByRole: (req, res) => {
    const { role } = req.params;
    
    if (!role || (role !== 'admin' && role !== 'user')) {
      return res.status(400).json({ error: 'Role tidak valid' });
    }

    User.getUsersByRole(role, (err, results) => {
      if (err) {
        console.error('Error fetching users by role:', err);
        return res.status(500).json({ error: 'Gagal mengambil data pengguna' });
      }
      res.json({ data: results });
    });
  },

  // Mendapatkan detail pengguna berdasarkan ID
  getUserById: (req, res) => {
    const userId = req.params.id;

    User.getProfileById(userId, (err, results) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ error: 'Gagal mengambil data pengguna' });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
      }

      res.json({ data: results[0] });
    });
  },

  // Mengupdate role pengguna
  updateUserRole: (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role || (role !== 'admin' && role !== 'user')) {
      return res.status(400).json({ error: 'Role tidak valid' });
    }

    User.updateRole(userId, role, (err, result) => {
      if (err) {
        console.error('Error updating user role:', err);
        return res.status(500).json({ error: 'Gagal mengupdate role pengguna' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
      }

      res.json({ message: 'Role pengguna berhasil diupdate' });
    });
  },

  // Mengupdate profil pengguna
  updateUser: (req, res) => {
    const userId = req.params.id || req.user.id;
    const { username, email, password } = req.body;
    let image = req.user.image;

    if (req.file) {
      if(image){
        const oldImagePath = path.join(__dirname, '..', image);
        try{
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err){
          console.error('Error deleting old profile image:', err)
        }
      }

      image = req.file.path;
    }

    // Jika tidak ada file yang diupload, gunakan image yang sudah ada
    if (!image) {
      User.getProfileById(userId, (err, results) => {
        if (err || !results || results.length === 0) {
          return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
        }
        
        image = results[0].image;
        processUpdate();
      });
    } else {
      processUpdate();
    }

    function processUpdate() {
      const updateData = {
        username: username,
        email: email,
        image: image
      };

      const handleProfileUpdate = (err, result) => {
        if (err) {
          console.error('Error updating user:', err);
          return res.status(500).json({ error: 'Gagal mengupdate pengguna' });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
        }

        res.json({
          message: 'Profil pengguna berhasil diupdate',
          user: {
            id: userId,
            username: updateData.username,
            email: email,
            image: image
          }
        });
      };

      if (password) {
        User.updateProfileWithPassword(userId, updateData, password, handleProfileUpdate);
      } else {
        User.updateProfile(userId, updateData, handleProfileUpdate);
      }
    }
  },

  // Menghapus pengguna
  deleteUser: (req, res) => {
    const userId = req.params.id;
    console.log(userId);
    User.deleteUser(userId, (err, result) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ error: 'Gagal menghapus pengguna' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
      }

      res.json({ message: 'Pengguna berhasil dihapus' });
    });
  }
};

module.exports = userController;