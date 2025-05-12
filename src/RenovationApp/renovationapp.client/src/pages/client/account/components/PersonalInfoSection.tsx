// components/PersonalInfoSection.tsx
import React from 'react';
import { PersonalInformation } from '../../../../types/client_types';

interface PersonalInfoSectionProps {
  isEditing: boolean;
  personalInfo: PersonalInformation;
  tempPersonalInfo: PersonalInformation;
  onEdit: () => void;
  onCancel: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  isEditing,
  personalInfo,
  tempPersonalInfo,
  onEdit,
  onCancel,
  onChange,
  onSave
}) => {
  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="border-bottom w-100 pb-2">Personal Information</h3>
        <button
          className="btn btn-sm btn-outline-secondary ms-3"
          onClick={isEditing ? onCancel : onEdit}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        // Edit form
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              value={tempPersonalInfo.firstName}
              onChange={onChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              value={tempPersonalInfo.lastName}
              onChange={onChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={tempPersonalInfo.email}
              onChange={onChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={tempPersonalInfo.phone}
              onChange={onChange}
            />
          </div>
          <div className="col-12 d-flex justify-content-end mt-3">
            <button
              className="btn btn-primary"
              onClick={onSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        // Display info
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="fw-bold d-block">First Name</label>
            <span>{personalInfo.firstName}</span>
          </div>
          <div className="col-md-6 mb-3">
            <label className="fw-bold d-block">Last Name</label>
            <span>{personalInfo.lastName}</span>
          </div>
          <div className="col-md-6 mb-3">
            <label className="fw-bold d-block">Email Address</label>
            <span>{personalInfo.email}</span>
          </div>
          <div className="col-md-6 mb-3">
            <label className="fw-bold d-block">Phone Number</label>
            <span>{personalInfo.phone}</span>
          </div>
        </div>
      )}
    </div>
  );
};