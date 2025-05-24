import { apiClient } from '../../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { ClientInvoice, ClientInvoiceDTO } from "../project.types";
import { bigIntConverter } from '../../../utils/bigIntConvert';

// Fetch all client invoices for a project
export async function fetchClientInvoices(projectId: bigint, msalInstance: IPublicClientApplication): Promise<ClientInvoice[]> {
    const response = await apiClient(msalInstance).get(`/projects/${bigIntConverter.toAPI(projectId)}/clientinvoices`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch client invoices for project ${projectId}`);
    }
    return response.data.map((invoice: ClientInvoice) => ({
        ...invoice,
        id: bigIntConverter.fromAPI(invoice.id),
        projectId: bigIntConverter.fromAPI(invoice.projectId)
    }));
}

// Fetch a single client invoice by id
export async function fetchClientInvoiceById(
    projectId: bigint,
    invoiceId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ClientInvoice> {
    const response = await apiClient(msalInstance).get(`/projects/${bigIntConverter.toAPI(projectId)}/clientinvoices/${bigIntConverter.toAPI(invoiceId)}`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch client invoice ${invoiceId}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId)
    }
}

// Create a new client invoice
export async function createClientInvoice(
    projectId: bigint,
    invoice: ClientInvoiceDTO,
    msalInstance: IPublicClientApplication
): Promise<ClientInvoice> {
    const response = await apiClient(msalInstance).post(`/projects/${bigIntConverter.toAPI(projectId)}/clientinvoices`, invoice, {});
    if (!response.data) {
        throw new Error(`Failed to create client invoice for project ${projectId}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId)
    };
}

// Update a client invoice
export async function updateClientInvoice(
    projectId: bigint,
    invoiceId: bigint,
    invoice: ClientInvoiceDTO,
    msalInstance: IPublicClientApplication
): Promise<ClientInvoice> {
    const response = await apiClient(msalInstance).put(`/projects/${bigIntConverter.toAPI(projectId)}/clientinvoices/${bigIntConverter.toAPI(invoiceId)}`, invoice, {});
    if (!response.data) {
        throw new Error(`Failed to update client invoice ${invoiceId}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId)
    }
}

// Delete a client invoice
export async function deleteClientInvoice(
    projectId: bigint,
    invoiceId: bigint,
    msalInstance: IPublicClientApplication
): Promise<boolean> {
    const response = await apiClient(msalInstance).delete(`/projects/${bigIntConverter.toAPI(projectId)}/clientinvoices/${bigIntConverter.toAPI(invoiceId)}`, {});
    if (response.status !== 204) {
        throw new Error(`Failed to delete client invoice ${invoiceId}`);
    }
    return true;
}

// Mark a client invoice as paid (special PUT endpoint, no body)
export async function payClientInvoice(
    projectId: bigint,
    invoiceId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ClientInvoice> {
    const response = await apiClient(msalInstance).put(`/projects/${bigIntConverter.toAPI(projectId)}/clientinvoices/${bigIntConverter.toAPI(invoiceId)}/pay`, {});
    if (!response.data) {
        throw new Error(`Failed to mark client invoice ${invoiceId} as paid`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId)
    };
}
