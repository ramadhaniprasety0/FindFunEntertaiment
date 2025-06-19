import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { email, password });
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
        const userRole = response.data.user?.role || "user";
        if (userRole === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Username atau password salah");
    }
  };

  return (
    <div
      className="login-form text-center px-4 w-100"
    >
      <Form onSubmit={handleSubmit}>
        <h2 className="fw-bold mb-4" style={{ color: "#8e97fd", fontFamily: "Montserrat, Nunito, sans-serif", fontSize: "2.7rem" }}>Masuk</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3 text-start">
          <label className="form-label" style={{ color: "#8e97fd", fontWeight:600 }}>Email atau nama pengguna</label>
          <input
            type="email"
            className="form-control rounded-4 border-0 px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              background: "#dcddff",
              border: "none",
              fontSize: "1.1rem",
              fontStyle: "italic"
            }}
          />
        </div>

        <div className="mb-3 text-start position-relative">
          <label className="form-label" style={{ color: "#8e97fd", fontWeight:600 }}>Kata sandi</label>
          <input
            type={showPass ? "text" : "password"}
            className="form-control rounded-4 border-0 px-3 py-2"
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              background: "#dcddff",
              border: "none",
              fontSize: "1.1rem",
              fontStyle: "italic"
            }}
          />
          <span
            onClick={() => setShowPass(!showPass)}
            style={{
              position: "absolute",
              right: "18px",
              top: "38px",
              cursor: "pointer",
              color: "#8e97fd",
              fontSize: "1.2rem",
              opacity: 0.7
            }}
            tabIndex={0}
            aria-label="Tampilkan kata sandi"
          >
            {showPass ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
          </span>
        </div>

        <Button
          type="submit"
          className="btn btn-primary rounded-pill px-4 py-2 mb-3 d-block mx-auto"
          style={{
            background: "#8e97fd",
            border: "none",
            fontWeight: 600,
            fontSize: "1.1rem",
            fontFamily: "Montserrat, Nunito, sans-serif"
          }}
        >
          Masuk
        </Button>
      </Form>
      <hr style={{borderColor:'#e3e6ff'}}/>
      <p className="small" style={{fontSize:'0.97rem'}}>
        Tidak punya akun?{" "}
        <Link to="/Register" className="text-decoration-none" style={{ color: "#8e97fd", fontWeight: 600 }}>
          Daftar disini
        </Link>
      </p>
      <p className="text-muted small" style={{fontStyle:'italic', fontSize:'0.97rem'}}>
        <Link to="/forgot-password" className="text-decoration-none" style={{ color: "#8e97fd" }}>
          Lupa kata sandi Anda?
        </Link>
      </p>
      <p className="mt-5 text-muted fst-italic" style={{fontSize:'1rem'}}>FindFun - 2025</p>
    </div>
  );
};

export default LoginForm;