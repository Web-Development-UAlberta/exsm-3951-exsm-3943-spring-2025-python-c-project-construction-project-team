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
      <nav className="navbar navbar-expand-lg admin-navbar">

        <div className='d-flex justify-content-between align-items-center w-100 px-3'>
          <Link className="navbar-brand" to="/admin">
            <img src={logoPlaceholder} alt="Logo" height="40" />
          </Link>
          <div className='text-light h4 mb-0'>
            Admin Portal
          </div>
          <div className="d-flex">
            {isAuthenticated ? (
              <div className="d-flex gap-2 align-items-center">
                <button type="button" className="btn btn-link text-light" onClick={handleUserAccountClick}>
                  <i className="bi bi-person-circle fs-4"></i>
                </button>
                <button type="button" className="btn btn-danger btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogin}>Login</button>
            )}
          </div>

        </div>

      </nav>

      <main className="container-fluid">
        <div className="row vh-100">
          {/* Sidebar */}
          <div className="col-auto admin-sidebar px-0">
            <div className="px-4 py-5">
              <h4 className="text-light mb-3">Dashboard</h4>
              <div className="nav flex-column">
                <button
                  className={`nav-link text-light py-3 text-start ${activeTab === 'requests' ? 'active fw-bold' : ''}`}
                  onClick={() => {
                    setActiveTab("requests");
                    navigate('requests');
                  }}
                >
                  Requests
                </button>
                <button
                  className={`nav-link text-light py-3 text-start ${activeTab === 'projects' ? 'active fw-bold' : ''}`}
                  onClick={() => {
                    setActiveTab("projects");
                    navigate('projects');
                  }}
                >
                  Projects
                </button>
                <button
                  className={`nav-link text-light py-3 text-start ${activeTab === 'contacts' ? 'active fw-bold' : ''}`}
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
          <div className="col admin-content p-4">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminLayout;