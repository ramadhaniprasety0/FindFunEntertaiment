import React from 'react';
import RegisterForm from '../components/LoginComponents/RegisterFormComponent';
import logo from '/findfun.svg';

const RegisterPage = () => {
  return (
    <div className="register-page d-flex vh-100">
      {/* Kiri: Formulir */}
      <div className="register-left d-flex justify-content-center align-items-center w-100">
        <RegisterForm />
      </div>

      {/* Kanan: Gambar dan sambutan */}
      <div className="register-right position-relative d-none d-md-flex flex-column justify-content-center align-items-center text-white">
        <div className="position-absolute top-0 start-0 p-3">
          <img src={logo} alt="Logo" style={{ height: '40px' }} />
        </div>
        <div className="text-center px-4">
          <h2 className="fw-bold display-6 mb-2">Bergabunglah dengan kami!</h2>
          <p className="lead">
            Daftar Sekarang Gabung Dengan <br />
            Komunitas Findfun!
          </p>
        </div>
        <p className="position-absolute bottom-0 mb-4 small fst-italic">Drive - 2011</p>
      </div>
    </div>
  );
};

export default RegisterPage;
