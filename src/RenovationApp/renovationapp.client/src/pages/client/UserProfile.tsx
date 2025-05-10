import React from 'react';
import { useMsal } from '@azure/msal-react';

const UserProfile: React.FC = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  if (!activeAccount) {
    return <div>No active account found</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        User Profile
      </div>
      <div className="card-body">
        <h5 className="card-title">{activeAccount.name}</h5>
        <p className="card-text">Username: {activeAccount.username}</p>
        {activeAccount.idTokenClaims && (
          <div>
            <h6>Token Claims:</h6>
            <ul className="list-group">
              {Object.entries(activeAccount.idTokenClaims as Record<string, unknown>)
                .filter(([key, value]) => !key.startsWith('aud') && typeof value !== 'object')
                .map(([key, value]) => (
                  <li key={key} className="list-group-item">
                    <strong>{key}:</strong> {String(value)}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;