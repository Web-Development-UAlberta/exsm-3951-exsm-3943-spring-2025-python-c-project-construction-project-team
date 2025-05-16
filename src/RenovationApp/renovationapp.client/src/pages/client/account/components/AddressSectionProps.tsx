// components/AddressSection.tsx
import React from 'react';
import { Address } from '../../../../types/client_types';
import { graphMe } from '../../../../api/identity/graph.types';

interface AddressSectionProps {
  isEditing: boolean;
  address?: graphMe;
  tempAddress: Address;
  onEdit: () => void;
  onCancel: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  isEditing,
  address,
  tempAddress,
  onEdit,
  onCancel,
  onChange,
  onSave
}) => {
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="border-bottom w-100 pb-2">Address</h3>
        <button
          className="btn btn-sm btn-outline-secondary ms-3"
          onClick={isEditing ? onCancel : onEdit}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Display address */}
      {!isEditing && (
        <div className="p-3 mb-3">
          <div className="d-flex justify-content-between">
            <div>
              <div>{address?.streetAddress}</div>
              <div>{address?.city}, {address?.state} {address?.postalCode}</div>
              <div>{address?.country}</div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Form */}
      {isEditing && (
        <div className="border rounded p-3 mb-3">
          <h5>Edit Address</h5>
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="street" className="form-label">Street Address</label>
              <input
                type="text"
                className="form-control"
                id="street"
                name="street"
                value={tempAddress.street}
                onChange={onChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="city" className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                value={tempAddress.city}
                onChange={onChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="province" className="form-label">Province/State</label>
              <input
                type="text"
                className="form-control"
                id="province"
                name="province"
                value={tempAddress.province}
                onChange={onChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="postalCode" className="form-label">Postal Code</label>
              <input
                type="text"
                className="form-control"
                id="postalCode"
                name="postalCode"
                value={tempAddress.postalCode}
                onChange={onChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="country" className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                id="country"
                name="country"
                value={tempAddress.country}
                onChange={onChange}
              />
            </div>
            <div className="col-12 d-flex justify-content-end gap-2 mt-3">
              <button
                className="btn btn-primary"
                onClick={onSave}
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};