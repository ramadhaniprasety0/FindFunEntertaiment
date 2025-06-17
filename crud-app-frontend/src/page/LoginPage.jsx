import React from 'react';
import LoginForm from '../components/LoginComponents/LoginFormComponent';
import logo from '/findfun.svg'; 

const LoginPage = () => {
  return (
    <div className="login-page d-flex vh-100">
      {/* Kiri: Gambar dan sambutan */}
      <div className="login-left position-relative d-flex flex-column justify-content-center align-items-center text-white">
        <div className="position-absolute top-0 start-0 p-3">
          <img src={logo} alt="Logo" style={{ height: '40px' }} />
        </div>
        <div className="text-center px-4">
          <h2 className="fw-bold display-6 mb-2">Selamat Datang kembali!</h2>
          <p className="lead">Selamat datang kembali!<br />Masuk untuk berjumpa kembali!</p>
        </div>
        <p className="position-absolute bottom-0 mb-4 small fst-italic">Kill Bill - SZA</p>
      </div>

      {/* Kanan: Form login */}
      <div className="login-right d-flex justify-content-center align-items-center w-100">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
