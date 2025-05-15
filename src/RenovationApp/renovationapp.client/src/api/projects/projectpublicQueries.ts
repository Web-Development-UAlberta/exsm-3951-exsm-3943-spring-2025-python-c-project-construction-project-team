import { IPublicClientApplication } from "@azure/msal-browser";
import { apiClient } from '../axios';
import { ProjectPublicInfo, FileDownload } from "./project.types";


export async function fetchPublicProjects(msalInstance: IPublicClientApplication): Promise<ProjectPublicInfo[]> {
    const response = await apiClient(msalInstance).get(`/projects-pub`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch public projects`);
    }
    return response.data;
}

export async function fetchPublicProjectImageURLs(msalInstance: IPublicClientApplication, projectId: bigint): Promise<FileDownload[]> {
    const response = await apiClient(msalInstance).get(`/projects-pub/${projectId}/public-images`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch all images for project with ID ${projectId}`);
    }
    return response.data;
}