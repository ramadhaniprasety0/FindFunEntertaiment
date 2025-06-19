import React from 'react';
import LoginForm from '../components/LoginComponents/LoginFormComponent';
import logo from '/findfun.svg';

const LoginPage = () => {
  return (
    <div className="login-page d-flex vh-100">
      {/* Kiri: Gambar dan sambutan */}
      <div className="login-left position-relative d-flex flex-column justify-content-center align-items-center">
        <div className="position-absolute top-0 start-0 p-4" style={{zIndex:2}}>
          <img src={logo} alt="Logo" style={{ height: '48px' }} />
        </div>
        <div className="text-center px-4" style={{zIndex:2}}>
          <h2 className="fw-bold mb-2" style={{fontSize: '2.7rem', fontFamily: 'Montserrat, Nunito, sans-serif'}}>Selamat Datang<br/>kembali!</h2>
          <p className="lead mb-0" style={{fontSize:'1.25rem', fontWeight:500}}>Selamat datang kembali!<br/>Masuk untuk berjumpa kembali!</p>
        </div>
        <p className="position-absolute bottom-0 mb-4 small fst-italic" style={{zIndex:2, fontSize:'1rem'}}>Kill Bill - SZA</p>
        <div className="login-left-overlay"></div>
      </div>

      {/* Kanan: Form login */}
      <div className="login-right d-flex flex-column justify-content-center align-items-center w-100">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;