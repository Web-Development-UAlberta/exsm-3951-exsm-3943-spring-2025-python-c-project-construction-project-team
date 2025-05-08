import React, { useState } from 'react';

interface FileUploadComponentProps {
    projectId: string;
    apiBaseUrl: string;
    backendRootUrl: string; // New prop for the backend root URL
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ projectId, apiBaseUrl, backendRootUrl }) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [description, setDescription] = useState('');
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'image' | 'file'>('image');

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
                    fileType, // Use the selected file type from radio buttons
                    fileName,
                    description,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to get upload URL: ${response.status} ${response.statusText}`);
            }

            const { url } = await response.json();

            // Convert relative URL to full URL
            const fullUrl = url.startsWith('/') ? `${backendRootUrl}${url}` : url;
            
            console.log('Uploading to URL:', fullUrl);
            console.log('File type:', file?.type || 'unknown');
            
            // Step 2: Upload the file to the presigned URL
            try {
                const uploadResponse = await fetch(fullUrl, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': file?.type || 'application/octet-stream',
                        'accept': '*/*' 
                    },
                    body: file,
                });

                if (!uploadResponse.ok) {
                    throw new Error(`Failed to upload file: ${uploadResponse.status} ${uploadResponse.statusText}`);
                }
                
                setUploadStatus('File uploaded successfully!');
                
                // Clear form after successful upload
                setFile(null);
                setFileName('');
                setDescription('');
                setFileType('image');
                
                // Also clear the file input element
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }
            } catch (uploadError) {
                console.error('Upload error:', uploadError);
                console.error('Upload URL was:', fullUrl);
                setUploadStatus(`Upload error: ${uploadError instanceof Error ? uploadError.message : 'Unknown upload error'}`);
            }
        } catch (error) {
            console.error('Upload error details:', error);
            setUploadStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
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
                <label>File Type:</label>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="image"
                            checked={fileType === 'image'}
                            onChange={() => setFileType('image')}
                        />
                        Image
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                        <input
                            type="radio"
                            value="file"
                            checked={fileType === 'file'}
                            onChange={() => setFileType('file')}
                        />
                        File
                    </label>
                </div>
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
