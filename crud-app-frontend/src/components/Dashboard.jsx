import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal, Form, Button, Image } from "react-bootstrap";
import axios from "axios";

// Login
import Login from "./LoginComponents/LoginFormComponent";

// Carausel
import CarouselComponent from "./CarouselItemsComponentsHome/CarouselHomePage";
import CaraouselApp from "./CarouselItemsComponentsHome/CarauselApp";
import FormAddCarousel from "./CarouselItemsComponentsHome/FormAddCarousel";
import FormEditCarousel from "./CarouselItemsComponentsHome/FormEditCarousel";

// Films
import TiketApp from "./FilmsComponentsDashboard/FilmsApp";
import FormAddData from "./FilmsComponentsDashboard/FormAddFilm";
import FormEditData from "./FilmsComponentsDashboard/FormEditFilm";
import FilmsTerbaruComponents from "./FilmsComponentsDashboard/FilmsTerbaruComponents";

// Music
import MusicApp from "./MusicComponentsDashboard/MusicApp";
import FormAddMusic from "./MusicComponentsDashboard/FormAddMusic";
import FormEditMusic from "./MusicComponentsDashboard/FormEditMusic";
import MusicTerbaruComponents from "./MusicComponentsDashboard/MusicTerbaruComponents";

// Artist
import ArtistApp from "./ArtistComponentsDashboard/ArtistApp";
import FormAddArtist from "./ArtistComponentsDashboard/FormAddArtist";
import FormEditArtist from "./ArtistComponentsDashboard/FormEditArtist";

// Album
import AlbumApp from "./AlbumsComponentsDashboard/AlbumApp";
import FormAddAlbum from "./AlbumsComponentsDashboard/FormAddAlbum";
import FormEditAlbum from "./AlbumsComponentsDashboard/FormEditAlbum";

// Tiket Managemen
import TiketFilmBioskop from "./TiketComponentDashboard/TiketFilmApp";
import TiketKonserApp from "./TiketComponentDashboard/TiketKonserApp";
import AddTiketKonser from "./TiketComponentDashboard/AddTiketKonser";
import AddTiketFilm from "./TiketComponentDashboard/AddTiketFilm";
import KonserTiketJenisApp from "./TiketComponentDashboard/KonserTiketJenisApp";
import KelolaTiketFilmManagement from "./TiketComponentDashboard/FilmTiketJenis";

// User Findfun Management
import UsersFindFunApp from "./UsersComponentsDashboard/UsersFindFunApp";
// import FormAddUser from "./UserComponentDashboard/FormAddUser";
// import FormEditUser from "./UserComponentDashboard/FormEditUser";

import api from "../api/axios";

// Komponen baru untuk dashboard
const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [musicDropdownOpen, setMusicDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const image = localStorage.getItem("image");

  function isMenuActive(pathname, menu) {
    const regex = new RegExp(
      `^/dashboard/(${menu}($|/)|add${menu}|jenis${menu}|edit${menu}/)`
    );
    return regex.test(pathname);
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMusicDropdown = () => {
    setMusicDropdownOpen(!musicDropdownOpen);
  };

  const handleLogout = () => {
    // Menghapus token dari localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("image");

    Swal.fire({
      title: "Logout!",
      text: "Anda telah berhasil logout.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "/login";
    });
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`bg-slider text-white ${collapsed ? "p-2" : "p-3"}`}
        style={{
          minHeight: "100vh",
          width: collapsed ? "60px" : "250px",
          transition: "width 0.3s",
        }}
      >
        <div
          className="d-flex align-items-center mb-4"
          style={{ justifyContent: collapsed ? "center" : "space-between" }}
        >
          <div
            className="d-flex align-items-center justify-content-between gap-1"
            style={{ marginLeft: collapsed ? "0" : "16px" }}
          >
            {!collapsed && (
              <img
                src="/findfun.svg"
                alt="Logo"
                style={{ width: "30px", height: "30px" }}
              />
            )}
            {!collapsed && <h5 className="m-0">FindFun</h5>}
          </div>
          <button className="btn btn-sm btn-slider" onClick={toggleSidebar}>
            <i
              className={collapsed ? "bi bi-arrow-right" : "bi bi-arrow-left"}
            ></i>
          </button>
        </div>
        <div className="nav flex-column">
          <Link
            to="/dashboard"
            className={`nav-link text-start text-white border-0  mb-2 ${
              location.pathname === "/dashboard" || location.pathname === "/"
                ? "slider-active"
                : ""
            }`}
            style={{
              transition: "all 0.3s ease-in-out",
              width: collapsed ? "46px" : "100%",
            }}
          >
            <i className="bi bi-speedometer2 me-1"></i>
            {!collapsed && "Dashboard"}
          </Link>
          <Link
            to="/dashboard/films"
            className={`nav-link text-start text-white border-0 mb-2 ${
              isMenuActive(location.pathname, "films") ? "slider-active" : ""
            }`}
            style={{
              transition: "all 0.3s ease-in-out",
              width: collapsed ? "46px" : "100%",
            }}
          >
            <i className="bi bi-film me-2"></i>
            {!collapsed && "Data Film"}
          </Link>
          <div>
            <button
              className={`nav-link text-start text-white border-0 mb-2 ${
                isMenuActive(location.pathname, "music") ||
                isMenuActive(location.pathname, "albums")
                  ? "slider-active"
                  : ""
              }`}
              onClick={toggleMusicDropdown}
              style={{
                transition: "all 0.3s ease-in-out",
                width: collapsed ? "46px" : "100%",
              }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <i className="bi bi-file-music me-2"></i>
                  {!collapsed && "Data Music"}
                </div>

                <i
                  className={`bi ${
                    musicDropdownOpen ? "bi-chevron-up" : "bi-chevron-down"
                  } ms-2`}
                  style={{ display: collapsed ? "none" : "inline-block" }}
                ></i>
              </div>
            </button>

            {musicDropdownOpen && ( // Only show these if dropdown is open
              <div className={!collapsed && "ms-3"}>
                <Link
                  to="/dashboard/music"
                  className={`nav-link text-start text-white border-0 mb-2 ${
                    isMenuActive(location.pathname, "music")
                      ? "slider-active"
                      : ""
                  }`}
                  style={{
                    transition: "all 0.3s ease-in-out",
                    width: collapsed ? "46px" : "100%",
                  }}
                >
                  <i className="bi bi-music-note me-2"></i>
                  {!collapsed && "Music List"}
                </Link>

                <Link
                  to="/dashboard/albums"
                  className={`nav-link text-start text-white border-0 mb-2 ${
                    isMenuActive(location.pathname, "albums")
                      ? "slider-active"
                      : ""
                  }`}
                  style={{
                    transition: "all 0.3s ease-in-out",
                    width: collapsed ? "46px" : "100%",
                  }}
                >
                  <i className="bi bi-journal-text me-2"></i>
                  {!collapsed && "Albums"}
                </Link>
              </div>
            )}
          </div>
          <Link
            to="/dashboard/artists"
            className={`nav-link text-start text-white border-0 mb-2 ${
              isMenuActive(location.pathname, "artists") ? "slider-active" : ""
            }`}
            style={{
              transition: "all 0.3s ease-in-out",
              width: collapsed ? "46px" : "100%",
            }}
          >
            <i className="bi bi-person-badge me-2"></i>
            {!collapsed && "Data Artist"}
          </Link>
          <Link
            to="/dashboard/tiket/film"
            className={`nav-link text-start text-white border-0 mb-2 ${
              isMenuActive(location.pathname, "tiket") ? "slider-active" : ""
            }`}
            style={{
              transition: "all 0.3s ease-in-out",
              width: collapsed ? "46px" : "100%",
            }}
          >
            <i className="bi bi-ticket-detailed me-2"></i>
            {!collapsed && "Tiket Bioskop"}
          </Link>
          <Link
            to="/dashboard/konser"
            className={`nav-link text-start text-white border-0 mb-2 ${
              isMenuActive(location.pathname, "konser") ? "slider-active" : ""
            }`}
            style={{
              transition: "all 0.3s ease-in-out",
              width: collapsed ? "46px" : "100%",
            }}
          >
            <i className="bi bi-ticket-perforated me-2"></i>
            {!collapsed && "Tiket Konser"}
          </Link>
          <Link
            to="/dashboard/users"
            className={`nav-link text-start text-white border-0 mb-2 ${
              isMenuActive(location.pathname, "users") ? "slider-active" : ""
            }`}
            style={{
              transition: "all 0.3s ease-in-out",
              width: collapsed ? "46px" : "100%",
            }}
          >
            <i className="bi bi-people me-2"></i>
            {!collapsed && "Pengguna"}
          </Link>
          <Link
            to="/dashboard/settings"
            className={`nav-link text-start text-white border-0 mb-2 ${
              isMenuActive(location.pathname, "settings") ? "slider-active" : ""
            }`}
            style={{
              transition: "all 0.3s ease-in-out",
              width: collapsed ? "46px" : "100%",
            }}
          >
            <i className="bi bi-gear me-2"></i>
            {!collapsed && "Pengaturan"}
          </Link>
          <Link
            onClick={handleLogout}
            className={`nav-link text-start text-white border-0 mb-2 ${
              isMenuActive(location.pathname, "logout") ? "slider-active" : ""
            }`}
            style={{
              transition: "all 0.3s ease-in-out",
              width: collapsed ? "46px" : "100%",
            }}
          >
            <i className="bi bi-box-arrow-left me-2"></i>
            {!collapsed && "Logout"}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Header */}
        <header className="bg-header border-bottom p-3 d-flex justify-content-between align-items-center shadow-sm">
          <div>
            <h5 className="m-0 fw-bold">FinFun Management System</h5>
          </div>
          <div className="d-flex align-items-center">
            <div className="dropdown me-3">
              <button
                className="btn btn-sm btn-bell position-relative"
                type="button"
              >
                <i className="bi bi-bell"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  3
                </span>
              </button>
            </div>
            <div className="dropdown">
              <button className="btn d-flex align-items-center" type="button">
                <img
                  src={`http://localhost:3000/${image}`}
                  onError={(e) => {
                    e.target.src =
                      "https://static.vecteezy.com/system/resources/previews/002/470/447/original/default-user-image-profile-icon-free-vector.jpg";
                  }}
                  alt=""
                  className="rounded-circle me-2"
                  style={{ width: "30px", height: "30px" }}
                />
                {/* <div
                  className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-2"
                  style={{ width: "30px", height: "30px" }}
                >
                  A
                </div> */}
                <span>{username}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div
          className="p-4"
          style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<DashboardHome />} />
            {/* Route Carousel */}
            <Route path="/carousel" element={<Caraousel />} />
            <Route path="/addcarousel" element={<FormAddCarousel />} />
            <Route path="/editcarousel/:id" element={<FormEditCarousel />} />

            {/* Route Films */}
            <Route path="/films" element={<FilmsManagement />} />
            <Route path="/addfilms" element={<FormAddData />} />
            <Route path="/editfilms/:id" element={<FormEditData />} />
            {/* Route Music */}
            <Route path="/music" element={<MusicManagement />} />
            <Route path="/addmusic" element={<FormAddMusic />} />
            <Route path="/editmusic/:id" element={<FormEditMusic />} />
            {/* Route Artist */}
            <Route path="/artists" element={<ArtistManagement />} />
            <Route path="/addartists" element={<FormAddArtist />} />
            <Route path="/editartists/:id" element={<FormEditArtist />} />
            {/* Route Album */}
            <Route path="/albums" element={<AlbumManagement />} />
            <Route path="/addalbums" element={<FormAddAlbum />} />
            <Route path="/editalbums/:id" element={<FormEditAlbum />} />
            {/* Route Tiket Film */}
            <Route path="/tiket/film" element={<TiketFilmManagement />} />
            <Route path="/addtiket/film" element={<AddTiketFilm />} />
            <Route
              path="/jenistiket/film"
              element={<KelolaTiketFilmManagement />}
            />
            {/* Route Tiket Konser */}
            <Route path="/konser" element={<TiketKonserManagement />} />
            <Route path="/addkonser" element={<AddTiketKonser />} />
            <Route
              path="/konser/jenis-tiket"
              element={<KonserTiketJenisManagement />}
            />
            {/* Route User */}
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

// Dashboard Home Page
const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalFilms: 0,
    totalMusic: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch film count from API
  useEffect(() => {
    const fetchFilmCount = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/films");

        // Update stats with actual film count
        setStats((prevStats) => ({
          ...prevStats,
          totalFilms: data.data.length,
        }));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching film count:", error);
        setLoading(false);
      }
    };

    const fetchMusicCount = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/music");

        setStats((prevStats) => ({
          ...prevStats,
          totalMusic: data.data.length,
        }));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching Music count:", error);
        setLoading(false);
      }
    };

    const fetchUserCount = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/users");

        setStats((prevStats) => ({
          ...prevStats,
          totalUsers: data.data.length,
        }));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching User count:", error);
        setLoading(false);
      }
    };

    fetchFilmCount();
    fetchMusicCount();
    fetchUserCount();
  }, []);

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                  <i className="bi bi-film text-primary fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Film</h6>
                  <h4 className="mb-0">{stats.totalFilms}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-danger bg-opacity-10 p-3 rounded me-3">
                  <i className="bi bi-file-music text-danger fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Music</h6>
                  <h4 className="mb-0">{stats.totalMusic}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                  <i className="bi bi-people text-success fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Pengguna</h6>
                  <h4 className="mb-0">{stats.totalUsers}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="card-title m-0">
                Carousel Film Yang Sedang Tayang
              </h5>
              <Link to="/dashboard/carousel" className="btn btn-sm btn-add">
                Edit Carousel
              </Link>
            </div>
            <div className="card-body card-carousel-dashboard">
              <div
                className="rounded d-flex align-items-center justify-content-center "
                style={{ height: "433px" }}
              >
                <CarouselComponent className="rounded-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="card-title m-0">Film Terbaru</h5>
              <Link to="/dashboard/films" className="btn btn-sm btn-add">
                Lihat Semua
              </Link>
            </div>
            <FilmsTerbaruComponents />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="card-title m-0">Music Terbaru</h5>
              <Link to="/dashboard/music" className="btn btn-sm btn-add">
                Lihat Semua
              </Link>
            </div>
            <MusicTerbaruComponents />
          </div>
        </div>
      </div>
    </div>
  );
};

// Home Page Caraousel
const Caraousel = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Manajemen Caraousel FindFun</h4>
        <button
          className="btn btn-add"
          onClick={() => navigate("/dashboard/addcarousel")}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Tambah Film
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <CaraouselApp />
          </div>
        </div>
      </div>
    </div>
  );
};

// Films Management Page
const FilmsManagement = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Manajemen Film</h4>
        <button
          className="btn btn-add"
          onClick={() => navigate("/dashboard/addfilms")}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Tambah Film
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <TiketApp />
          </div>
        </div>
      </div>
    </div>
  );
};

// Music Management Page
const MusicManagement = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Manajemen Music</h4>
        <button
          className="btn btn-add"
          onClick={() => navigate("/dashboard/addmusic")}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Tambah Music
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <MusicApp />
          </div>
        </div>
      </div>
    </div>
  );
};

// Artists Management Page
const ArtistManagement = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Manajemen Artist</h4>
        <button
          className="btn btn-add"
          onClick={() => navigate("/dashboard/addartists")}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Tambah Artist
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <ArtistApp />
          </div>
        </div>
      </div>
    </div>
  );
};

// Album Management Page
const AlbumManagement = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Manajemen Album Artist</h4>
        <button
          className="btn btn-add"
          onClick={() => navigate("/dashboard/addalbums")}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Tambah Album
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <AlbumApp />
          </div>
        </div>
      </div>
    </div>
  );
};

// Tiket Management page
const TiketFilmManagement = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Manajemen Tiket Bioskop </h4>
        <div>
          <button
            className="btn btn-secondary me-2"
            onClick={() => navigate("/dashboard/jenistiket/film")}
          >
            <i className="bi bi-tags me-2"></i>
            Kelola Tiket Bioskop
          </button>
          <button
            className="btn btn-add"
            onClick={() => navigate("/dashboard/addtiket/film")}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Tambah Tiket
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <TiketFilmBioskop />
          </div>
        </div>
      </div>
    </div>
  );
};

// Tiket Konser Management page
const TiketKonserManagement = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Manajemen Tiket Konser </h4>
        <div>
          <button
            className="btn btn-secondary me-2"
            onClick={() => navigate("/dashboard/konser/jenis-tiket")}
          >
            <i className="bi bi-tags me-2"></i>
            Kelola Jenis Tiket
          </button>
          <button
            className="btn btn-add"
            onClick={() => navigate("/dashboard/addkonser")}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Tambah Tiket
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <TiketKonserApp />
          </div>
        </div>
      </div>
    </div>
  );
};

// Konser Tiket Jenis Management page
const KonserTiketJenisManagement = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Manajemen Jenis Tiket Konser</h4>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <KonserTiketJenisApp />
          </div>
        </div>
      </div>
    </div>
  );
};

// Users Management Page
const UsersManagement = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Daftar Pengguna FindFun</h4>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <div id="users-find-fun-app">
              <UsersFindFunApp />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Page
const SettingsPage = () => {
  return (
    <div>
      <h4 className="mb-4">Pengaturan</h4>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="card-title m-0">Pengaturan Situs</h5>
        </div>
        <div className="card-body">
          <div className="mb-3 row">
            <label htmlFor="siteName" className="col-sm-3 col-form-label">
              Nama Situs
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                id="siteName"
                defaultValue="Cinema Management System"
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="adminEmail" className="col-sm-3 col-form-label">
              Email Admin
            </label>
            <div className="col-sm-9">
              <input
                type="email"
                className="form-control"
                id="adminEmail"
                defaultValue="admin@example.com"
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="logoUpload" className="col-sm-3 col-form-label">
              Logo Situs
            </label>
            <div className="col-sm-9">
              <input type="file" className="form-control" id="logoUpload" />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-9 offset-sm-3">
              <button type="button" className="btn btn-primary">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="card-title m-0">Pengaturan Notifikasi</h5>
        </div>
        <div className="card-body">
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="emailNotif"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="emailNotif">
              Terima notifikasi melalui email
            </label>
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="newFilmNotif"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="newFilmNotif">
              Pemberitahuan film baru
            </label>
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="newUserNotif"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="newUserNotif">
              Pemberitahuan pengguna baru
            </label>
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="systemNotif"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="systemNotif">
              Pemberitahuan sistem
            </label>
          </div>
          <button type="button" className="btn btn-primary">
            Simpan Perubahan
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="card-title m-0">Pengaturan Keamanan</h5>
        </div>
        <div className="card-body">
          <div className="mb-3 row">
            <label
              htmlFor="currentPassword"
              className="col-sm-3 col-form-label"
            >
              Password Saat Ini
            </label>
            <div className="col-sm-9">
              <input
                type="password"
                className="form-control"
                id="currentPassword"
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="newPassword" className="col-sm-3 col-form-label">
              Password Baru
            </label>
            <div className="col-sm-9">
              <input
                type="password"
                className="form-control"
                id="newPassword"
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label
              htmlFor="confirmPassword"
              className="col-sm-3 col-form-label"
            >
              Konfirmasi Password
            </label>
            <div className="col-sm-9">
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
              />
            </div>
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="twoFactorAuth"
            />
            <label className="form-check-label" htmlFor="twoFactorAuth">
              Aktifkan Otentikasi Dua Faktor
            </label>
          </div>
          <div className="row">
            <div className="col-sm-9 offset-sm-3">
              <button type="button" className="btn btn-primary">
                Perbarui Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
