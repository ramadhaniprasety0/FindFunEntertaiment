import {useState, useEffect} from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import {Navbar, Container, Nav, Form, Row, Col} from 'react-bootstrap';

const NavbarComponents = () => {

  const [changeColor, setChangeColor] = useState(false);
  const location = useLocation();

  const changeBackgroundColor = () => {
    if (window.scrollY > 10 || location.pathname !== "/") {
      setChangeColor(true);
    } else{
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

  return (
    <div>
      <Navbar expand="lg" className={changeColor ? "color-active" : ""} >
        <Container>
          <Navbar.Brand href="/" className='montserrat-font fw-bold fs-3 text-white'><img src="/findfun.svg" alt="FindFun" width="30" height="30" className='me-2' />FindFun</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto text-center align-items-center gap-2">
              <div className="nav-link">
                    <NavLink to="Films" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Films</NavLink>
                    <NavLink to="Music" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Music</NavLink>
              </div>
              <Form inline className="d-flex align-items-center">
                <Row>
                  <Col xs="auto">
                    <div className="search-box position-relative">
                      <input
                        type="text"
                        className="form-control pe-5"
                        placeholder="Cari film, musik, artis, dll"
                      />
                      <i className="fa-solid fa-magnifying-glass position-absolute top-50 end-0 translate-middle-y pe-3"></i>
                    </div>
                  </Col>
                  <Col xs="auto">
                    <div className="mx-2 fs-5">|</div>
                  </Col>
                  <Col xs="auto">
                    <NavLink to="/login" className="text-decoration-none btn text-white">
                      <i className="fa-regular fa-user fs-5"></i>
                    </NavLink>
                  </Col>
                </Row>
              </Form>
            </Nav>
            
            {/* <div className='text-center'>
              <button className="btn btn-outline-danger rounded-4">Join With Us</button>
            </div> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default NavbarComponents