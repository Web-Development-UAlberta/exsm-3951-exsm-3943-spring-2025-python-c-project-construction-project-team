// components/components/ReviewRequestDetailsModal.tsx
import React from 'react';
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
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  show,
  request,
  onClose,
  onAccept
}) => {
  if (!show || !request) {
    return null;
  }

  return (
    <div className={`modal ${show ? 'd-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">Review Request Details</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <div className="fw-bold">Client:</div>
              <div>{request.client}</div>
            </div>
            
            <div className="mb-3">
              <div className="fw-bold">Project Address:</div>
              <div>{request.project_address}</div>
            </div>
            
            <div className="mb-3">
              <div className="fw-bold">Renovation Type:</div>
              <div>{request.renovation_type}</div>
            </div>
            
            <div className="mb-3">
              <div className="fw-bold">Preferred Material:</div>
              <div>{request.preferred_material}</div>
            </div>
            
            <div className="mb-3">
              <div className="fw-bold">Budget:</div>
              <div>{request.budget}</div>
            </div>
            
            <div className="mb-3">
              <div className="fw-bold">Description:</div>
              <div>{request.description}</div>
            </div>
            
            <div className="mb-3">
            <div className="fw-bold">Files:</div>
            <div className="file-list">
              {request.files && request.files.length > 0 ? (
                request.files.map((file, index) => {
                  const fileName = file.fileName || file.imageUri?.split('/').pop() || `File ${index + 1}`;
                  const fileUrl = file.imageUri || '#';
                  
                  return (
                    <div key={index} className="mb-1">
                      <a
                        href={fileUrl}
                        className="text-decoration-none text-primary d-inline-flex align-items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-file-earmark me-2"></i>
                        {fileName}
                      </a>
                    </div>
                  );
                })
              ) : (
                <div className="text-muted">No files attached</div>
              )}
            </div>
          </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button 
              type="button" 
              className="btn btn-outline-primary px-4"
              onClick={() => onAccept(Number(request.id))}
            >
              Accept Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;