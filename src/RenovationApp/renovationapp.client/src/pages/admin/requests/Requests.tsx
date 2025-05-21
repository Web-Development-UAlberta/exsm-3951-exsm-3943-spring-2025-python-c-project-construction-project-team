// components/Requests.tsx
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAllRFQs, fetchRFQById, updateRFQ, fetchRFQImages } from '../../../api/rfq/rfqQueries';
import { RFQ, RFQImage } from '../../../api/rfq/rfq.types';
import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import { QuoteEstimateModal } from './components/QuoteEstimateModal';
import RequestDetailsModal from './components/RequestDetailsModal';
import { getRequestStatusBadgeClass } from '../../../utils/getStatusBadgeClass';

interface Request {
  id: number;
  clientId: string;
  client: string;
  project_address: string;
  project_manager: string;
  status: string;
}

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

interface ProjectManager {
  id: string;
  name: string;
  email: string;
}

const projectManagers: ProjectManager[] = [
  {
    id: '2caf9d13-45db-4960-8a81-a4ffb48dc8f3',
    name: 'Clarisse Buniel',
    email: 'buniel@ualberta.ca'
  },
  {
    id: '3a40d159-f5b2-4740-9fd2-c7da499d5daa',
    name: 'David Rochefort',
    email: 'drochefo+bob@ualberta.ca'
  },
  {
    id: 'c701d842-5da1-44b2-8783-eb6d9696b314',
    name: 'Nina Shi',
    email: 'sxjdehj@163.com'
  }
];

const Requests = () => {
  const { instance } = useMsal();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRFQId, setSelectedRFQId] = useState<number | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteRequestId, setQuoteRequestId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const accounts = instance.getAllAccounts();
    setIsAuthenticated(accounts.length > 0);
    if (accounts.length === 0) {
      instance.loginRedirect();
    }
  }, [instance]);

  const { data: rfqs, isLoading, error: queryError, refetch } = useQuery<Request[]>({
    queryKey: ['rfqs'],
    queryFn: async () => {
      const rfqData = await fetchAllRFQs(instance);
      return rfqData.map((rfq: RFQ) => ({
        id: Number(rfq.id),
        clientId: rfq.clientId,
        client: rfq.clientId,
        project_address: rfq.projectAddress ?? 'N/A',
        project_manager: rfq.assignedEmployeeId ?? 'N/A',
        status: rfq.status ?? 'Created'
      }));
    },
    enabled: isAuthenticated
  });

  const { data: rfqDetail, error: detailError } = useQuery({
    queryKey: ['rfq-detail', selectedRFQId],
    queryFn: () => {
      if (!selectedRFQId) return null;
      return fetchRFQById(BigInt(selectedRFQId), instance);
    },
    enabled: !!selectedRFQId
  });

  const { data: rfqImages = [], error: imagesError } = useQuery<RFQImage[], Error>({
    queryKey: ['rfq-images', selectedRFQId],
    queryFn: async () => {
      if (!selectedRFQId) return [];
      return await fetchRFQImages(BigInt(selectedRFQId), instance);
    },
    enabled: !!selectedRFQId
  });

  useEffect(() => {
    if (rfqDetail && selectedRFQId) {
      setSelectedRequest({
        id: Number(rfqDetail.id),
        client: rfqDetail.clientId,
        project_address: rfqDetail.projectAddress ?? 'N/A',
        renovation_type: rfqDetail.renovationType ?? 'N/A',
        preferred_material: rfqDetail.preferredMaterial ?? 'N/A',
        budget: rfqDetail.budget ?? 0,
        description: rfqDetail.description ?? 'N/A',
        files: Array.isArray(rfqImages) ? rfqImages : []
      });
    }
  }, [rfqDetail, rfqImages, selectedRFQId]);

  useEffect(() => {
    if (detailError || imagesError) {
      setErrorMessage(detailError?.message || imagesError?.message || 'Failed to load request details');
    } else {
      setErrorMessage(null);
    }
  }, [detailError, imagesError]);

  const handleProjectManagerChange = async (requestId: number, managerId: string) => {
    setErrorMessage(null);

    queryClient.setQueryData(['rfqs'], (oldData: Request[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.map(request => 
        request.id === requestId 
          ? { ...request, project_manager: managerId }
          : request
      );
    });

    try {
      await updateRFQ(
        BigInt(requestId), 
        { assignedEmployeeId: managerId }, 
        instance
      );
    } catch (error) {
      console.error('Failed to update project manager:', error);
      setErrorMessage('Failed to update project manager. Please try again.');
    }
  };

  const openRequestDetail = (requestId: number) => {
    setSelectedRFQId(requestId);
    setShowDetailModal(true);
  };

  const closeRequestDetail = () => {
    setShowDetailModal(false);
    setSelectedRFQId(null);
    setSelectedRequest(null);
  };

  const openQuoteEstimate = (requestId: number) => {
    setQuoteRequestId(requestId);
    setShowQuoteModal(true);
  };

  const closeQuoteEstimate = () => {
    setShowQuoteModal(false);
    setQuoteRequestId(null);
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
          {errorMessage || queryError?.message || 'Failed to load data.'}
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
                        aria-label="Select Project Manager"
                      >
                        <option value="">Select Project Manager</option>
                        {projectManagers.map(manager => (
                          <option key={manager.id} value={manager.id}>
                            {manager.name}
                          </option>
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