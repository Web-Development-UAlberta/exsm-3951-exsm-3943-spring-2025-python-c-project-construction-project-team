import { apiClient } from '../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import {
    ProjectService,
    ProjectServiceCreateDTO,
    ProjectServiceUpdateDTO
} from "./project.types";

// Fetch all services for a project
export async function fetchProjectServices(
    projectId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectService[]> {
    const response = await apiClient(msalInstance).get(`/projects/${projectId}/services`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch services for project ${projectId}`);
    }
    return response.data;
}

// Fetch a single service by id
export async function fetchProjectServiceById(
    projectId: bigint,
    serviceId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectService> {
    const response = await apiClient(msalInstance).get(`/projects/${projectId}/services/${serviceId}`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch service ${serviceId}`);
    }
    return response.data;
}

// Create a new service
export async function createProjectService(
    projectId: bigint,
    service: ProjectServiceCreateDTO,
    msalInstance: IPublicClientApplication
): Promise<ProjectService> {
    const response = await apiClient(msalInstance).post(`/projects/${projectId}/services`, service, {});
    if (!response.data) {
        throw new Error(`Failed to create service for project ${projectId}`);
    }
    return response.data;
}

// Update a service
export async function updateProjectService(
    projectId: bigint,
    serviceId: bigint,
    service: ProjectServiceUpdateDTO,
    msalInstance: IPublicClientApplication
): Promise<ProjectService> {
    const response = await apiClient(msalInstance).put(`/projects/${projectId}/services/${serviceId}`, service, {});
    if (!response.data) {
        throw new Error(`Failed to update service ${serviceId}`);
    }
    return response.data;
}

// Delete a service
export async function deleteProjectService(
    projectId: bigint,
    serviceId: bigint,
    msalInstance: IPublicClientApplication
): Promise<boolean> {
    const response = await apiClient(msalInstance).delete(`/projects/${projectId}/services/${serviceId}`, {});
    if (response.status !== 204) {
        throw new Error(`Failed to delete service ${serviceId}`);
    }
    return true;
}
