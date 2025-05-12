// components/RequestDetailsModal.tsx
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { getStatusBadgeClass } from '../../../../utils/getStatusBadgeClass';
import { RequestItem } from '../../../../types/client_types';
import { RequestDetailSection } from './RequestDetailSection';
import { RequestFilesSection } from './RequestFilesSection';


interface RequestDetailsModalProps {
  show: boolean;
  request: RequestItem | null;
  onClose: () => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  show,
  request,
  onClose
}) => {
  if (!request) return null;

  return (
    <Modal 
      show={show} 
      onHide={onClose}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Request Detail <Badge className={getStatusBadgeClass(request.status)}>
            {request.status}
          </Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid px-0">
          <RequestDetailSection request={request} />
          
          <div className="row mb-4">
            <div className="col-12">
              <h5 className="mb-3">Description</h5>
              <p>{request.description}</p>
            </div>
          </div>

          {request.message && (
            <div className="row mb-4">
              <div className="col-12">
                <h5 className="mb-3">Additional Notes</h5>
                <p>{request.message}</p>
              </div>
            </div>
          )}

          {request.files && request.files.length > 0 && (
            <RequestFilesSection files={request.files} />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};