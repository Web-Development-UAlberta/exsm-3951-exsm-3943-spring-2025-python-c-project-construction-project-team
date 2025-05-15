import { apiClient } from '../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { ProjectFile } from "./project.types";

// Fetch all files for a project
export async function fetchProjectFiles(
    projectId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectFile[]> {
    const response = await apiClient(msalInstance).get(`/projects/${projectId}/files`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch files for project ${projectId}`);
    }
    return response.data;
}


// Multi-stage upload: get upload URL, then upload file
export async function uploadProjectFile(
    projectId: bigint,
    file: File,
    fileType: string,
    msalInstance: IPublicClientApplication
): Promise<boolean> {
    // Step 1: Get signed upload URL, passing fileName and fileType in the body
    const urlResponse = await apiClient(msalInstance).post(
        `/projects/${projectId}/files/upload-url`,
        { fileName: file.name, fileType: fileType},
    );
    if (!urlResponse.data || !urlResponse.data.uploadUrl) {
        throw new Error(`Failed to get upload URL for project ${projectId}`);
    }
    const uploadUrl = urlResponse.data.uploadUrl;

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
