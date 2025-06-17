import React, { useState, useRef } from "react";
import { Row, Col, Form, Button, Image, Alert } from "react-bootstrap";
import api from "../../api/axios";

const ProfileComponent = ({ user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    password: "",
    confirmPassword: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  if (!user) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Membuat preview gambar
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({
        type: "danger",
        text: "Password dan konfirmasi password tidak cocok!",
      });
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);

      // Tambahkan password hanya jika diisi
      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }

      // Tambahkan file gambar jika ada
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      // Kirim permintaan update profil dengan FormData
      const response = await api.put("/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update token di localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      setMessage({
        type: "success",
        text: "Profil berhasil diperbarui!",
      });

      // Panggil fungsi callback jika ada
      if (onProfileUpdate) {
        onProfileUpdate(response.data.user);
      }

      // Reset form password dan gambar
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });
      setSelectedImage(null);
      setImagePreview(null);

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "danger",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui profil",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Col lg={12} key={user.username || "profile"}>
      <div className="profile-container">
        <div className="profile-header-v2 position-relative rounded overflow-hidden">
          {/* Warna Hijau */}
          <div className="header-top px-3 pt-4 pb-5 d-flex justify-content-end">
            <Button
              variant="light"
              size="sm"
              className="ubah-button"
              onClick={() => setIsEditing(!isEditing)}
            >
              <i className="bi bi-pencil-square me-1"></i>{" "}
              {isEditing ? "Batal" : "Ubah"}
            </Button>
          </div>

          {/* Warna Putih */}
          <div className="header-bottom bg-white px-4 py-4 d-flex align-items-center ps-5">
            <div style={{ marginLeft: "6rem" }}>
              <h5 className="mb-0">{user.username}</h5>
            </div>
          </div>

          {/* Foto Profil */}
          <div
            className="profile-image-wrapper position-absolute"
            style={{ top: "60px", left: "50px" }}
            onClick={handleImageClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
              accept="image/*"
            />
            <Image
              src={
                imagePreview ||
                `${import.meta.env.VITE_API_URL_IMAGE}/${user.image}`
              }
              roundedCircle
              width={80}
              height={80}
              className={`profile-img-border ${
                isEditing ? "cursor-pointer" : ""
              }`}
              style={isEditing ? { cursor: "pointer" } : {}}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  `${import.meta.env.VITE_API_URL_IMAGE}/uploads/system/no-pictures.png`;
              }}
            />
            {isEditing && (
              <div
                className="image-overlay position-absolute"
                style={{
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "50%",
                  opacity: 0,
                  transition: "opacity 0.3s",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseOut={(e) => (e.currentTarget.style.opacity = 0)}
              >
                <i
                  className="bi bi-camera text-white"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          {message.text && (
            <Alert variant={message.type} className="mb-3">
              {message.text}
            </Alert>
          )}

          <Form className="profile-form" onSubmit={handleSubmit}>
            {isEditing && (
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  Foto Profil
                </Form.Label>
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <Image
                      src={
                        imagePreview ||
                        `${import.meta.env.VITE_API_URL_IMAGE}/${user.image}`
                      }
                      roundedCircle
                      width={80}
                      height={80}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          `${import.meta.env.VITE_API_URL_IMAGE}/uploads/system/no-pictures.png`;
                      }}
                    />
                  </div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <i className="bi bi-upload me-1"></i> Pilih Foto
                  </Button>
                  {selectedImage && (
                    <span className="ms-3 text-muted">
                      {selectedImage.name}
                    </span>
                  )}
                </div>
              </Form.Group>
            )}

            {/* Username */}
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">
                Username <span className="text-danger">*</span>
              </Form.Label>
              <Row className="align-items-center">
                <Col>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="default-input"
                    disabled={!isEditing}
                  />
                </Col>
              </Row>
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">
                Email <span className="text-danger">*</span>
              </Form.Label>
              <Row className="align-items-center">
                <Col>
                  <Form.Control
                    type="email"
                    defaultValue={user.email}
                    className="default-input"
                    disabled
                  />
                </Col>
              </Row>
            </Form.Group>

            {isEditing && (
              <>
                <h6 className="mt-5">Ubah Password (Opsional)</h6>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">
                    Masukan Password Baru
                  </Form.Label>
                  <Row className="align-items-center">
                    <Col>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="default-input"
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">
                    Konfirmasi Password Baru
                  </Form.Label>
                  <Row className="align-items-center">
                    <Col>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="default-input"
                      />
                    </Col>
                  </Row>
                </Form.Group>

                {/* Tombol Simpan */}
                <Row>
                  <Col className="text-center">
                    <Button
                      variant="primary"
                      type="submit"
                      className="simpan-button v3"
                      disabled={loading}
                    >
                      {loading ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </Form>
        </div>
      </div>
    </Col>
  );
};

export default ProfileComponent;
