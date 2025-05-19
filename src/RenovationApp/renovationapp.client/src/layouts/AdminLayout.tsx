import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';
import logoPlaceholder from '../assets/logo_name.svg';

const AdminLayout: React.FC = () => {
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
      // Then, navigate to the home page or admin home
      navigate('/admin');
    }).catch((error) => console.log(error));
  };

  const handleUserAccountClick = () => {
    navigate('/admin/account');
  };


  const [activeTab, setActiveTab] = useState<'requests' | 'projects' | 'contacts'>('requests');



  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">

        <div className='d-flex justify-content-between align-items-center w-100 px-3'>
          <Link className="navbar-brand" to="/admin">
            <img src={logoPlaceholder} alt="Logo" height="40" />
          </Link>
          <div className='text-light h4'>
            Admin Portal
          </div>
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
              <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogin}>Login</button>
            )}
          </div>

        </div>

      </nav>

      <main style={{ paddingTop: "4rem" }} className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-2 bg-dark text-light min-vh-100">
            <div className="px-3 py-4">
              <h3 className="mb-4">Dashboard</h3>
              <div className="nav flex-column">
                <button
                  className={`nav-link text-light py-2 text-start ${activeTab === 'requests' ? 'active fw-bold' : ''}`}
                  onClick={() => {
                    setActiveTab("requests");
                    navigate('requests');
                  }}
                >
                  Requests
                </button>
                <button
                  className={`nav-link text-light py-2 text-start ${activeTab === 'projects' ? 'active fw-bold' : ''}`}
                  onClick={() => {
                    setActiveTab("projects");
                    navigate('projects');
                  }}
                >
                  Projects
                </button>
                <button
                  className={`nav-link text-light py-2 text-start ${activeTab === 'contacts' ? 'active fw-bold' : ''}`}
                  onClick={() => {
                    setActiveTab("contacts");
                    navigate('contacts');
                  }}
                >
                  Contacts
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-10 bg-light">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminLayout;