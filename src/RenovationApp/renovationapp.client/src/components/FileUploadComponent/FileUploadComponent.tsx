import React, { useState, useId } from 'react';
import { IPublicClientApplication } from '@azure/msal-browser';
import { silentRequest } from '../../config/authConfig';
import { Button } from '../ButtonComponent/Button';
import { TextInput } from '../InputComponent/TextInput';

interface FileUploadComponentProps {
    projectId: string;
    apiBaseUrl: string;
    backendRootUrl: string;
    msalInstance: IPublicClientApplication;
}

export const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ projectId, apiBaseUrl, backendRootUrl, msalInstance }) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [description, setDescription] = useState('');
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'image' | 'document'>('image');
    const [isLoading, setIsLoading] = useState(false);

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

        setIsLoading(true); // Start Loading
        setUploadStatus(null);

        try {
            // Get the token
            const token = await msalInstance.acquireTokenSilent(silentRequest);

            // Step 1: Get the presigned upload URL
            const response = await fetch(`${apiBaseUrl}/RFQImage/upload-url`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'accept': '*/*',
                    'Authorization': `Bearer ${token.accessToken}`
                },
                body: JSON.stringify({
                    projectId,
                    fileType,
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
        finally {
            setIsLoading(false); // Stop Loading
        }
    };

    const fileInputId = useId();
    const fileNameInputId = useId();
    const descriptionInputId = useId();
    const imageFileId = useId();
    const fileTypeId = useId();

    return (
        <div>
            <h2>Upload a File</h2>
            <div>
                <label htmlFor={fileInputId}>
                    File:
                    <input id={fileInputId} type="file" onChange={handleFileChange} data-testid="file-input"/>
                </label>
            </div>
            <div className="col-md-6">
                    <TextInput
                        id={fileNameInputId}
                        label="File Name"
                        placeholder="Enter file name"
                        required
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        error={!fileName && uploadStatus ? 'File name is required' : ''}
                        data-testid="file-name-input"
                    />
            </div>
            <div>
                <label>File Type:</label>
                <div>
                    <label htmlFor={imageFileId}>
                        <input
                            id={imageFileId}
                            type="radio"
                            value="image"
                            checked={fileType === 'image'}
                            onChange={() => setFileType('image')}
                            data-testid="image-radio"
                        />
                        Image
                    </label>
                    <label style={{ marginLeft: '10px' }} htmlFor={fileTypeId}>
                        <input
                            id={fileTypeId}
                            type="radio"
                            value="document"
                            checked={fileType === 'document'}
                            onChange={() => setFileType('document')}
                            data-testid="document-radio"
                        />
                        File
                    </label>
                </div>
            </div>
            <div>
                <label htmlFor={descriptionInputId}>
                    Description:
                    <textarea
                        id={descriptionInputId}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        data-testid="description-input"
                    />
                </label>
            </div>
            <Button 
                onClick={handleUpload}
                loading={isLoading}
                disabled={isLoading}
                variant="primary"
                className="mt-3"
                data-testid="upload-button"
            >Upload</Button>
            {uploadStatus && <p data-testid="status-message">{uploadStatus}</p>}
        </div>
    );
};

export default FileUploadComponent;
