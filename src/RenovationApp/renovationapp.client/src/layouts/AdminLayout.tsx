import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth/useAuth';
import logoPlaceholder from '../assets/logo-no-bg-white.png';
import { Button } from '../components/ButtonComponent/Button';

const AdminLayout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'requests' | 'projects' | 'contacts'>('requests');

  const handleLogout = async (event: React.MouseEvent) => {
    event.preventDefault();
    await logout();
    navigate('/');
  };

  const handleUserAccountClick = () => {
    navigate('/admin/account');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg admin-navbar">
        <div className='d-flex justify-content-between align-items-center w-100 px-3'>
          <Link className="navbar-brand" to="/admin/requests">
            <img src={logoPlaceholder} alt="Logo" height="40" />
          </Link>
          <div className='text-light h4 mb-0'>
            Admin Portal
          </div>
          <div className="d-flex">
            {isAuthenticated && (
              <div className="d-flex gap-2 align-items-center">
                <div className="dropdown">
                  <Button
                    className="btn btn-link text-light d-flex align-items-center gap-2 text-decoration-none"
                    onClick={handleUserAccountClick}
                  >
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-person-circle fs-4"></i>
                        <div className="d-none d-md-block text-start">
                          <div>{user?.name || 'User'}</div>
                        </div>
                      </div>
                  </Button>
                </div>
                <Button type="button" variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="container-fluid">
        <div className="row vh-100">
          {/* Sidebar */}
          <div className="col-auto admin-sidebar px-0 d-flex flex-column justify-content-between">
            <div className="px-4 py-5">
              <h4 className="text-light mb-3">Dashboard</h4>
              <div className="nav flex-column">
                <Button
                  className={`nav-link text-light py-3 text-start ${activeTab === 'requests' ? 'active fw-bold' : ''}`}
                  onClick={() => {
                    setActiveTab("requests");
                    navigate('requests');
                  }}
                >
                  Requests
                </Button>
                <Button
                  className={`nav-link text-light py-3 text-start ${activeTab === 'projects' ? 'active fw-bold' : ''}`}
                  onClick={() => {
                    setActiveTab("projects");
                    navigate('projects');
                  }}
                >
                  Projects
                </Button>
                <Button
                  className={`nav-link text-light py-3 text-start ${activeTab === 'contacts' ? 'active fw-bold' : ''}`}
                  onClick={() => {
                    setActiveTab("contacts");
                    navigate('contacts');
                  }}
                >
                  Contacts
                </Button>
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