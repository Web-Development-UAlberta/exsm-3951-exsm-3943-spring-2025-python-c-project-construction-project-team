// components/components/ReviewRequestDetailsModal.tsx
import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from '../../../../components/ButtonComponent/Button';
import { RFQImage } from '../../../../api/rfq/rfq.types';
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

interface RequestDetailsModalProps {
  show: boolean;
  request: RequestDetail | null;
  onClose: () => void;
  onAccept: (id: number) => void;
  onDeny: (id: number) => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  show,
  request,
  onClose,
  onAccept,
  onDeny
}) => {
  if (!show || !request) {
    return null;
  }

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Review Request Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h6>Client</h6>
          <p>{request.client}</p>
        </div>
        
        <div className="mb-3">
          <h6>Project Address</h6>
          <p>{request.project_address}</p>
        </div>
        
        <div className="mb-3">
          <h6>Renovation Type</h6>
          <p>{request.renovation_type}</p>
        </div>
        
        <div className="mb-3">
          <h6>Preferred Material</h6>
          <p>{request.preferred_material}</p>
        </div>
        
        <div className="mb-3">
          <h6>Budget</h6>
          <p>${request.budget.toLocaleString()}</p>
        </div>
        
        <div className="mb-3">
          <h6>Description</h6>
          <p>{request.description}</p>
        </div>
        
        <div className="mb-3">
          <h6>Files</h6>
          <div className="d-flex flex-wrap gap-2">
            {request.files.map((file, index) => (
              <a
                key={index}
                href={file.imageUri}
                className="text-decoration-none"
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.fileName || `File ${index + 1}`}
              </a>
            ))}
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer className="justify-content-between">
        <Button 
          variant="danger" 
          onClick={() => onDeny(request.id)} label="Deny"
        />
        <Button 
          variant="success" 
          onClick={() => onAccept(request.id)}
          label="Accept & Create Quote"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default RequestDetailsModal;