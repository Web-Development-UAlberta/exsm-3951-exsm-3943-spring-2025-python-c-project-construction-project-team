import { apiClient } from '../../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import {
    ProjectService,
    ProjectServiceCreateDTO,
    ProjectServiceUpdateDTO
} from "../project.types";
import { bigIntConverter } from '../../../utils/bigIntConvert';

// Fetch all services for a project
export async function fetchProjectServices(
    projectId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectService[]> {
    const response = await apiClient(msalInstance).get(`/projects/${bigIntConverter.toAPI(projectId)}/services`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch services for project ${projectId}`);
    }
    return response.data.map((service: any) => ({
        ...service,
        id: bigIntConverter.fromAPI(service.id),
        projectId: bigIntConverter.fromAPI(service.projectId)
    }));
}

// Fetch a single service by id
export async function fetchProjectServiceById(
    projectId: bigint,
    serviceId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectService> {
    const response = await apiClient(msalInstance).get(`/projects/${bigIntConverter.toAPI(projectId)}/services/${bigIntConverter.toAPI(serviceId)}`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch service ${serviceId}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId)
    }
}

// Create a new service
export async function createProjectService(
    projectId: bigint,
    service: ProjectServiceCreateDTO,
    msalInstance: IPublicClientApplication
): Promise<ProjectService> {
    const response = await apiClient(msalInstance).post(`/projects/${bigIntConverter.toAPI(projectId)}/services`, service, {});
    if (!response.data) {
        throw new Error(`Failed to create service for project ${projectId}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId)
    }
}

// Update a service
export async function updateProjectService(
    projectId: bigint,
    serviceId: bigint,
    service: ProjectServiceUpdateDTO,
    msalInstance: IPublicClientApplication
): Promise<ProjectService> {
    const response = await apiClient(msalInstance).put(`/projects/${bigIntConverter.toAPI(projectId)}/services/${bigIntConverter.toAPI(serviceId)}`, service, {});
    if (!response.data) {
        throw new Error(`Failed to update service ${serviceId}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId)
    }
}

// Delete a service
export async function deleteProjectService(
    projectId: bigint,
    serviceId: bigint,
    msalInstance: IPublicClientApplication
): Promise<boolean> {
    const response = await apiClient(msalInstance).delete(`/projects/${bigIntConverter.toAPI(projectId)}/services/${bigIntConverter.toAPI(serviceId)}`, {});
    if (response.status !== 204) {
        throw new Error(`Failed to delete service ${serviceId}`);
    }
    return true;
}
