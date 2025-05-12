// components/RequestDetailSection.tsx
import React from 'react';
import { RequestItem } from '../../../../types/client_types';

interface RequestDetailSectionProps {
  request: RequestItem;
}

export const RequestDetailSection: React.FC<RequestDetailSectionProps> = ({ request }) => {
  // Render selected services as a comma-separated list
  const renderSelectedServices = (services?: {
    kitchenRemodel?: boolean;
    homeAdditions?: boolean;
    basementFinishing?: boolean;
    bathroomRenovation?: boolean;
  }) => {
    if (!services) return 'None';
    
    const selectedServices = [];
    if (services.kitchenRemodel) selectedServices.push('Kitchen Remodel');
    if (services.homeAdditions) selectedServices.push('Home Additions');
    if (services.basementFinishing) selectedServices.push('Basement Finishing');
    if (services.bathroomRenovation) selectedServices.push('Bathroom Renovation');
    
    return selectedServices.length > 0 ? selectedServices.join(', ') : 'None';
  };

  return (
    <div className="row mb-4">
      <div className="col-md-6">
        <h5 className="mb-3">Request Information</h5>
        <div className="mb-2">
          <span className="fw-bold">Request ID:</span> {request.id}
        </div>
        <div className="mb-2">
          <span className="fw-bold">Submission Date:</span> {new Date(request.date).toLocaleDateString()}
        </div>
        <div className="mb-2">
          <span className="fw-bold">Type:</span> {request.type}
        </div>
        <div className="mb-2">
          <span className="fw-bold">Project Address:</span> {request.projectAddress}
        </div>
      </div>
      <div className="col-md-6">
        <h5 className="mb-3">Project Details</h5>
        <div className="mb-2">
          <span className="fw-bold">Services:</span> {renderSelectedServices(request.services)}
        </div>
        <div className="mb-2">
          <span className="fw-bold">Room Size:</span> {request.roomSize}
        </div>
        <div className="mb-2">
          <span className="fw-bold">Budget:</span> {request.budget}
        </div>
        <div className="mb-2">
          <span className="fw-bold">Preferred Materials:</span> {request.preferredMaterials || 'Not specified'}
        </div>
      </div>
    </div>
  );
};