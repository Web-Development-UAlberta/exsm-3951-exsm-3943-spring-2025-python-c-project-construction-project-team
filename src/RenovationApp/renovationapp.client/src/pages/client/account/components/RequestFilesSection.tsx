// components/RequestFilesSection.tsx
import React from 'react';

interface RequestFilesSectionProps {
  files: string[];
}

export const RequestFilesSection: React.FC<RequestFilesSectionProps> = ({ files }) => {
  return (
    <div className="row">
      <div className="col-12">
        <h5 className="mb-3">Attached Files</h5>
        <ul className="list-group">
          {files.map((file, index) => (
            <li key={index} className="list-group-item d-flex align-items-center">
              <i className="bi bi-file-earmark me-2"></i>
              {file}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};