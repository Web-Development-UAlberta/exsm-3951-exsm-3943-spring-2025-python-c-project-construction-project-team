// components/Requests.tsx
import { fetchAllRFQs, fetchRFQById } from '../../../api/rfq/rfqQueries';
import { RFQ } from '../../../api/rfq/rfq.types';
import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import { QuoteEstimateModal } from './components/QuoteEstimateModal';
import RequestDetailsModal from './components/RequestDetailsModal';
import { getRequestStatusBadgeClass } from '../../../utils/getStatusBadgeClass';

// Define the request type based on the columns shown in the screenshot
interface Request {
  id: number;
  client: string;
  project_address: string;
  project_manager: string;
  status: string;
}

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

// Available project managers for dropdown
const projectManagers = ['Name', 'Mike Smith', 'Sarah Johnson', 'Alex Wong', 'Emily Davis'];

const Requests = () => {
  const { instance } = useMsal();

  // Request Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(null);

  // State for managing requests data
  const [requestsData, setRequestsData] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quote Estimate Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteRequestId, setQuoteRequestId] = useState<number | null>(null);

  // Fetch requests when the component mounts
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        console.log('Fetching RFQs...');

        const activeAccount = instance.getActiveAccount();

        if (!activeAccount) {
          setError('Please login to proceed.');
          return;
        }
        console.log('Fetching RFQs with account:', activeAccount.username);

        const rfqData = await fetchAllRFQs(instance);
        console.log('Raw RFQ data type:', typeof rfqData);
        console.log('Raw RFQ data:', rfqData);

        // Convert to array based on data structure
        let rfqArray: RFQ[] = [];

        if (typeof rfqData === 'object' && rfqData !== null) {
          // If it's already an array, use it directly
          if (Array.isArray(rfqData)) {
            rfqArray = rfqData;
          } 
          // If it's an object, convert its values to array
          else {
            rfqArray = Object.values(rfqData);
          }
        }
        console.log('Processed array:', rfqArray);

        const formattedData = rfqArray.map((rfq: RFQ) => ({
          id: Number(rfq.id),
          client: rfq.clientId,
          project_address: rfq.projectAddress || 'N/A',
          project_manager: rfq.assignedEmployeeId || 'N/A',
          status: rfq.status || 'Created'
        }));

        console.log('Formatted requests data:', formattedData);
        setRequestsData(formattedData);
      } catch (error) {
        console.error('Error fetching requests:', error);
        if (error instanceof Error) {
          setError(error.message || 'Failed to load requests. Please try again later.');
        } else {
          setError('Failed to load requests. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [instance]);

  // Request detail modal handlers
  const openRequestDetail = async (requestId: number) => {
    try {
      const rfqDetail = await fetchRFQById(BigInt(requestId), instance);

      const requestDetail: RequestDetail = {
        id: Number(rfqDetail.id),
        client: rfqDetail.clientId,
        project_address: rfqDetail.projectAddress || 'N/A',
        renovation_type: rfqDetail.renovationType || 'N/A',
        preferred_material: rfqDetail.preferredMaterial || 'N/A',
        budget: rfqDetail.budget || 0,
        description: rfqDetail.description || 'N/A',
        files: rfqDetail.rfqImages ? rfqDetail.rfqImages.map((image) => image.toString()) : []
      };

      setSelectedRequest(requestDetail);
      setShowDetailModal(true);
    } catch (error) {
      console.error(`Failed to fetch details for request ${requestId}:`, error);
      setError('Failed to load request details. Please try again later.');
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
  // const updateRFQ = async (requestId: BigInt, data: Partial<RFQ>) => {
  //   try {
  //     const api = apiClient(instance);
  //     const response = await api.put(`/rfq/${requestId}`, data);
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error updating RFQ ${requestId}:`, error);
  //     throw new Error('Failed to update RFQ. Please try again later.');
  //   }
  // };
  // const handleProjectManagerChange = async (requestId: number, newManager: string) => {
  //   try {
  //     await updateRFQ(
  //       BigInt(requestId),
  //       { assignedEmployeeId: newManager }
  //     );

  //     setRequestsData(prevRequests =>
  //       prevRequests.map(request =>
  //         request.id === requestId
  //           ? { ...request, project_manager: newManager }
  //           : request
  //       )
  //     );
  //   } catch (error) {
  //     console.error(`Failed to update project manager:`, error);
  //     setError('Failed to update project manager. Please try again later.');
  //   }
  // };

  const handleProjectManagerChange = (requestId: number, newManager: string) => {
    setRequestsData(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId
          ? { ...request, project_manager: newManager }
          : request
      )
    );
  };

  return (
    <div className="p-4">
      <h3 className="mb-3">Requests Dashboard</h3>

      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
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
            {requestsData.length > 0 ? (requestsData.map(request => (
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
            ))) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No requests available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}
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