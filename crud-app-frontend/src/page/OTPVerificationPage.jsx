import React from 'react';
import OTPVerificationForm from '../components/LoginComponents/OTPVerificationForm';
import logo from '/findfun.svg';

const OTPVerificationPage = () => {
  return (
    <div className="otp-verification-page d-flex vh-100">
      {/* Kiri: Gambar dan sambutan */}
      <div className="login-left position-relative d-flex flex-column justify-content-center align-items-center text-white">
        <div className="position-absolute top-0 start-0 p-3">
          <img src={logo} alt="Logo" style={{ height: '40px' }} />
        </div>
        <div className="text-center px-4">
          <h2 className="fw-bold display-6 mb-2">Verifikasi OTP</h2>
          <p className="lead">Kami telah mengirimkan kode OTP<br />ke email Anda.</p>
        </div>
        <p className="position-absolute bottom-0 mb-4 small fst-italic">FindFun - Temukan Hiburan Anda</p>
      </div>

      {/* Kanan: Form verifikasi OTP */}
      <div className="login-right d-flex justify-content-center align-items-center w-100">
        <OTPVerificationForm />
      </div>
    </div>
  );
};

export default OTPVerificationPage;