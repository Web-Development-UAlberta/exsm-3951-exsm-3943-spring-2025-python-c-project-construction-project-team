// components/Requests.tsx
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAllRFQs, fetchRFQById, updateRFQ, fetchRFQImages } from '../../../api/rfq/rfqQueries';
import { RFQ, RFQImage } from '../../../api/rfq/rfq.types';
import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import { QuoteEstimateModal } from './components/QuoteEstimateModal';
import RequestDetailsModal from './components/RequestDetailsModal';
import { getRequestStatusBadgeClass } from '../../../utils/getStatusBadgeClass';

// Define the request type based on the columns shown in the screenshot
interface Request {
  id: number;
  clientId: string;
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
  files: RFQImage[];
}

// Available project managers for dropdown
const projectManagers = ['Name', 'Mike Smith', 'Sarah Johnson', 'Alex Wong', 'Emily Davis'];

const Requests = () => {
  const { instance } = useMsal();
  const queryClient = useQueryClient();

  // States
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRFQId, setSelectedRFQId] = useState<number | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteRequestId, setQuoteRequestId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // RFQ list
  const { 
    data: rfqs, 
    isLoading, 
    error: queryError,
    refetch
  } = useQuery<Request[]>({
    queryKey: ['rfqs'],
    queryFn: async () => {
      try {
        const rfqData = await fetchAllRFQs(instance);
        return rfqData.map((rfq: RFQ) => ({
          id: Number(rfq.id),
          clientId: rfq.clientId,
          client: rfq.clientId,
          project_address: rfq.projectAddress ?? 'N/A',
          project_manager: rfq.assignedEmployeeId ?? 'N/A',
          status: rfq.status ?? 'Created'
        }));
      } catch (error) {
        setErrorMessage('Failed to fetch requests. Please try again.');
        throw error;
      }
    }
  });

  // Request detail query
  const { 
    data: rfqDetail,
    error: detailError 
  } = useQuery({
    queryKey: ['rfq-detail', selectedRFQId],
    queryFn: () => {
      if (!selectedRFQId) return null;
      console.log(`Fetching details for RFQ ${selectedRFQId}`);
      return fetchRFQById(BigInt(selectedRFQId), instance);
    },
    enabled: !!selectedRFQId
  });

  // RFQ images query
  const { 
    data: rfqImages = [],
    error: imagesError 
  } = useQuery<RFQImage[], Error>({
    queryKey: ['rfq-images', selectedRFQId],
    queryFn: async () => {
      if (!selectedRFQId) return [];
      console.log(`Fetching images for RFQ ${selectedRFQId}`);
      return await fetchRFQImages(BigInt(selectedRFQId), instance);
    },
    enabled: !!selectedRFQId
  });

  // Combine detail and images data when available
  useEffect(() => {
    if (rfqDetail && selectedRFQId) {
      const requestDetail: RequestDetail = {
        id: Number(rfqDetail.id),
        client: rfqDetail.clientId,
        project_address: rfqDetail.projectAddress ?? 'N/A',
        renovation_type: rfqDetail.renovationType ?? 'N/A',
        preferred_material: rfqDetail.preferredMaterial ?? 'N/A',
        budget: rfqDetail.budget ?? 0,
        description: rfqDetail.description ?? 'N/A',
        files: Array.isArray(rfqImages) ? rfqImages : []
      };
      
      setSelectedRequest(requestDetail);
    }
  }, [rfqDetail, rfqImages, selectedRFQId]);

  // Handle any errors from detail or images queries
  useEffect(() => {
    if (detailError || imagesError) {
      const error = detailError?.message || imagesError?.message || 'Failed to load request details';
      setErrorMessage(error);
      console.error('Error loading request details:', { detailError, imagesError });
    } else {
      setErrorMessage(null);
    }
  }, [detailError, imagesError]);

  const openRequestDetail = (requestId: number) => {
    console.log(`Opening details for request ${requestId}`);
    setSelectedRFQId(requestId);
    setShowDetailModal(true);
  };

  const closeRequestDetail = () => {
    setShowDetailModal(false);
    setSelectedRFQId(null);
    setSelectedRequest(null);
  };

  // Quote estimate modal handlers
  const openQuoteEstimate = (requestId: number) => {
    console.log(`Opening quote estimate for request ${requestId}`);
    setQuoteRequestId(requestId);
    setShowQuoteModal(true);
  };

  const closeQuoteEstimate = () => {
    setShowQuoteModal(false);
    setQuoteRequestId(null);
  };

  const handleProjectManagerChange = async (requestId: number, newManager: string) => {
    console.log(`Updating project manager for request ${requestId} to ${newManager}`);
    setErrorMessage(null);
    try {
      await updateRFQ(BigInt(requestId), { assignedEmployeeId: newManager }, instance);
      
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });

    } catch (error) {
      console.error('Failed to update project manager:', error);
      setErrorMessage('Failed to update project manager. Please try again.');
      // Refetch to ensure UI is in sync with server
      refetch();
    }
  };

  return (
    <div className="p-4">
      <h3 className="mb-3">Requests Dashboard</h3>

      {isLoading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {queryError && (
        <div className="alert alert-danger">
          {errorMessage}
          <button 
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !queryError && (
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
              {rfqs && rfqs.length > 0 ? (
                rfqs.map(request => (
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
                ))
              ) : (
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
          openQuoteEstimate(Number(id));
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

export default Requests;