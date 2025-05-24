import { apiClient } from '../../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { ProjectServiceInvoice, ProjectServiceInvoiceDTO } from "../project.types";

// Fetch all invoices for a service
export async function fetchProjectServiceInvoices(
    projectId: bigint,
    serviceId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectServiceInvoice[]> {
    const response = await apiClient(msalInstance).get(`/projects/${projectId}/services/${serviceId}/invoice`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch invoices for service ${serviceId}`);
    }
    return response.data;
}

// Fetch a single invoice by id
export async function fetchProjectServiceInvoiceById(
    projectId: bigint,
    serviceId: bigint,
    invoiceId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectServiceInvoice> {
    const response = await apiClient(msalInstance).get(`/projects/${projectId}/services/${serviceId}/invoice/${invoiceId}`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch invoice ${invoiceId}`);
    }
    return response.data;
}

// Create a new invoice
export async function createProjectServiceInvoice(
    projectId: bigint,
    serviceId: bigint,
    invoice: ProjectServiceInvoiceDTO,
    msalInstance: IPublicClientApplication
): Promise<ProjectServiceInvoice> {
    const response = await apiClient(msalInstance).post(`/projects/${projectId}/services/${serviceId}/invoice`, invoice, {});
    if (!response.data) {
        throw new Error(`Failed to create invoice for service ${serviceId}`);
    }
    return response.data;
}

// Update an invoice
export async function updateProjectServiceInvoice(
    projectId: bigint,
    serviceId: bigint,
    invoiceId: bigint,
    invoice: ProjectServiceInvoiceDTO,
    msalInstance: IPublicClientApplication
): Promise<ProjectServiceInvoice> {
    const response = await apiClient(msalInstance).put(`/projects/${projectId}/services/${serviceId}/invoice/${invoiceId}`, invoice, {});
    if (!response.data) {
        throw new Error(`Failed to update invoice ${invoiceId}`);
    }
    return response.data;
}

// Delete an invoice
export async function deleteProjectServiceInvoice(
    projectId: bigint,
    serviceId: bigint,
    invoiceId: bigint,
    msalInstance: IPublicClientApplication
): Promise<boolean> {
    const response = await apiClient(msalInstance).delete(`/projects/${projectId}/services/${serviceId}/invoice/${invoiceId}`, {});
    if (response.status !== 204) {
        throw new Error(`Failed to delete invoice ${invoiceId}`);
    }
    return true;
}
