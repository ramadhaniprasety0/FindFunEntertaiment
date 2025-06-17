import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import {
  Navbar,
  Container,
  Nav,
  Form,
  Row,
  Col,
  NavDropdown,
  Image,
} from "react-bootstrap";


const NavbarComponents = () => {
  const [changeColor, setChangeColor] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");
      const userRole = localStorage.getItem("userRole");
      const imageUrl = localStorage.getItem("image");
      setLoggedInUser({
        userId,
        name: username,
        role: userRole,
        profilePic:
          imageUrl && imageUrl !== "null"
            ? `http://localhost:3000/${imageUrl}`
            : null,
      });
    }
  }, [location]);

  const changeBackgroundColor = () => {
    if (window.scrollY > 10 || location.pathname !== "/") {
      setChangeColor(true);
    } else {
      setChangeColor(false);
    }
  };

  useEffect(() => {
    changeBackgroundColor();
    window.addEventListener("scroll", changeBackgroundColor);
    return () => {
      window.removeEventListener("scroll", changeBackgroundColor);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    localStorage.removeItem("image");
    setLoggedInUser(null);
    navigate("/");
  };

  const dropdownLinks = [
    { id: 1, path: "/profile", text: "Edit Profil" },
    {id: 2, path: "/order-history", text:"Pesanan Saya"},
    ...(loggedInUser && loggedInUser.role === "admin"
      ? [{ id: 4, path: "/admin/dashboard", text: "Dashboard" }]
      : []),
    { id: 3, onClick: handleLogout, text: "Logout" },
  ];

  return (
    <div>
      <Navbar expand="lg" className={changeColor ? "color-active" : ""}>
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="montserrat-font fw-bold fs-3 text-white"
          >
            <img
              src="/findfun.svg"
              alt="FindFun"
              width="30"
              height="30"
              className="me-2"
            />
            FindFun
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto text-center align-items-center gap-2">
              <div className="nav-link">
                <NavLink
                  to="/films"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Films
                </NavLink>
                <NavLink
                  to="/music"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Music
                </NavLink>
              </div>
              <Form inline="true" className="d-flex align-items-center">
                <Row>
                  <Col xs="auto">
                    <div className="search-box position-relative">
                      <input
                        type="text"
                        className="form-control pe-5"
                        placeholder="Cari..."
                      />
                      <i className="fa-solid fa-magnifying-glass position-absolute top-50 end-0 translate-middle-y pe-3"></i>
                    </div>
                  </Col>
                  <Col xs="auto">
                    <div className="mx-2 fs-5">|</div>
                  </Col>
                  {loggedInUser ? (
                    <Col xs="auto">
                      <NavDropdown
                        title={
                          <Image
                            src={
                              loggedInUser.profilePic ||
                              "https://placehold.co/40x40/EBF4FA/1F2937?text=U"
                            }
                            alt={loggedInUser.name}
                            roundedCircle
                            width={35}
                            height={35}
                            className="profile-pic-dropdown"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/40x40/EBF4FA/1F2937?text=U";
                            }}
                          />
                        }
                        id="user-profile-dropdown"
                        align="end"
                        className="profile-dropdown-container"
                      >
                        <NavDropdown.Header>
                          Signed in as <br />
                          <strong>{loggedInUser.name}</strong>
                        </NavDropdown.Header>
                        {dropdownLinks.map((link) => {
                          if (link.onClick) {
                            return (
                              <NavDropdown.Item
                                key={link.id}
                                onClick={link.onClick}
                              >
                                {link.text}
                              </NavDropdown.Item>
                            );
                          }
                          return (
                            <NavDropdown.Item
                              key={link.id}
                              as={Link}
                              to={link.path}
                            >
                              {link.text}
                            </NavDropdown.Item>
                          );
                        })}
                      </NavDropdown>
                    </Col>
                  ) : (
                    <Col xs="auto">
                      <NavLink
                        to="/login"
                        className="text-decoration-none btn text-white"
                      >
                        <i className="fa-regular fa-user fs-5"></i>
                      </NavLink>
                    </Col>
                  )}
                </Row>
              </Form>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComponents;