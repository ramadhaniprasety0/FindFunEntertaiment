import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Table, Button, Modal, Form, Tabs, Tab, Badge, Image } from "react-bootstrap";
import Swal from "sweetalert2";

const UsersFindFunApp = () => {
  // State untuk menyimpan data
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk modal edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // State untuk modal tambah pengguna
  const [showAddModal, setShowAddModal] = useState(false);

  // Fungsi untuk mendapatkan data pengguna
  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users`);
      setUsers(response.data.data);
      filterUsers(response.data.data, activeTab);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Gagal mengambil data pengguna");
      setLoading(false);
    }
  };

  // Filter pengguna berdasarkan tab aktif
  const filterUsers = (userList, tab) => {
    let filtered = [...userList];

    // Filter berdasarkan tab
    if (tab === "admin") {
      filtered = filtered.filter((user) => user.role === "admin");
    } else if (tab === "user") {
      filtered = filtered.filter((user) => user.role === "user");
    }

    // Filter berdasarkan pencarian
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  // Efek untuk memuat data saat komponen dimuat
  useEffect(() => {
    getUsers();

    // Menambahkan event listener untuk refresh
    const handleRefresh = () => {
      getUsers();
    };

    const element = document.getElementById("users-find-fun-app");
    if (element) {
      element.addEventListener("refresh", handleRefresh);
    }

    return () => {
      if (element) {
        element.removeEventListener("refresh", handleRefresh);
      }
    };
  }, []);

  // Efek untuk filter data saat tab atau pencarian berubah
  useEffect(() => {
    filterUsers(users, activeTab);
  }, [activeTab, searchTerm]);

  // Handler untuk perubahan tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handler untuk pencarian
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handler untuk membuka modal tambah pengguna
  const handleShowAddModal = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "user",
    });
    setImageFile(null);
    setImagePreview(
      `${import.meta.env.VITE_API_URL_IMAGE}/uploads/system/no-pictures.png`
    );
    setShowAddModal(true);
  };

  // Handler untuk submit form tambah
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", formData.role);
      
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      await api.post(
        `/register/dashboar/users`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Pengguna berhasil ditambahkan",
      });

      setShowAddModal(false);
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "user",
      });
      setImageFile(null);
      setImagePreview(
        `${import.meta.env.VITE_API_URL_IMAGE}/uploads/system/no-pictures.png`
      );
      
      getUsers(); 
    } catch (error) {
      console.error("Error adding user:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal menambahkan pengguna",
      });
    }
  };

  //  modal edit
  const handleEditClick = (user) => {
    setEditUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: "",
    });
    setImagePreview(
      user.image
        ? `${import.meta.env.VITE_API_URL_IMAGE}/${user.image}`
        : `${import.meta.env.VITE_API_URL_IMAGE}/uploads/system/no-pictures.png`
    );
    setShowEditModal(true);
  };

  // untuk perubahan form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // untuk perubahan gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // submit form edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      
      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }
      
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      // Update profil pengguna
      await api.put(
        `/users/${editUser.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Ubah Role User
      if (formData.role !== editUser.role) {
        await api.put(
          `/users/${editUser.id}/role`,
          { role: formData.role },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Profil pengguna berhasil diperbarui",
      });

      setShowEditModal(false);
      getUsers(); // Refresh data
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memperbarui profil pengguna",
      });
    }
  };

  // Handler untuk menghapus pengguna
  const handleDeleteClick = (userId) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Pengguna akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/users/${userId}`);

          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Pengguna berhasil dihapus",
          });

          getUsers(); // Refresh data
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Gagal menghapus pengguna",
          });
        }
      }
    });
  };

  // Render loading state
  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div className="text-center py-5 text-danger">{error}</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Tabs
            activeKey={activeTab}
            onSelect={handleTabChange}
            className="mb-3"
          >
            <Tab eventKey="all" title={<span style={{ color: "#333" }}>Semua Pengguna</span>} />
            <Tab eventKey="admin" title={<span style={{ color: "#333" }}>Admin</span>} />
            <Tab eventKey="user" title={<span style={{ color: "#333" }}>User</span>} />
          </Tabs>

          <div className="d-flex">
            <Form.Group className="d-flex me-2">
              <Form.Control
                type="text"
                placeholder="Cari pengguna..."
                value={searchTerm}
                onChange={handleSearch}
                className="me-2"
              />
            </Form.Group>
            <Button variant="primary" onClick={handleShowAddModal}>
              <i className="bi bi-plus-circle me-2"></i>
              Tambah Pengguna
            </Button>
          </div>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>No</th>
            <th>Foto</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Tanggal Dibuat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                Tidak ada data pengguna
              </td>
            </tr>
          ) : (
            filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>
                  <Image
                    src={
                      user.image
                        ? `${import.meta.env.VITE_API_URL_IMAGE}/${user.image}`
                        : `${import.meta.env.VITE_API_URL_IMAGE}/uploads/system/no-pictures.png`
                    }
                    alt={user.username}
                    roundedCircle
                    width="40"
                    height="40"
                    className="object-fit-cover"
                  />
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <Badge bg={user.role === "admin" ? "danger" : "primary"}>
                    {user.role}
                  </Badge>
                </td>
                <td>
                  {new Date(user.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditClick(user)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteClick(user.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal Edit User */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Pengguna</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <div className="text-center mb-4">
              <Image
                src={imagePreview}
                alt="Preview"
                roundedCircle
                width="100"
                height="100"
                className="object-fit-cover"
              />
              <Form.Group className="mt-3">
                <Form.Label>Foto Profil</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password (Kosongkan jika tidak ingin mengubah)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="Masukkan password baru"
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => setShowEditModal(false)}
              >
                Batal
              </Button>
              <Button variant="primary" type="submit">
                Simpan Perubahan
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Tambah User */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Tambah Pengguna Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <div className="text-center mb-4">
              <Image
                src={imagePreview}
                alt="Preview"
                roundedCircle
                width="100"
                height="100"
                className="object-fit-cover"
              />
              <Form.Group className="mt-3">
                <Form.Label>Foto Profil</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => setShowAddModal(false)}
              >
                Batal
              </Button>
              <Button variant="primary" type="submit">
                Tambah Pengguna
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UsersFindFunApp;