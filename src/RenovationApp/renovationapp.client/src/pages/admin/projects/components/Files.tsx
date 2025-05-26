import React, { useEffect, useRef, useState } from "react";
import { IPublicClientApplication } from "@azure/msal-browser";
import {
  useProjectFiles,
  useDeleteProjectFile,
  useUploadProjectFile
} from "../../../../api/projects/children/projectFile";
import { toast } from "react-toastify";

type FileItem = {
  id: number;
  name: string;
  fileType: string;
  size: number;
  uploadedTimestamp: string;
  fileUri: string;
};

type Props = {
  projectId: bigint;
  instance: IPublicClientApplication;
};

const mockFiles: FileItem[] = [
  {
    id: 1,
    name: "project_plan.pdf",
    fileType: "PDF",
    size: 2.3 * 1024 * 1024,
    uploadedTimestamp: "01/05/2025",
    fileUri: "https://example.com/project_plan.pdf"
  },
  {
    id: 2,
    name: "measurements.xlsx",
    fileType: "Excel",
    size: 1.5 * 1024 * 1024,
    uploadedTimestamp: "01/07/2025",
    fileUri: "https://example.com/measurements.xlsx"
  },
  {
    id: 3,
    name: "site_photos.zip",
    fileType: "Archive",
    size: 15.2 * 1024 * 1024,
    uploadedTimestamp: "01/10/2025",
    fileUri: "https://example.com/site_photos.zip"
  }
];

const Files = ({ projectId, instance }: Props) => {
  const { data: apiFiles = [] } = useProjectFiles(projectId, instance);
  const deleteFile = useDeleteProjectFile(projectId, instance);
  const uploadFile = useUploadProjectFile(projectId, instance);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    // Combine mock and real API files for demonstration
    const transformedApiFiles: FileItem[] = apiFiles.map((file) => ({
      id: file.id,
      name: file.fileName,
      fileType: file.type,
      size: file.size ?? 0,
      uploadedTimestamp: new Date(file.uploadedTimestamp).toLocaleDateString(),
      fileUri: file.fileUri
    }));
    setFiles([...mockFiles, ...transformedApiFiles]);
  }, [apiFiles]);

  const handleDelete = (fileId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    deleteFile.mutate(BigInt(fileId), {
      onSuccess: () => {
        toast.success("File deleted successfully");
      },
      onError: () => toast.error("Failed to delete file")
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadFile.mutate({ file, fileType: 'document' }, {
  onSuccess: () => toast.success("File uploaded successfully"),
  onError: () => toast.error("File upload failed")
});
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-4">
          <h5 className="card-title">Project Files</h5>
          <>
            <input
              type="file"
              ref={fileInputRef}
              className="d-none"
              onChange={handleFileChange}
            />
            <button className="btn btn-primary" onClick={handleUploadClick}>
              <i className="bi bi-upload me-1"></i> Upload File
            </button>
          </>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead className="table-light">
              <tr>
                <th>File Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Uploaded Date</th>
                <th>Uploaded By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id}>
                  <td>{file.name}</td>
                  <td>{file.fileType}</td>
                  <td>{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                  <td>{file.uploadedTimestamp}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => window.open(file.fileUri, "_blank")}
                      title="View"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <a
                      className="btn btn-sm btn-outline-secondary me-2"
                      href={file.fileUri}
                      download
                      title="Download"
                    >
                      <i className="bi bi-download"></i>
                    </a>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(file.id)}
                      title="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Files;