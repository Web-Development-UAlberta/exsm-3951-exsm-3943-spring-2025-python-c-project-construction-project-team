import { apiClient } from '../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { ClientInvoice, ClientInvoiceDTO } from "./project.types";

// Fetch all client invoices for a project
export async function fetchClientInvoices(projectId: bigint, msalInstance: IPublicClientApplication): Promise<ClientInvoice[]> {
    const response = await apiClient(msalInstance).get(`/projects/${projectId}/clientinvoices`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch client invoices for project ${projectId}`);
    }
    return response.data;
}

// Fetch a single client invoice by id
export async function fetchClientInvoiceById(
    projectId: bigint,
    invoiceId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ClientInvoice> {
    const response = await apiClient(msalInstance).get(`/projects/${projectId}/clientinvoices/${invoiceId}`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch client invoice ${invoiceId}`);
    }
    return response.data;
}

// Create a new client invoice
export async function createClientInvoice(
    projectId: bigint,
    invoice: ClientInvoiceDTO,
    msalInstance: IPublicClientApplication
): Promise<ClientInvoice> {
    const response = await apiClient(msalInstance).post(`/projects/${projectId}/clientinvoices`, invoice, {});
    if (!response.data) {
        throw new Error(`Failed to create client invoice for project ${projectId}`);
    }
    return response.data;
}

// Update a client invoice
export async function updateClientInvoice(
    projectId: bigint,
    invoiceId: bigint,
    invoice: ClientInvoiceDTO,
    msalInstance: IPublicClientApplication
): Promise<ClientInvoice> {
    const response = await apiClient(msalInstance).put(`/projects/${projectId}/clientinvoices/${invoiceId}`, invoice, {});
    if (!response.data) {
        throw new Error(`Failed to update client invoice ${invoiceId}`);
    }
    return response.data;
}

// Delete a client invoice
export async function deleteClientInvoice(
    projectId: bigint,
    invoiceId: bigint,
    msalInstance: IPublicClientApplication
): Promise<boolean> {
    const response = await apiClient(msalInstance).delete(`/projects/${projectId}/clientinvoices/${invoiceId}`, {});
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
    const response = await apiClient(msalInstance).put(`/projects/${projectId}/clientinvoices/${invoiceId}/pay`, {});
    if (!response.data) {
        throw new Error(`Failed to mark client invoice ${invoiceId} as paid`);
    }
    return response.data;
}
