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
};

module.exports = User;
