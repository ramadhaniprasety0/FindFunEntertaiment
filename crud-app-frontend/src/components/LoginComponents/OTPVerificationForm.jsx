import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const OTPVerificationForm = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Ambil email dari query parameter
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Redirect ke halaman lupa password jika tidak ada email
      navigate('/forgot-password');
    }
  }, [location, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/verify-otp', { email, otp });
      
      // Simpan userId untuk digunakan di halaman reset password
      const userId = response.data.userId;
      
      Swal.fire({
        title: 'Verifikasi Berhasil!',
        text: 'Silakan buat kata sandi baru Anda',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Redirect ke halaman reset password dengan userId dan email sebagai parameter
        navigate(`/reset-password?userId=${userId}&email=${encodeURIComponent(email)}`);
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Kode OTP tidak valid atau sudah kedaluwarsa');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="otp-verification-form text-center px-4 w-100" style={{ maxWidth: '400px' }}>
      <Form onSubmit={handleSubmit}>
        <h2 className="fw-bold mb-4" style={{color:"#8e97fd"}}>Verifikasi OTP</h2>
        <p className="mb-4">Masukkan kode OTP yang telah dikirim ke email {email}</p>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="mb-3 text-start">
          <label className="form-label">Kode OTP</label>
          <input
            type="text"
            className="form-control rounded-4 bg-light border-0 px-3 py-2"
            placeholder="Masukkan 6 digit kode OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
        </div>
        
        <Button
          type="submit"
          className="btn btn-primary rounded-pill px-4 py-2 mb-3 d-block mx-auto"
          disabled={loading}
        >
          {loading ? 'Memverifikasi...' : 'Verifikasi OTP'}
        </Button>
      </Form>
      <hr />
      <p className="small">
        <Link to="/forgot-password" className="text-decoration-none">Kirim ulang kode OTP</Link>
      </p>
      
      <p className="mt-5 text-muted fst-italic">FindFun - 2025</p>
    </div>
  );
};

export default OTPVerificationForm;