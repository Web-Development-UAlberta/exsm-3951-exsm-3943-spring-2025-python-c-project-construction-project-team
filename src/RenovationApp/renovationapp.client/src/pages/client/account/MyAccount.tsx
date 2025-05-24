// MyAccount.tsx
import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import "./MyAccount.css";
import PersonalInfoTab from './PersonalInfoTab';
import SubmittedRequestsTab from './SubmittedRequestsTab';
import { getActiveUserInfo } from '../../../api/identity/graph';
import { Button } from '../../../components/ButtonComponent/Button';


const MyAccount: React.FC = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  // Tab state
  const [activeTab, setActiveTab] = useState<'personal' | 'requests'>('personal');

  const {data, isLoading, error } = getActiveUserInfo(instance);
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading account</div>
  if (!activeAccount) {
    return <div>No active account found</div>;
  }

  return (
    <div className="row mt-4">
      {/* Sidebar */}
      <div className="col-md-3 left-nav-bar bg-light">
        <div className="px-2 py-4">
          <h3 className="mb-4">My Account</h3>
          <div className="nav flex-column">
            <Button
              variant="link"
              className={`nav-link text-dark py-2 text-start ${activeTab === 'personal' ? 'active fw-bold' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Information
            </Button>
            <Button
              variant="link"
              className={`nav-link text-dark py-2 text-start ${activeTab === 'requests' ? 'active fw-bold' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Submitted Requests
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="col-md-9">
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="p-4 shadow-sm">
            <PersonalInfoTab graphData={data}/>
          </div>
        )}

        {/* Submitted Requests Tab */}
        {activeTab === 'requests' && (
          <div className="p-4 shadow-sm">
            <h2 className="mb-4">Submitted Requests</h2>

            <SubmittedRequestsTab/>
          </div>
        )}
      </div>


    </div>
  );
};

export default MyAccount;