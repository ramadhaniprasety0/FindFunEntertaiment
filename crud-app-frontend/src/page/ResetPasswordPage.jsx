import React from 'react';
import ResetPasswordForm from '../components/LoginComponents/ResetPasswordForm';
import logo from '/findfun.svg';

const ResetPasswordPage = () => {
  return (
    <div className="reset-password-page d-flex vh-100">
      {/* Kiri: Gambar dan sambutan */}
      <div className="login-left position-relative d-flex flex-column justify-content-center align-items-center text-white">
        <div className="position-absolute top-0 start-0 p-3">
          <img src={logo} alt="Logo" style={{ height: '40px' }} />
        </div>
        <div className="text-center px-4">
          <h2 className="fw-bold display-6 mb-2">Reset Kata Sandi</h2>
          <p className="lead">Buat kata sandi baru<br />untuk akun Anda.</p>
        </div>
        <p className="position-absolute bottom-0 mb-4 small fst-italic">FindFun - Temukan Hiburan Anda</p>
      </div>

      {/* Kanan: Form reset password */}
      <div className="login-right d-flex justify-content-center align-items-center w-100">
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;