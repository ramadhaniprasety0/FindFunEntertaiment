import React from 'react';
import ForgotPasswordForm from '../components/LoginComponents/ForgotPasswordForm';
import logo from '/findfun.svg';

const ForgotPasswordPage = () => {
  return (
    <div className="forgot-password-page d-flex vh-100">
      {/* Kiri: Gambar dan sambutan */}
      <div className="login-left position-relative d-flex flex-column justify-content-center align-items-center text-white">
        <div className="position-absolute top-0 start-0 p-3">
          <img src={logo} alt="Logo" style={{ height: '40px' }} />
        </div>
        <div className="text-center px-4">
          <h2 className="fw-bold display-6 mb-2">Lupa Kata Sandi?</h2>
          <p className="lead">Jangan khawatir!<br />Kami akan membantu Anda mengatur ulang kata sandi.</p>
        </div>
        <p className="position-absolute bottom-0 mb-4 small fst-italic">FindFun - Temukan Hiburan Anda</p>
      </div>

      {/* Kanan: Form lupa password */}
      <div className="login-right d-flex justify-content-center align-items-center w-100">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;