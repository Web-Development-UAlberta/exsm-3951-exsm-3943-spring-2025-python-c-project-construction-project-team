// components/SubmittedRequestsTab.tsx
import { useState } from 'react';
import { RequestItem } from '../../../types/client_types';
import { getStatusBadgeClass } from '../../../utils/getStatusBadgeClass';
import { RequestDetailsModal } from './components/RequestDetailsModal';


// Mock data of submitted requests with full details from the request form
const submittedRequests: RequestItem[] = [
  {
    id: 'REQ-001',
    date: '2025-04-28',
    type: 'Kitchen Renovation',
    status: 'Pending',
    description: 'Complete kitchen remodel with new cabinets and countertops.',
    projectAddress: '123 Elm Street, Calgary, AB',
    roomSize: 'Medium: 100-200 sq ft',
    budget: '$25,000',
    preferredMaterials: 'Granite countertops, hardwood cabinets',
    message: 'Looking for a modern design with an island and new appliances',
    services: {
      kitchenRemodel: true,
      homeAdditions: false,
      basementFinishing: false,
      bathroomRenovation: false
    },
    files: ['floorplan.pdf', 'inspiration1.jpg']
  },
  {
    id: 'REQ-002',
    date: '2025-05-02',
    type: 'Bathroom Renovation',
    status: 'Approved',
    description: 'Master bathroom upgrade with new shower and fixtures.',
    projectAddress: '123 Elm Street, Calgary, AB',
    roomSize: 'Small : Less than 100 sq ft',
    budget: '$12,000',
    preferredMaterials: 'Porcelain tile, glass shower doors',
    message: 'Need to make better use of the limited space with modern fixtures',
    services: {
      kitchenRemodel: false,
      homeAdditions: false,
      basementFinishing: false,
      bathroomRenovation: true
    },
    files: ['bathroom_layout.jpg']
  },
  {
    id: 'REQ-003',
    date: '2025-05-10',
    type: 'Basement Finishing',
    status: 'In Progress',
    description: 'Converting unfinished basement to entertainment room.',
    projectAddress: '123 Elm Street, Calgary, AB',
    roomSize: 'Large: 200-500 sq ft',
    budget: '$30,000',
    preferredMaterials: 'Laminate flooring, soundproof walls',
    message: 'Want to create a home theater with bar area and proper electrical',
    services: {
      kitchenRemodel: false,
      homeAdditions: false,
      basementFinishing: true,
      bathroomRenovation: false
    },
    files: ['basement_sketch.png', 'theater_inspiration.jpg', 'bar_ideas.pdf']
  }
];

const SubmittedRequestsTab = () => {
  if (submittedRequests.length === 0) {
    return (
      <div className="alert alert-info">
        You haven't submitted any renovation requests yet.
      </div>
    );
  }

  // Request Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  // Request detail modal handlers
  const openRequestDetail = (request: RequestItem) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const closeRequestDetail = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Request ID</th>
            <th>Date</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submittedRequests.map(request => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{new Date(request.date).toLocaleDateString()}</td>
              <td>{request.type}</td>
              <td>
                <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                  {request.status}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  title="View Details"
                  onClick={() => openRequestDetail(request)}
                >
                  <i className="bi bi-eye"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* Request Details Modal */}
      <RequestDetailsModal
        show={showDetailModal}
        request={selectedRequest}
        onClose={closeRequestDetail}
      />
    </div>
  );
};


export default SubmittedRequestsTab