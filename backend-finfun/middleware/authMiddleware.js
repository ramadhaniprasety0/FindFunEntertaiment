const jwt = require("jsonwebtoken");

// Middleware untuk memverifikasi token JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Mengambil token dari header Authorization

  if (!token) {
    return res
      .status(401)
      .json({
        message: "Token tidak ditemukan. Silakan login terlebih dahulu.",
      });
  }

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid." });
    }

    req.user = user; // Menyimpan informasi pengguna ke dalam request
    next(); // Lanjutkan ke route berikutnya
  });
};

// Middleware untuk memverifikasi role admin
const isAdmin = (req, res, next) => {
  // Pastikan user sudah terautentikasi
  if (!req.user) {
    return res.status(401).json({ message: "Silakan login terlebih dahulu." });
  }

  // Periksa apakah user memiliki role admin
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({
        message:
          "Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini.",
      });
  }

  next(); // Lanjutkan ke route berikutnya jika user adalah admin
};

// Middleware untuk memverifikasi user sudah login
const isUser = (req, res, next) => {
  // Pastikan user sudah terautentikasi
  if (!req.user) {
    return res.status(401).json({ message: "Silakan login terlebih dahulu." });
  }

  // Lanjutkan ke route berikutnya jika user sudah login (baik admin maupun user biasa)
  next();
};

module.exports = { authenticateToken, isAdmin, isUser };
