import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';

const ClientLayout: React.FC = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const handleLogin = (event: React.MouseEvent) => {
    event.preventDefault();
    instance
      .loginRedirect({
        ...loginRequest,
        prompt: 'login',
      })
      .catch((error) => console.log(error));
  };

  const handleLogout = (event: React.MouseEvent) => {
    event.preventDefault();
    // First, logout from MSAL (this won't redirect)
    instance.logout({
      onRedirectNavigate: () => {
        // Prevent MSAL from redirecting
        return false;
      }
    }).then(() => {
      // Then, navigate to the home page
      navigate('/');
    }).catch((error) => console.log(error));
  };

  const handleUserAccountClick = () => {
    navigate('/profile');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/">Client Portal</Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#clientNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="clientNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/service">Service</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/gallery">Gallery</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/rfq">Request a Quote</Link>
              </li>
            </ul>

            <div className="d-flex">
              {isAuthenticated ? (
                <div className="d-flex gap-2 align-items-center">
                  <button type="button" className="btn btn-sm" onClick={handleUserAccountClick}>
                    <i className="bi bi-person-circle fs-4"></i>
                  </button>
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleLogin}>Login</button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container" style={{ paddingTop: '5rem' }}>
        <Outlet />
      </main>
    </>
  );
};

export default ClientLayout;