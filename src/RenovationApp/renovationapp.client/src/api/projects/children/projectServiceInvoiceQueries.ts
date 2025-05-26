import { apiClient } from '../../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { ProjectServiceInvoice, ProjectServiceInvoiceDTO } from "../project.types";
import { bigIntConverter } from '../../../utils/bigIntConvert';

// Fetch all invoices for a service
export async function fetchProjectServiceInvoices(
    projectId: bigint,
    serviceId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectServiceInvoice[]> {
    const response = await apiClient(msalInstance).get(`/projects/${bigIntConverter.toAPI(projectId)}/services/${bigIntConverter.toAPI(serviceId)}/invoice`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch invoices for service ${serviceId}`);
    }
    return response.data.map((invoice: any) => ({
        ...invoice,
        id: bigIntConverter.fromAPI(invoice.id),
        projectId: bigIntConverter.fromAPI(invoice.projectId),
        serviceId: bigIntConverter.fromAPI(invoice.serviceId),
    }));
}

// Fetch a single invoice by id
export async function fetchProjectServiceInvoiceById(
    projectId: bigint,
    serviceId: bigint,
    invoiceId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectServiceInvoice> {
    const response = await apiClient(msalInstance).get(`/projects/${bigIntConverter.toAPI(projectId)}/services/${bigIntConverter.toAPI(serviceId)}/invoice/${bigIntConverter.toAPI(invoiceId)}`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch invoice ${invoiceId}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId),
        serviceId: bigIntConverter.fromAPI(response.data.serviceId),
    }
}

// Create a new invoice
export async function createProjectServiceInvoice(
    projectId: bigint,
    serviceId: bigint,
    invoice: ProjectServiceInvoiceDTO,
    msalInstance: IPublicClientApplication
): Promise<ProjectServiceInvoice> {
    const response = await apiClient(msalInstance).post(`/projects/${bigIntConverter.toAPI(projectId)}/services/${bigIntConverter.toAPI(serviceId)}/invoice`, invoice, {});
    if (!response.data) {
        throw new Error(`Failed to create invoice for service ${serviceId}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId),
        serviceId: bigIntConverter.fromAPI(response.data.serviceId),
    }
}

// Update an invoice
export async function updateProjectServiceInvoice(
    projectId: bigint,
    serviceId: bigint,
    invoiceId: bigint,
    invoice: ProjectServiceInvoiceDTO,
    msalInstance: IPublicClientApplication
): Promise<ProjectServiceInvoice> {
    const response = await apiClient(msalInstance).put(`/projects/${bigIntConverter.toAPI(projectId)}/services/${bigIntConverter.toAPI(serviceId)}/invoice/${bigIntConverter.toAPI(invoiceId)}`, invoice, {});
    if (!response.data) {
        throw new Error(`Failed to update invoice ${invoiceId}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId),
        serviceId: bigIntConverter.fromAPI(response.data.serviceId),
    }
}

// Delete an invoice
export async function deleteProjectServiceInvoice(
    projectId: bigint,
    serviceId: bigint,
    invoiceId: bigint,
    msalInstance: IPublicClientApplication
): Promise<boolean> {
    const response = await apiClient(msalInstance).delete(`/projects/${bigIntConverter.toAPI(projectId)}/services/${bigIntConverter.toAPI(serviceId)}/invoice/${bigIntConverter.toAPI(invoiceId)}`, {});
    if (response.status !== 204) {
        throw new Error(`Failed to delete invoice ${invoiceId}`);
    }
    return true;
}
