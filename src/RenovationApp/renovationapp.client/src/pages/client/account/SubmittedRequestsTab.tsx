import { useState } from 'react';
import { getRequestStatusBadgeClass } from '../../../utils/getStatusBadgeClass';
import { RequestDetailsModal } from './components/RequestDetailsModal';
import { useMsal } from '@azure/msal-react';
import { getAllRFQs } from '../../../api/rfq/rfq';
import { RFQ } from '../../../api/rfq/rfq.types';

const SubmittedRequestsTab = () => {

  // Request Detail Modal State
  const { instance } = useMsal();
  const { data: submittedRequests } = getAllRFQs(instance);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RFQ | null>(null);
  // Request detail modal handlers
  const openRequestDetail = (request: RFQ) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const closeRequestDetail = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  return (
    <div className="table-responsive">

      {submittedRequests && submittedRequests.length === 0 ? (
        <div className="alert alert-info">
          You haven't submitted any renovation requests yet.
        </div>
      ) : (
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
            {submittedRequests && submittedRequests.map(request => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{new Date(request.createdTimestamp).toLocaleDateString()}</td>
                <td>{request.renovationType}</td>
                <td>
                  <span className={`badge ${getRequestStatusBadgeClass(request.status ?? "")}`}>
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

      )}


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