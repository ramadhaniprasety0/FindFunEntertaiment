import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const RegisterForm = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validasi di sisi client
    if (password !== repeatPassword) {
      setError("Kata sandi dan ulangi kata sandi tidak cocok.");
      return;
    }
    if (password.length < 6) {
      setError("Kata sandi minimal harus 6 karakter.");
      return;
    }

    try {
      // Panggil API register di backend
      await api.post("/register", {
        username,
        email,
        password,
      });

      // Tampilkan notifikasi sukses
      Swal.fire({
        title: "Pendaftaran Berhasil!",
        text: "Anda akan diarahkan ke halaman login.",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        navigate("/login"); // Arahkan ke halaman login setelah sukses
      });
    } catch (err) {
      // Tangani error dari backend
      setError(
        err.response?.data?.error || "Pendaftaran gagal. Silakan coba lagi."
      );
    }
  };

  return (
    <div
      className="register-form text-center px-4 w-100"
      style={{ maxWidth: "400px" }}
    >
      <form
        onSubmit={handleSubmit}
        className="register-form text-center px-4 w-100"
        style={{ maxWidth: "370px" }}
      >
        <h2 className="fw-bold mb-4">Daftar</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3 text-start">
          <label className="form-label">Nama*</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nama"
            value={username}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3 text-start">
          <label className="form-label">Email*</label>
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3 text-start position-relative">
          <label className="form-label">Kata Sandi*</label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control pe-5"
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <span
            className="custom-eye-icon"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={0}
            role="button"
            aria-label={
              showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"
            }
          >
            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
          </span>
        </div>

        <div className="mb-3 text-start position-relative">
          <label className="form-label">Ulangi Kata Sandi</label>
          <input
            type={showRepeatPassword ? "text" : "password"}
            className="form-control pe-5"
            placeholder="Kata Sandi"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <span
            className="custom-eye-icon"
            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
            tabIndex={0}
            role="button"
            aria-label={
              showRepeatPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"
            }
          >
            <i
              className={`bi ${showRepeatPassword ? "bi-eye-slash" : "bi-eye"}`}
            ></i>
          </span>
        </div>

        <button type="submit" className="btn btn-primary">
          Daftar
        </button>
      </form>
      <hr />
      <p className="small">
        Sudah punya akun?{" "}
        <Link to="/Login" className="text-decoration-none">
          Masuk disini
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
