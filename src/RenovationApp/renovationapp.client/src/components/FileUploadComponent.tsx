import React, { useState } from 'react';

interface FileUploadComponentProps {
    projectId: string;
    apiBaseUrl: string;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ projectId, apiBaseUrl }) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [description, setDescription] = useState('');
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !fileName) {
            setUploadStatus('Please select a file and provide a file name.');
            return;
        }

        try {
            // Step 1: Get the presigned upload URL
            const response = await fetch(`${apiBaseUrl}/Files/upload-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
                body: JSON.stringify({
                    projectId,
                    fileType: 'image',
                    fileName,
                    description,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get upload URL');
            }

            const { url } = await response.json();

            // Step 2: Upload the file to the presigned URL
            const uploadResponse = await fetch(url, {
                method: 'PUT',
                body: file,
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload file');
            }

            setUploadStatus('File uploaded successfully!');
        } catch (error) {
            setUploadStatus(`Error: ${(error as Error).message}`);
        }
    };

    return (
        <div>
            <h2>Upload a File</h2>
            <div>
                <label>
                    File:
                    <input type="file" onChange={handleFileChange} />
                </label>
            </div>
            <div>
                <label>
                    File Name:
                    <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
            </div>
            <button onClick={handleUpload}>Upload</button>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
};

export default FileUploadComponent;
