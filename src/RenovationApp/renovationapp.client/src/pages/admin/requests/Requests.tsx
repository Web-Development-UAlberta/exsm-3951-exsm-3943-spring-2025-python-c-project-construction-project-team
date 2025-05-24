// components/Requests.tsx
import { useUpdateRFQ, getAllRFQs, getRFQById, getRFQImagesByRFQId } from '../../../api/rfq/rfq';
import { RFQImage, RFQStatus } from '../../../api/rfq/rfq.types';
import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import { QuoteEstimateModal } from './components/QuoteEstimateModal';
import RequestDetailsModal from './components/RequestDetailsModal';
import { getRequestStatusBadgeClass } from '../../../utils/getStatusBadgeClass';
import { Button } from '../../../components/ButtonComponent/Button';

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
  const updateRFQMutation = useUpdateRFQ(instance);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRFQId, setSelectedRFQId] = useState<bigint | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteRequestId, setQuoteRequestId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: rfqs, isLoading, error: queryError, refetch } = getAllRFQs(instance);

  const { data: rfqDetail, error: detailError } = getRFQById(
    selectedRFQId ?? BigInt(0),
    instance
  );

  const { data: rfqImages = [], error: imagesError } = getRFQImagesByRFQId(
    selectedRFQId ?? BigInt(0),
    instance
  );

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
    const error = detailError?.message || imagesError?.message || queryError?.message
    setErrorMessage(error ? error : null);
  }, [detailError, imagesError, queryError]);

  const handleProjectManagerChange = async (requestId: number, managerId: string) => {
    setErrorMessage(null);
    try {
      await updateRFQMutation.mutateAsync({
          rfqId: BigInt(requestId),
          rfq: { assignedEmployeeId: managerId }
      });
    } catch (error) {
      console.error('Failed to update project manager:', error);
      setErrorMessage('Failed to update project manager. Please try again.');
    }
  };

  const openRequestDetail = (requestId: number) => {
    setSelectedRFQId(BigInt(requestId));
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
          {errorMessage}
          <Button
            variant="danger"
            size="sm"
            outline
            className="ms-2"
            onClick={() => refetch()}
          >
            Retry
          </Button>
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
                rfqs
                  .filter(request => request.status !== 'Declined')
                  .map(request => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.clientId}</td>
                    <td>{request.projectAddress}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={request.assignedEmployeeId || ''}
                        onChange={(e) => handleProjectManagerChange(Number(request.id), e.target.value)}
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
                      <span className={`badge ${getRequestStatusBadgeClass(request.status ?? "")}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => openRequestDetail(Number(request.id))}
                      >
                        Details
                      </Button>
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
        onDeny={async (id) => {
          closeRequestDetail();
          updateRFQMutation.mutate({
            rfqId: BigInt(id),
            rfq: { status: RFQStatus.Declined }
          }, 
          {
            onError: (error) => {
              console.error('Failed to update request status:', error);
              setErrorMessage('Failed to update request status. Please try again.');
            }
          });
        }} 
      />

      {/* Quote Estimate Modal */}
      <QuoteEstimateModal
        show={showQuoteModal}
        onClose={closeQuoteEstimate}
        rfqId={quoteRequestId}
        onQuoteSent={() => {
          closeQuoteEstimate();
          refetch();
        }}
      />
    </div>
  );
};

export default Requests;