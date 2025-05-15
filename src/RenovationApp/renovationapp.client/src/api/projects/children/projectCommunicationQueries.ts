import { apiClient } from '../../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { ProjectCommunication, ProjectCommunicationDTO } from "../project.types";

// Fetch all communications for a project
export async function fetchProjectCommunications(
    projectId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectCommunication[]> {
    const response = await apiClient(msalInstance).get(`/projects/${projectId}/communications`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch communications for project ${projectId}`);
    }
    return response.data;
}

// Fetch a single communication by id
export async function fetchProjectCommunicationById(
    projectId: bigint,
    communicationId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectCommunication> {
    const response = await apiClient(msalInstance).get(`/projects/${projectId}/communications/${communicationId}`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch communication ${communicationId}`);
    }
    return response.data;
}

// Create a new communication
export async function createProjectCommunication(
    projectId: bigint,
    communication: ProjectCommunicationDTO,
    msalInstance: IPublicClientApplication
): Promise<ProjectCommunication> {
    const response = await apiClient(msalInstance).post(`/projects/${projectId}/communications`, communication, {});
    if (!response.data) {
        throw new Error(`Failed to create communication for project ${projectId}`);
    }
    return response.data;
}

// Update a communication
export async function updateProjectCommunication(
    projectId: bigint,
    communicationId: bigint,
    communication: ProjectCommunicationDTO,
    msalInstance: IPublicClientApplication
): Promise<ProjectCommunication> {
    const response = await apiClient(msalInstance).put(`/projects/${projectId}/communications/${communicationId}`, communication, {});
    if (!response.data) {
        throw new Error(`Failed to update communication ${communicationId}`);
    }
    return response.data;
}

// Delete a communication
export async function deleteProjectCommunication(
    projectId: bigint,
    communicationId: bigint,
    msalInstance: IPublicClientApplication
): Promise<boolean> {
    const response = await apiClient(msalInstance).delete(`/projects/${projectId}/communications/${communicationId}`, {});
    if (response.status !== 204) {
        throw new Error(`Failed to delete communication ${communicationId}`);
    }
    return true;
}
