import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";
import Overview from './components/Overview';
import Files from './components/Files';
import Invoices from './components/Invoices';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const { instance } = useMsal();

  return (
    <div className="p-2">
      <div className="mt-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
          style={{ borderRadius: '4px', padding: '4px 10px' }}
        >
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <h3>Project Name (ID: {id})</h3>
      </div>

      {/* Navigation tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => setActiveTab('files')}
          >
            Files
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            Invoices
          </button>
        </li>
      </ul>

       {/* Overview tab content */}
      {activeTab === 'overview' && id && (
        <Overview projectId={Number(id)} instance={instance} />
      )}

      {/* Files tab content */}
      {activeTab === 'files' && id && (
        <Files projectId={BigInt(id)} instance={instance} />
      )}

      {/* Invoices tab content */}
      {activeTab === 'invoices' && id && (
        <Invoices projectId={BigInt(id)} instance={instance} />
      )}
    </div>
  );
};

export default ProjectDetail;