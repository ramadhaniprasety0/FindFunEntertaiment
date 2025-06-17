import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; // Ganti import axios dengan api dari file axios.js
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", { // Hapus URL hardcoded, gunakan endpoint relatif
        email,
        password,
      });
      setError(null);
      localStorage.setItem("token", response.data.token);

      if (response.data.user && response.data.user.role) {
        localStorage.setItem("userRole", response.data.user.role);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("image", response.data.user.image);
        localStorage.setItem("userId", response.data.user.id);
      }

      Swal.fire({
        title: "Selamat datang!",
        text: "Anda telah berhasil login.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Redirect based on user role
        const userRole = response.data.user?.role || "user";

        if (userRole === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      });
    } catch (error) {
      setError(err.response?.data?.message || "Username atau password salah");
    }
  };

  return (
    <div
      className="login-form text-center px-4 w-100"
      style={{ maxWidth: "400px" }}
    >
      <Form onSubmit={handleSubmit}>
        <h2 className="fw-bold mb-4" style={{color: "#8e97fd"}}>Masuk</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3 text-start">
          <label className="form-label">Email atau nama pengguna</label>
          <input
            type="email"
            className="form-control rounded-4 bg-light border-0 px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3 text-start">
          <label className="form-label">Kata sandi</label>
          <input
            type="password"
            className="form-control rounded-4 bg-light border-0 px-3 py-2"
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="btn btn-primary rounded-pill px-4 py-2 mb-3 d-block mx-auto"
        >
          Masuk
        </Button>
      </Form>
      <hr />
      <p className="small">
        Tidak punya akun?{" "}
        <Link to="/Register" className="text-decoration-none">
          Daftar disini
        </Link>
      </p>
      <p className="text-muted small">
        <Link to="/forgot-password" className="text-decoration-none">
          Lupa kata sandi Anda?
        </Link>
      </p>

      <p className="mt-5 text-muted fst-italic">FindFun - 2025</p>
    </div>
  );
};

export default LoginForm;
