import React, { useState, useEffect } from "react";
import api from "../api/axios";
import ProfileComponent from "../components/LoginComponents/ProfileComponent";
import { Container, Row, Spinner, Alert } from "react-bootstrap";

const ProfilePage = () => {
  // State untuk menyimpan data user yang sudah diambil
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const getProfile = async () => {
    try {
      const {data} = await api.get(`/profile/${userId}`);
      setCurrentUser(data.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Fungsi untuk menangani pembaruan profil
  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  useEffect(() => {
    getProfile();
  }, []);

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
          <ProfileComponent user={currentUser} onProfileUpdate={handleProfileUpdate} />
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;