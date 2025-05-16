import React from 'react';
import { RFQImage } from '../../../../api/rfq/rfq.types';

interface Files {
  files: RFQImage[];
}

export const RequestFilesSection: React.FC<Files> = ({ files }) => {

  return (
    <div className="row">
      <div className="col-12">
        <h5 className="mb-3">Attached Files</h5>
        {files.length === 0 ? (
          <p>No files attached.</p>
        ) : (
          <div className='d-flex'>
            {files.map((file, index) => (
              <li key={index} className="list-group-item">
                <img
                  src={file.imageUri}
                  alt={file.fileName}
                  className="me-3"
                  style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div>
                  <strong>{file.fileName}</strong>
                  <small>Uploaded: {new Date(file.uploadedAt).toLocaleString()}</small>
                </div>
              </li>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
