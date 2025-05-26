import { apiClient } from '../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { ProjectOutputDTO } from "./project.types";
import { bigIntConverter } from '../../utils/bigIntConvert';

// Fetch all projects (output DTO)
export async function fetchProjects(
    msalInstance: IPublicClientApplication
): Promise<ProjectOutputDTO[]> {
    const response = await apiClient(msalInstance).get(`/projects`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch projects`);
    }
    return response.data.map((project: any) => ({
        ...project,
        id: bigIntConverter.fromAPI(project.id),
        rfqId: project.rfqId ? bigIntConverter.fromAPI(project.rfqId) : null
    }));
}

// Fetch a single project by id (output DTO)
export async function fetchProjectById(
    id: number | bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectOutputDTO> {
    const response = await apiClient(msalInstance).get(`/projects/${bigIntConverter.toAPI(id)}`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch project ${id}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        rfqId: response.data.rfqId ? bigIntConverter.fromAPI(response.data.rfqId) : null
    };
}

// Create a new project (output DTO)
export async function createProject(
    data: Partial<ProjectOutputDTO>,
    msalInstance: IPublicClientApplication
): Promise<ProjectOutputDTO> {
    const response = await apiClient(msalInstance).post(`/projects`, data, {});
    if (!response.data) {
        throw new Error(`Failed to create project`);
    }
    return {
        ...data,
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        rfqId: response.data.rfqId ? bigIntConverter.fromAPI(response.data.rfqId) : null,
        renovationType: response.data.renovationType || data.renovationType
    };
}

// Update a project (special PUT endpoint)
export async function updateProject(
    id: number,
    data: Partial<ProjectOutputDTO>,
    msalInstance: IPublicClientApplication
): Promise<ProjectOutputDTO> {
    const response = await apiClient(msalInstance).put(`/projects/${bigIntConverter.toAPI(id)}`,
        data, {});
    if (!response.data) {
        throw new Error(`Failed to update project ${id}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        rfqId: response.data.rfqId ? bigIntConverter.fromAPI(response.data.rfqId) : null
    };
}

// Delete a project
export async function deleteProject(
    id: number,
    msalInstance: IPublicClientApplication
): Promise<void> {
    const response = await apiClient(msalInstance).delete(`/projects/${id}`, {});
    if (response.status !== 204) {
        throw new Error(`Failed to delete project ${id}`);
    }
}

// Approve project quote (special endpoint, no body)
export async function approveProjectQuote(
    id: number,
    msalInstance: IPublicClientApplication
): Promise<void> {
    const response = await apiClient(msalInstance).put(`/projects/${id}/ApproveQuote`, {});
    if (response.status !== 204) {
        throw new Error(`Failed to approve quote for project ${id}`);
    }
}
