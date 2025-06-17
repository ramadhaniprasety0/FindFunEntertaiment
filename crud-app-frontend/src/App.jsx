import { Routes, Route, } from "react-router-dom";
// Page Dashboard
import Dashboard from "./components/Dashboard";
import Login from "../src/page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import PrivateRoute from './components/PrivateRoute';

// Page User Umum
import PrivateRouteUser from "./components/PrivateRouteUser";
import MainLayout from "./MainLayout";
import HomePage from "./page/HomePage";
import FilmHomepage from "./page/Films/FilmsPage";
import MusicsPage from "./page/Musics/MusicsPage";
import DetailMusicsPage from "./page/Musics/DetailMusicsPage";
import DetailFilmPage from "./page/Films/DetailFilmsPage";
import ReviewFilmsPage from "./page/Films/ReviewFilmsPage";
import FormTiketFilm from "./page/Films/FormTiketFilmPage";
import PaymentFilmPage from "./page/Films/PaymentFilmPage";
import DetailKonserPage from "./page/Musics/DetailKonserPage";
import FormTiketKonser from "./page/Musics/FormTiketKonserPage";
import PaymentKonserPage from "./page/Musics/PaymentKonserPage";
import PopulerMusicsPage from "./page/Musics/PopulerMusicsPage";
import KonserMusicsPage from "./page/Musics/KonserMusicsPage";
import ForgotPasswordPage from "./page/ForgotPasswordPage";
import OTPVerificationPage from "./page/OTPVerificationPage";
import ResetPasswordPage from "./page/ResetPasswordPage";
import ProfilePage from "./page/ProfilePage";
import OrderHistoryPage from "./page/OrderHistoryPage";

// import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <div>
     
      <Routes>
        {/* Rute publik yang dapat diakses oleh semua pengguna */}
        <Route element={<MainLayout />}>
          <Route path="/*" element={<HomePage />} />
          <Route path="/films" element={<FilmHomepage />} />
          <Route path="/music" element={<MusicsPage />} />
          <Route path="/music/popular" element={<PopulerMusicsPage />} />
          <Route path="/music/konser" element={<KonserMusicsPage />} />
          <Route path="/music/:id" element={<DetailMusicsPage />} />
          <Route path="/films/detail/:id" element={<DetailFilmPage />} />
        </Route>

        {/* Rute yang dilindungi untuk pengguna yang sudah login (admin atau user) */}
        <Route element={<MainLayout />}>
          <Route element={<PrivateRouteUser />}>
            {/* Rute untuk pembelian tiket */}
            <Route path="/films/tiket/:id/bioskop" element={<FormTiketFilm />} />
            <Route path="/payment-tiket/:id/schedule/:tiketId" element={<PaymentFilmPage />} />
            {/* Rute untuk review film */}
            <Route path="/film/review/:id" element={<ReviewFilmsPage />} />

            {/* Route Untuk Konser */}
            <Route path="/music/konser/detail/:id" element={< DetailKonserPage />} />
            <Route path="/music/konser/detail/:id/form" element={< FormTiketKonser />} />
            <Route
              path="/payment-tiket/:id/konser/:paymentId"
              element={<PaymentKonserPage />}
            />

            {/* User Profile */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/order-history" element={<OrderHistoryPage />} />
          </Route>
        </Route>

        {/* Rute autentikasi */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<OTPVerificationPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Rute admin yang dilindungi */}
        <Route element={<PrivateRoute />}>
            <Route path="/dashboard/*" element={<Dashboard />} />
        </Route>

        // Tambahkan route ini di dalam komponen Routes
        
      </Routes>
      
    </div>
  )
}

export default App;
