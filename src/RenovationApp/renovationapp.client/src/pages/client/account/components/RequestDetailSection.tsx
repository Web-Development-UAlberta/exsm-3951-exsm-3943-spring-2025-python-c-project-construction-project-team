// components/RequestDetailSection.tsx
import React from 'react';
import { RFQ } from '../../../../api/rfq/rfq.types';

interface RequestDetailSectionProps {
  request: RFQ
}

export const RequestDetailSection: React.FC<RequestDetailSectionProps> = ({ request }) => {

  return (
    <div className="row mb-4">
      <div className="col-md-6">
        <h5 className="mb-3">Request Information</h5>
        <div className="mb-2">
          <span className="fw-bold">Request ID:</span> {request.id}
        </div>
        <div className="mb-2">
          <span className="fw-bold">Submission Date:</span> {new Date(request.createdTimestamp).toLocaleDateString()}
        </div>
        <div className="mb-2">
          <span className="fw-bold">Type:</span> {request.renovationType}
        </div>
        <div className="mb-2">
          <span className="fw-bold">Project Address:</span> {request.projectAddress}
        </div>
      </div>
      <div className="col-md-6">
        <h5 className="mb-3">Project Details</h5>
        <div className="mb-2">
          <span className="fw-bold">Room Size:</span> {request.roomSize}
        </div>
        <div className="mb-2">
          <span className="fw-bold">Budget:</span> {request.budget}
        </div>
        <div className="mb-2">
          <span className="fw-bold">Preferred Materials:</span> {request.preferredMaterial || 'Not specified'}
        </div>
      </div>
    </div>
  );
};