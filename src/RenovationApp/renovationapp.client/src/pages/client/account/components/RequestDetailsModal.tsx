// components/RequestDetailsModal.tsx
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from '../../../../components/ButtonComponent/Button';
import Badge from 'react-bootstrap/Badge';
import { getRequestStatusBadgeClass } from '../../../../utils/getStatusBadgeClass';
import { RequestDetailSection } from './RequestDetailSection';
import { RequestFilesSection } from './RequestFilesSection';
import { RFQ } from '../../../../api/rfq/rfq.types';
import { getRFQImagesByRFQId } from '../../../../api/rfq/rfq';
import { useMsal } from '@azure/msal-react';


interface RequestDetailsModalProps {
  show: boolean;
  request: RFQ | null;
  onClose: () => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  show,
  request,
  onClose
}) => {
  if (!request) return null;
  const { instance } = useMsal();
  const { data: files } = getRFQImagesByRFQId(request.id, instance);

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Request Detail <Badge className={getRequestStatusBadgeClass(request.status ?? "")}>
            {request.status}
          </Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid px-0">
          <RequestDetailSection request={request} />

          <div className="row mb-4">
            <div className="col-12">
              <h5 className="mb-3">Additional Notes</h5>
              <p>{request.description}</p>
            </div>
          </div>

          {files && files.length > 0 && (
            <RequestFilesSection files={files} />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};