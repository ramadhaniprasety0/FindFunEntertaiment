import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    
    const params = new URLSearchParams(location.search);
    const userIdParam = params.get('userId');
    
    if (userIdParam) {
      setUserId(userIdParam);
    } else {
    
      navigate('/forgot-password');
    }
  }, [location, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validasi password
    if (password !== confirmPassword) {
      setError('Kata sandi dan konfirmasi kata sandi tidak cocok');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Kata sandi minimal harus 6 karakter');
      setLoading(false);
      return;
    }
    
    try {
      await api.post('/reset-password', { userId, password });
      
      Swal.fire({
        title: 'Berhasil!',
        text: 'Kata sandi Anda telah berhasil diubah',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/login');
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengubah kata sandi');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="reset-password-form text-center px-4 w-100" style={{ maxWidth: '400px' }}>
      <Form onSubmit={handleSubmit}>
        <h2 className="text-primary fw-bold mb-4">Reset Kata Sandi</h2>
        <p className="mb-4">Buat kata sandi baru untuk akun Anda</p>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="mb-3 text-start position-relative">
          <label className="form-label">Kata Sandi Baru</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-control rounded-4 bg-light border-0 px-3 py-2 pe-5"
            placeholder="Kata Sandi Baru (min. 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i 
            className={`bi bi-eye${showPassword ? '-slash' : ''} position-absolute top-50 end-0 translate-middle-y me-3`}
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: 'pointer', zIndex: 100 }}
          ></i>
        </div>
        
        <div className="mb-3 text-start position-relative">
          <label className="form-label">Konfirmasi Kata Sandi</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            className="form-control rounded-4 bg-light border-0 px-3 py-2 pe-5"
            placeholder="Konfirmasi Kata Sandi Baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <i 
            className={`bi bi-eye${showConfirmPassword ? '-slash' : ''} position-absolute top-50 end-0 translate-middle-y me-3`}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ cursor: 'pointer', zIndex: 100 }}
          ></i>
        </div>
        
        <Button
          type="submit"
          className="btn btn-primary rounded-pill px-4 py-2 mb-3 d-block mx-auto"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
        </Button>
      </Form>
      
      <p className="mt-5 text-muted fst-italic">FindFun - 2025</p>
    </div>
  );
};

export default ResetPasswordForm;