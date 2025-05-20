// components/Requests.tsx
import { useState } from 'react';
import { QuoteEstimateModal } from './components/QuoteEstimateModal';
import RequestDetailsModal from './components/RequestDetailsModal';
import { getRequestStatusBadgeClass } from '../../../utils/getStatusBadgeClass';
import { useMsal } from '@azure/msal-react';
import { fetchAllUsers } from '../../../api/identity/graphQueries';
import { getAllUserInfo } from '../../../api/identity/graph';

// Define the request type based on the columns shown in the screenshot
interface Request {
  id: number;
  client: string;
  project_address: string;
  project_manager: string;
  status: string;
}

// Available project managers for dropdown
const projectManagers = ['Name', 'Mike Smith', 'Sarah Johnson', 'Alex Wong', 'Emily Davis'];

// Mock data based on the screenshot
const requests: Request[] = [
  {
    id: 1,
    client: 'Client Name',
    project_address: 'Project Address',
    project_manager: 'Name',
    status: 'New'
  },
  {
    id: 2,
    client: 'Client Name',
    project_address: 'Project Address',
    project_manager: 'Name',
    status: 'New'
  },
  {
    id: 3,
    client: 'Client Name',
    project_address: 'Project Address',
    project_manager: 'Name',
    status: 'New'
  }
];

// Define the detailed request interface with all properties shown in the modal
interface RequestDetail {
  id: number;
  client: string;
  project_address: string;
  renovation_type: string;
  preferred_material: string;
  budget: number;
  description: string;
  files: string[];
}

// Mock detailed data for the modal
const requestDetails: Record<number, RequestDetail> = {
  1: {
    id: 1,
    client: 'John Doe',
    project_address: '123 Main St City, Province 0AX 1A1',
    renovation_type: 'Kitchen Remodel',
    preferred_material: 'Nothing crazy. Just this one I found at Home Depot.',
    budget: 10000,
    description: 'Need new cabinets installed',
    files: ['image0.png', 'likethisone.png']
  },
  2: {
    id: 2,
    client: 'Jane Smith',
    project_address: '456 Oak Ave City, Province 0BX 2B2',
    renovation_type: 'Bathroom Renovation',
    preferred_material: 'Porcelain tile, glass shower doors',
    budget: 15000,
    description: 'Complete bathroom remodel with new shower',
    files: ['bathroom_plan.png']
  },
  3: {
    id: 3,
    client: 'Alex Johnson',
    project_address: '789 Pine Rd City, Province 0CX 3C3',
    renovation_type: 'Basement Finishing',
    preferred_material: 'Laminate flooring, drywall',
    budget: 20000,
    description: 'Convert unfinished basement to entertainment space',
    files: ['basement_sketch.png', 'inspiration.jpg']
  }
};

const Requests = () => {
  // Request Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(null);
  // State for managing requests data
  const [requestsData, setRequestsData] = useState<Request[]>(requests);
  // Quote Estimate Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteRequestId, setQuoteRequestId] = useState<number | null>(null);

  // Request detail modal handlers
  const openRequestDetail = (requestId: number) => {
    const requestDetail = requestDetails[requestId];
    if (requestDetail) {
      setSelectedRequest(requestDetail);
      setShowDetailModal(true);
    }
  };

  const closeRequestDetail = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  // Quote estimate modal handlers
  const openQuoteEstimate = (requestId: number) => {
    setQuoteRequestId(requestId);
    setShowQuoteModal(true);
  };

  const closeQuoteEstimate = () => {
    setShowQuoteModal(false);
    setQuoteRequestId(null);
  };

  // Handler for changing project manager
  const handleProjectManagerChange = (requestId: number, newManager: string) => {
    setRequestsData(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId
          ? { ...request, project_manager: newManager }
          : request
      )
    );
  };

  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const { data } = getAllUserInfo(instance);
  console.log(data);

  if (!activeAccount) {
    return <p>Please login to proceed.</p>;
  }

  return (
    <div className="p-4">
      <h3 className="mb-3">Requests Dashboard</h3>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Project Address</th>
              <th>Project Manager</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requestsData.map(request => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.client}</td>
                <td>{request.project_address}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={request.project_manager}
                    onChange={(e) => handleProjectManagerChange(request.id, e.target.value)}
                    aria-label="Project Manager selection"
                  >
                    {projectManagers.map((manager, index) => (
                      <option key={index} value={manager}>{manager}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <span className={`badge ${getRequestStatusBadgeClass(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => openRequestDetail(request.id)}
                  >
                    Details
                  </button>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => openQuoteEstimate(request.id)}
                  >
                    Quote
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Request Details Modal */}
      <RequestDetailsModal
        show={showDetailModal}
        request={selectedRequest}
        onClose={closeRequestDetail}
        onAccept={(id) => {
          closeRequestDetail();
          openQuoteEstimate(id);
        }}
      />

      {/* Quote Estimate Modal */}
      <QuoteEstimateModal
        show={showQuoteModal}
        requestId={quoteRequestId}
        onClose={closeQuoteEstimate}
      />
    </div>
  );
};

export default Requests