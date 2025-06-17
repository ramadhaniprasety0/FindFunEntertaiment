const db = require('../db');
const bcrypt = require('bcrypt'); 

const User = {
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  },

  create: (userData, callback) => {
    const { email, username, password, role } = userData;
    // Default role adalah 'user' jika tidak disediakan
    const userRole = role || 'user';

    // Hash password sebelum disimpan di database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return callback(err);
      }

      // Menyimpan pengguna baru dengan password yang sudah di-hash dan role
      db.query('INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)', 
        [email, username, hashedPassword, userRole], callback);
    });
  },

  createWithDashboard: (userData, callback) => {
    const { email, username, password, role, image } = userData;
    // Default role adalah 'user' jika tidak disediakan
    const userRole = role || 'user';

    // Hash password sebelum disimpan di database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return callback(err);
      }

      // Menyimpan pengguna baru dengan password yang sudah di-hash, role, dan image
      const query = image 
        ? 'INSERT INTO users (email, username, password, role, image) VALUES (?, ?, ?, ?, ?)'
        : 'INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)';
      
      const params = image 
        ? [email, username, hashedPassword, userRole, image]
        : [email, username, hashedPassword, userRole];

      db.query(query, params, callback);
    });
  },

  // Menambahkan fungsi untuk mendapatkan user berdasarkan ID
  findById: (id, callback) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], callback);
  },

  // Menambahkan fungsi untuk mengupdate role user
  updateRole: (userId, role, callback) => {
    db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId], callback);
  },

  // Fungsi untuk menyimpan token reset password
  saveResetToken: (email, token, expires, callback) => {
    db.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [token, expires, email],
      callback
    );
  },

  // Fungsi untuk mencari user berdasarkan token reset
  findByResetToken: (token, callback) => {
    db.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token],
      callback
    );
  },

  // Fungsi untuk update password
  updatePassword: (userId, password, callback) => {
    // Hash password baru sebelum disimpan
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return callback(err);
      }
      
      db.query(
        'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
        [hashedPassword, userId],
        callback
      );
    });
  },
  
  // Fungsi untuk mendapatkan profil user berdasarkan ID
  getProfileById: (userId, callback) => {
    db.query(
      'SELECT id, email, username, role, image, created_at, updated_at FROM users WHERE id = ?',
      [userId],
      callback
    );
  },
  
  // Fungsi untuk memperbarui profil user tanpa password
  updateProfile: (userId, userData, callback) => {
    const { username, email, image } = userData;
    
    db.query(
      'UPDATE users SET username = ?, email = ?, image = ?, updated_at = NOW() WHERE id = ?',
      [username, email, image, userId],
      callback
    );
  },
  
  // Fungsi baru untuk memperbarui profil user dengan password
  updateProfileWithPassword: (userId, userData, password, callback) => {
    const { username, email, image } = userData;
    
    // Hash password baru sebelum disimpan
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return callback(err);
      }
      
      db.query(
        'UPDATE users SET username = ?, email = ?, image = ?, password = ?, updated_at = NOW() WHERE id = ?',
        [username, email, image, hashedPassword, userId],
        callback
      );
    });
  },

  // Fungsi untuk mendapatkan semua pengguna
  getAllUsers: (callback) => {
    db.query(
      'SELECT id, email, username, role, image, created_at, updated_at FROM users ORDER BY created_at DESC',
      callback
    );
  },

  // Fungsi untuk mendapatkan pengguna berdasarkan role
  getUsersByRole: (role, callback) => {
    db.query(
      'SELECT id, email, username, role, image, created_at, updated_at FROM users WHERE role = ? ORDER BY created_at DESC',
      [role],
      callback
    );
  },

  // Fungsi untuk menghapus pengguna
  deleteUser: (userId, callback) => {
    db.query('DELETE FROM users WHERE id = ?', [userId], callback);
  }
};

module.exports = User;
