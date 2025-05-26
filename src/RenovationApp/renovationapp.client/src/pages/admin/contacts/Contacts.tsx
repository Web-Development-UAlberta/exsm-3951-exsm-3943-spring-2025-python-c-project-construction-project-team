import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import { useClientData, ClientLocation, ClientContactDisplay } from '../../../api/clients/';
import ContactDetailsModal from './components/ContactDetailsModal';
import { Button } from 'react-bootstrap';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { mockContacts } from '../../../mocks/contactMock';

const Contacts = () => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const { instance } = useMsal();
  const { getAllClientContactInfo } = useClientData(instance);
  const [sortAsc, setSortAsc] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  const { data: apiContacts, isLoading, error } = getAllClientContactInfo() as {
    data: ClientContactDisplay[] | undefined;
    isLoading: boolean;
    error: Error | null;
  }

  // Decide whether to use mock data based on the API response
  useEffect(() => {
    if (error && error.message.includes('InvalidAuthenticationToken') || 
        error?.message?.includes('Authorization_RequestDenied')) {
      setUseMockData(true);
    }
  }, [error]);
  
  // Mock data
  const contacts = useMockData || !apiContacts?.length ? mockContacts : apiContacts;

  const formatLocation = (location: ClientLocation): string => {
    if (location.city && location.state) {
      return `${location.city}, ${location.state}`;
    }
    return location.city || location.state || 'Unknown';
  };

  const toggleSort = () => {
    setSortAsc(!sortAsc);
  };

  // Filter out contacts with projects or RFQs
  const filteredContacts = contacts?.filter(contact =>
    contact.hasProjects || contact.hasRFQs
  );

  const sortedFilteredContacts = [...filteredContacts].sort((a, b) => (
    sortAsc ? 
      `${a.givenName} ${a.surname}`.localeCompare(`${b.givenName} ${b.surname}`) : 
      `${b.givenName} ${b.surname}`.localeCompare(`${a.givenName} ${a.surname}`)
  ));

  const activeAccount = instance.getActiveAccount();
  if (!activeAccount) {
    return <p>Please login to proceed.</p>;
  }

  const handleAuthError = async (error: any) => {
    if (error instanceof InteractionRequiredAuthError) {
      try {
        await instance.acquireTokenPopup({
          scopes: ["User.ReadBasic.All", "User.Read.All"]
        });
        // Retry the operation
        window.location.reload();
      } catch (e) {
        console.error('Error acquiring token:', e);
      }
    }
  };

  useEffect(() => {
    if (error?.message?.includes('InvalidAuthenticationToken') || 
        error?.message?.includes('Authorization_RequestDenied')) {
      handleAuthError(error);
    }
  }, [error]);

  // if (error) {
  //   return (
  //     <div className="alert alert-danger">
  //       <strong>Authentication Error</strong>
  //       <p>{error.message}</p>
  //       <Button 
  //         variant="primary"
  //         onClick={() => instance.loginRedirect({
  //           scopes: ["User.ReadBasic.All", "User.Read.All", "Directory.Read.All"]
  //         })}
  //       >
  //         Reauthenticate
  //       </Button>
  //     </div>
  //   );
  // }

  return (
    <div className="container my-4">
      <h3>Contacts Dashboard</h3>

      {isLoading && !contacts.length && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}

      {useMockData && (
        <div className="alert alert-warning mb-3">
          <small>Using demo data - API unavailable</small>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th onClick={toggleSort} style={{ cursor: 'pointer' }}>Contact {sortAsc ? '↓' : '↑'}</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedFilteredContacts.map(contact => (
              <tr key={contact.id}>
                <td>{`${contact.givenName} ${contact.surname}`}</td>
                <td>{contact.mail || 'N/A'}</td>
                <td>{contact.mobilePhone || 'N/A'}</td>
                <td>{formatLocation({ city: contact.location?.city, state: contact.location?.state })}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setSelectedContactId(contact.id)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedContactId && (
            <ContactDetailsModal
              show={selectedContactId !== null}
              onHide={() => setSelectedContactId(null)}
              contactId={selectedContactId}
            />
          )}
    </div>
  );
};

export default Contacts;
