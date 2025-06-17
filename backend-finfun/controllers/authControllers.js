const User = require("../models/userModel");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating JWT token
const sgMail = require("@sendgrid/mail");

// Konfigurasi SendGrid API Key
sgMail.setApiKey(
  "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"
); // Ganti dengan API key SendGrid Anda

const authController = {
  login: (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (!results || results.length === 0) {
        return res
          .status(401)
          .json({ message: "Username atau password salah" });
      }

      const user = results[0];

      // Compare password with hashed password in DB
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json({ message: "Server error" });

        if (!isMatch) {
          return res
            .status(401)
            .json({ message: "Username atau password salah" });
        }

        // Create JWT token with role information
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role || "user",
            username: user.username,
            image: user.image,
          },
          "your_secret_key",
          { expiresIn: "1h" }
        );

        res.json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            image: user.image,
            role: user.role || "user",
          },
        });
      });
    });
  },

  register: (req, res) => {
    const { email, username, password, role } = req.body;

    console.log("Received registration data:", req.body);

    // Mengecek apakah email sudah terdaftar
    User.findByEmail(email, (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      if (results && results.length > 0) {
        return res.status(400).json({ message: "Email sudah terdaftar" });
      }

      // Menambahkan pengguna baru ke dalam database dengan role default 'user'
      User.create(
        { email, username, password, role: role || "user" },
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Gagal mendaftar pengguna" });
          }

          // Mengirimkan respons sukses
          res.status(201).json({ message: "Pengguna berhasil didaftarkan" });
        }
      );
    });
  },

  // Fungsi untuk membuat admin (hanya bisa diakses oleh admin yang sudah ada)
  createAdmin: (req, res) => {
    const { email, username, password } = req.body;

    // Verifikasi bahwa yang membuat request adalah admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Akses ditolak. Hanya admin yang dapat membuat admin baru.",
      });
    }

    // Cek apakah email sudah terdaftar
    User.findByEmail(email, (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      if (results && results.length > 0) {
        return res.status(400).json({ message: "Email sudah terdaftar" });
      }

      // Buat user baru dengan role admin
      User.create(
        { email, username, password, role: "admin" },
        (err, result) => {
          if (err) {
            return res.status(500).json({ message: "Gagal mendaftar admin" });
          }

          res.status(201).json({ message: "Admin berhasil didaftarkan" });
        }
      );
    });
  },

  // Fungsi untuk meminta reset password menggunakan SendGrid
  forgotPassword: (req, res) => {
    const { email } = req.body;

    // Cek apakah email terdaftar
    User.findByEmail(email, (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (!results || results.length === 0) {
        return res.status(404).json({ message: "Email tidak terdaftar" });
      }

      const user = results[0];

      // Generate OTP 6 digit
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Set waktu kedaluwarsa OTP (15 menit dari sekarang)
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 15);

      // Simpan OTP ke database
      User.saveResetToken(email, otp, expires, (err) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Gagal menyimpan token reset" });

        // Kirim email dengan OTP menggunakan SendGrid
        const msg = {
          to: email,
          from: "findfun.entertaimen@gmail.com", // Harus email terverifikasi di SendGrid
          subject: "Reset Password FindFun",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4a6ee0;">Reset Password FindFun</h2>
              <p>Kami menerima permintaan untuk reset password akun Anda.</p>
              <p>Berikut adalah kode OTP Anda:</p>
              <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
                ${otp}
              </div>
              <p>Kode OTP ini akan kedaluwarsa dalam 15 menit.</p>
              <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
              <p>Terima kasih,<br>Tim FindFun</p>
            </div>
          `,
        };

        sgMail
          .send(msg)
          .then(() => {
            res.json({ message: "Kode OTP telah dikirim ke email Anda" });
          })
          .catch((error) => {
            console.error("Error sending email:", error);
            return res.status(500).json({ message: "Gagal mengirim email" });
          });
      });
    });
  },

  // Fungsi untuk verifikasi OTP
  verifyOTP: (req, res) => {
    const { email, otp } = req.body;

    User.findByEmail(email, (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (!results || results.length === 0) {
        return res.status(404).json({ message: "Email tidak terdaftar" });
      }

      const user = results[0];

      // Cek apakah OTP valid dan belum kedaluwarsa
      if (user.reset_token !== otp) {
        return res.status(400).json({ message: "Kode OTP tidak valid" });
      }

      const now = new Date();
      const tokenExpires = new Date(user.reset_token_expires);

      if (now > tokenExpires) {
        return res.status(400).json({ message: "Kode OTP sudah kedaluwarsa" });
      }

      // OTP valid
      res.json({
        message: "Verifikasi OTP berhasil",
        userId: user.id,
      });
    });
  },

  // Fungsi untuk reset password
  resetPassword: (req, res) => {
    const { userId, password } = req.body;

    // Validasi password
    if (password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    // Update password
    User.updatePassword(userId, password, (err) => {
      if (err)
        return res.status(500).json({ message: "Gagal mengubah password" });

      res.json({ message: "Password berhasil diubah" });
    });
  },
};

module.exports = authController;
