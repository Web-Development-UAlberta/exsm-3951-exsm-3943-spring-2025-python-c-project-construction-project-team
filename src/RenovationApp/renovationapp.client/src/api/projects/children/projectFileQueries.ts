import { apiClient } from '../../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { ProjectFile } from "../project.types";
import { bigIntConverter } from '../../../utils/bigIntConvert';

// Fetch all files for a project
export async function fetchProjectFiles(
    projectId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectFile[]> {
    const response = await apiClient(msalInstance).get(`/projects/${bigIntConverter.toAPI(projectId)}/files`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch files for project ${projectId}`);
    }
    return response.data.map((file: any) => ({
        ...file,
        id: bigIntConverter.fromAPI(file.id),
        projectId: bigIntConverter.fromAPI(file.projectId),
    }));
}


// Multi-stage upload: get upload URL, then upload file
export async function uploadProjectFile(
    projectId: bigint,
    file: File,
    fileType: string,
    msalInstance: IPublicClientApplication
): Promise<boolean> {
    // Step 1: Get signed upload URL, passing fileName, fileType, and projectId in the body
    const urlResponse = await apiClient(msalInstance).post(
        `/projects/${bigIntConverter.toAPI(projectId)}/files/upload-url`,
        {
            fileName: file.name,
            fileType: fileType
        },
        { headers: { 'accept': '*/*' } }
    );
    console.log("urlResponse", urlResponse)
    // Check for url instead of uploadUrl based on your backend response
    if (urlResponse.status !== 200) {
        console.error("Upload URL response:", urlResponse.data);
        throw new Error(`Failed to get upload URL for project ${projectId}`);
    }

    const uploadUrl = urlResponse.data.url;

    // Step 2: Upload file to signed URL
    const uploadResp = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type,
        },
    });

    if (!uploadResp.ok) {
        throw new Error(`Failed to upload file for project ${projectId}`);
    }

    return true;
}