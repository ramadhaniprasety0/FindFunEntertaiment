import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/forgot-password", { email });

      Swal.fire({
        title: "Kode OTP Terkirim!",
        text: "Silakan cek email Anda untuk kode OTP",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Redirect ke halaman verifikasi OTP dengan email sebagai parameter
        window.location.href = `/verify-otp?email=${encodeURIComponent(email)}`;
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="forgot-password-form text-center px-4 w-100"
      style={{ maxWidth: "400px" }}
    >
      <Form onSubmit={handleSubmit}>
        <h2 className="fw-bold mb-4" style={{ color: "#8e97fd" }}>
          Lupa Kata Sandi
        </h2>
        <p className="mb-4">Masukkan email Anda untuk menerima kode OTP</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3 text-start">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control rounded-4 bg-light border-0 px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="btn btn-primary rounded-pill px-4 py-2 mb-3 d-block mx-auto"
          disabled={loading}
        >
          {loading ? "Mengirim..." : "Kirim Kode OTP"}
        </Button>
      </Form>
      <hr />
      <p className="small">
        <Link
          to="/login"
          className="text-decoration-none"
          style={{ color: "#8e97fd" }}
        >
          Kembali ke halaman login
        </Link>
      </p>

      <p className="mt-5 text-muted fst-italic">FindFun - 2025</p>
    </div>
  );
};

export default ForgotPasswordForm;
