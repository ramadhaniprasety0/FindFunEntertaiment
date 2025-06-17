import React from "react";
import { Row, Col, Form, Button, Image } from "react-bootstrap";

const ProfileComponent = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <Col lg={12} key={user.username || "profile"}>
      <div className="profile-container">
        <div className="profile-header-v2 position-relative rounded overflow-hidden">
          {/* Warna Hijau */}
          <div className="header-top px-3 pt-4 pb-5 d-flex justify-content-end">
            <Button variant="light" size="sm" className="ubah-button">
              <i className="bi bi-pencil-square me-1"></i> Ubah
            </Button>
          </div>

          {/* Warna Putih */}
          <div className="header-bottom bg-white px-4 py-4 d-flex align-items-center ps-5">
            <div style={{ marginLeft: "6rem" }}>
              <h5 className="mb-0">{user.name}</h5>
            </div>
          </div>

          {/* Foto Profil */}
          <div
            className="profile-image-wrapper position-absolute"
            style={{ top: "60px", left: "50px" }}
          >
            <Image
              src={user.profilePic} // Gunakan data dari prop
              roundedCircle
              width={80}
              height={80}
              className="profile-img-border"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/40x40/EBF4FA/1F2937?text=U";
              }}
            />
          </div>
        </div>

        <div className="mt-4">
          <Form className="profile-form">
            {/* Username */}
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">
                Username <span className="text-danger">*</span>
              </Form.Label>
              <Row className="align-items-center">
                <Col>
                  <Form.Control
                    type="text"
                    defaultValue={user.username} // Gunakan data dari prop
                    className="default-input"
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
                    defaultValue={user.email} // Gunakan data dari prop
                    className="default-input"
                  />
                </Col>
              </Row>
            </Form.Group>

            {/* Nama */}
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">
                Nama <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                defaultValue={user.name} // Gunakan data dari prop
                className="default-input"
              />
            </Form.Group>

            {/* Jenis Kelamin dan Tanggal Lahir */}
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label-custom">
                    Jenis Kelamin <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    defaultValue={user.gender} // Gunakan data dari prop
                    className="default-input custom-select-v3"
                  >
                    <option value="">Pilih...</option>
                    <option value="Pria">Pria</option>
                    <option value="Wanita">Wanita</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label-custom">
                    Tanggal Lahir <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    // Format tanggal YYYY-MM-DD untuk defaultValue
                    defaultValue={
                      user.birthDate ? user.birthDate.split("T")[0] : ""
                    }
                    className="default-input"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Tombol Simpan */}
            <Row>
              <Col className="text-center">
                <Button
                  variant="primary"
                  type="submit"
                  className="simpan-button v3"
                >
                  Simpan
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </Col>
  );
};

export default ProfileComponent;
