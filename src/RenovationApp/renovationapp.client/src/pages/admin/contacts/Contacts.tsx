import { useMsal } from '@azure/msal-react';
import { useState } from 'react';
import { useClientData } from '../../../api/clients/client';
import { ClientLocation } from '../../../api/clients/client.types';

interface ContactItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
}

const contacts: ContactItem[] = [
  { id: 'CON-001', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', location: 'Calgary, AB' },
  { id: 'CON-002', name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', location: 'Edmonton, AB' },
  { id: 'CON-003', name: 'Mike Brown', email: 'mike@example.com', phone: '555-555-5555', location: 'Vancouver, BC' },
  { id: 'CON-004', name: 'Lisa Ray', email: 'lisa@example.com', phone: '222-333-4444', location: 'Toronto, ON' }
];

const Contacts = () => {
  const { instance } = useMsal();
  const { getAllClientContactInfo } = useClientData(instance);
  const [sortAsc, setSortAsc] = useState(true);

  const { data: contacts, isLoading, error } = getAllClientContactInfo();

  const formatLocation = (location: ClientLocation): string => {
    if (location.city && location.state) {
      return `${location.city}, ${location.state}`;
    }
    return location.city || location.state || 'Unknown';
  };

  const toggleSort = () => {
    setSortAsc(!sortAsc);
  };

  const sortedContacts = contacts ? [...contacts].sort((a, b) => (
    sortAsc ? 
      `${a.givenName} ${a.surname}`.localeCompare(`${b.givenName} ${b.surname}`) : 
      `${b.givenName} ${b.surname}`.localeCompare(`${a.givenName} ${a.surname}`)
  )) : [];

  const activeAccount = instance.getActiveAccount();
  if (!activeAccount) {
    return <p>Please login to proceed.</p>;
  }

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container my-4">
      <h3>Contacts Dashboard</h3>

      {isLoading && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th onClick={toggleSort} style={{ cursor: 'pointer' }}>Contact {sortAsc ? '↓' : '↑'}</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedContacts.map(contact => (
              <tr key={contact.id}>
                <td>{`${contact.givenName} ${contact.surname}`}</td>
                <td>{contact.mail || 'N/A'}</td>
                <td>{contact.mobilePhone || 'N/A'}</td>
                <td>{formatLocation({ city: contact.city, state: contact.state })}</td>
                <td>
                  <button className="btn btn-outline-secondary btn-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contacts;
