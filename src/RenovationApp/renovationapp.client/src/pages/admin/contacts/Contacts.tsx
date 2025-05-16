import { useState } from 'react';

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
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSort = () => {
    setSortAsc(!sortAsc);
  };

  const sortedContacts = [...contacts].sort((a, b) => (
    sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  ));

  return (
    <div className="container my-4">
      <h3>Contacts Dashboard</h3>
      
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
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>{contact.location}</td>
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
