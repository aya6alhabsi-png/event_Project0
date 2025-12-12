
import { Navbar, NavbarBrand, Nav, NavItem, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import logo from '../assets/logo.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Navbar
      expand="md"
      light
      className="px-4"
      style={{ backgroundColor: '#F26B1D', borderBottom: '1px solid #e0e0e0' }}
    >

      <NavbarBrand
        tag={Link}
        to="/"
        className="fw-bold"
        style={{ color: '#000' }}
      >
        Event Platform
      </NavbarBrand>

     
      <div className="d-flex align-items-center ms-auto">
        <Nav navbar className="me-3 align-items-center">
          <NavItem className="me-3">
            <Link
              to="/login"
              className="text-dark fw-semibold text-decoration-none"
            >
              LogIn
            </Link>
          </NavItem>

          {!user && (
            <NavItem className="me-3">
              <Link
                to="/admin/login"
                className="text-dark fw-semibold text-decoration-none"
              >
                Admin
              </Link>
            </NavItem>
          )}

          {user && (
            <NavItem>
              <Button
                size="sm"
                color="light"
                className="fw-semibold"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </NavItem>
          )}
        </Nav>

        <div style={{
            width: 32,
            height: 32,
            borderRadius: 4,
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={logo}
            alt="Event Platform Logo"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
    </Navbar>
  );
}

export default Header;
