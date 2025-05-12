import { apiClient } from '../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery } from "@tanstack/react-query";
import { RFQ } from "./rfq.types";

async function fetchRFQById(rfqId: string, msalInstance: IPublicClientApplication): Promise<RFQ> {
    const response = await apiClient(msalInstance).get(`/RFQ/${rfqId}`, {
        headers: { 'accept': '*/*' },
    });
    if (!response.data) {
        throw new Error(`Failed to fetch RFQ with ID ${rfqId}`);
    }
    return response.data;
}

async function fetchRFQsByClientId(clientId: string, msalInstance: IPublicClientApplication): Promise<RFQ[]> {
    const response = await apiClient(msalInstance).get(`/RFQ/client/${clientId}`, {
        headers: { 'accept': '*/*' },
    });
    if (!response.data) {
        throw new Error(`Failed to fetch RFQs for client ID ${clientId}`);
    }
    return response.data;
}

async function fetchAllRFQs(msalInstance: IPublicClientApplication): Promise<RFQ[]> {
    const response = await apiClient(msalInstance).get(`/RFQ`, {
        headers: { 'accept': '*/*' },
    });
    if (!response.data) {
        throw new Error(`Failed to fetch all RFQs`);
    }
    return response.data;
}