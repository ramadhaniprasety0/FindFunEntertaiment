import { Navigate, Outlet } from 'react-router-dom';
import Swal from 'sweetalert2';

const PrivateRouteUser = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    Swal.fire({
      title: 'Anda harus login terlebih dahulu',
      text: 'Silakan login untuk melanjutkan.',
      icon: 'warning',
      confirmButtonText: 'OK',
    });
    return <Navigate to="/login" />;
  }

  // Pengguna dengan peran apapun (admin atau user) dapat mengakses rute ini
  // Tidak perlu pemeriksaan peran khusus karena semua pengguna yang sudah login dapat mengakses
  
  return <Outlet />;  
};

export default PrivateRouteUser;
