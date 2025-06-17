const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const jwt = require("jsonwebtoken"); // Tambahkan import ini

const profileController = {
  // Mendapatkan profil pengguna berdasarkan ID
  getProfile: (req, res) => {
    const userId = req.params.id || req.user.id;
    
    User.getProfileById(userId, (err, results) => {
      if (err) {
        console.error('Error fetching user profile:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil profil pengguna' });
      }
      
      if (!results || results.length === 0) {
        return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
      }
      
      const user = results[0];
      
      // Mengembalikan data profil pengguna
      res.json({
        status: 'success',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          image: user.image,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      });
    });
  },
  
  // Memperbarui profil pengguna
  updateProfile: (req, res) => {
    const userId = req.params.id || req.user.id;
    const { username, email, password } = req.body;
    let image = req.user.image; // Default ke image yang sudah ada
    
    // Jika ada file gambar yang diunggah
    if (req.file) {
      // Hapus gambar lama jika ada
      if (image) {
        const oldImagePath = path.join(__dirname, '..', image);
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error('Error deleting old profile image:', err);
        }
      }
      
      // Gunakan path gambar baru
      image = req.file.path;
    }
    
    // Buat objek untuk update data
    const updateData = {
      username: username || req.user.username,
      email: email || req.user.email,
      image: image
    };
    
    // Fungsi callback setelah update profil
    const handleProfileUpdate = (err, result) => {
      if (err) {
        console.error('Error updating user profile:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui profil pengguna' });
      }
      
      // Buat token baru dengan data yang diperbarui
      const token = jwt.sign(
        {
          id: userId,
          email: updateData.email,
          role: req.user.role,
          username: updateData.username,
          image: updateData.image,
        },
        'your_secret_key',
        { expiresIn: '1h' }
      );
      
      // Mengembalikan respons sukses dengan token baru
      res.json({
        status: 'success',
        message: 'Profil berhasil diperbarui',
        token: token,
        user: {
          id: userId,
          username: updateData.username,
          email: updateData.email,
          role: req.user.role,
          image: updateData.image
        }
      });
    };
    
    // Jika password disediakan, update password juga
    if (password) {
      User.updateProfileWithPassword(userId, updateData, password, handleProfileUpdate);
    } else {
      // Jika tidak ada password, hanya update profil
      User.updateProfile(userId, updateData, handleProfileUpdate);
    }
  }
};

module.exports = profileController;