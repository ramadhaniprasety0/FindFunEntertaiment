import React, { useState, useEffect } from "react";
import ProfileComponent from "../components/LoginComponents/ProfileComponent";
import { Container, Row, Spinner, Alert } from "react-bootstrap";

const ProfilePage = () => {
  // State untuk menyimpan data user yang sudah diambil
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data dari localStorage saat komponen dimuat
    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      const email = localStorage.getItem('email');
      const name = localStorage.getItem('name') || username; // Gunakan username jika nama lengkap tidak ada
      const imageUrl = localStorage.getItem('image');
      
      // Jika token atau username tidak ada, anggap belum login
      if (token && username) {
        // Bentuk objek user yang akan dikirim sebagai prop
        const userObject = {
          username,
          name,
          email,
          profilePic: (imageUrl && imageUrl !== 'null') ? `http://localhost:3000/${imageUrl}` : 'https://via.placeholder.com/80',
          // Tambahkan data lain jika ada di localStorage
          gender: localStorage.getItem('gender') || 'Pria', 
          birthDate: localStorage.getItem('birth_date') || '2000-01-01',
        };
        setCurrentUser(userObject);
      }
    } catch (error) {
      console.error("Gagal membaca data dari localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []); // Array kosong berarti effect ini hanya berjalan sekali saat mount

  if (loading) {
    return <Container className="text-center my-5"><Spinner /></Container>;
  }

  if (!currentUser) {
    return <Container className="text-center my-5"><Alert variant="warning">Anda harus login untuk melihat halaman ini.</Alert></Container>;
  }

  return (
    <div className="edit-profile-wrapper w-100 min-vh-100">
      <Container className='my-5'>
        <h1 className="mb-4">
          <b>Edit Profile</b>
        </h1>
        <Row>
          <ProfileComponent user={currentUser} />
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;