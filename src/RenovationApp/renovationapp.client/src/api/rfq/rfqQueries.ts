import { apiClient } from '../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { RFQ, RFQCreate, RFQUpdate, RFQImage } from "./rfq.types";

export async function fetchRFQById(rfqId: bigint, msalInstance: IPublicClientApplication): Promise<RFQ> {
    const response = await apiClient(msalInstance).get(`/RFQ/${rfqId}`, {
        headers: { 'accept': '*/*' },
    });
    if (!response.data) {
        throw new Error(`Failed to fetch RFQ with ID ${rfqId}`);
    }
    return response.data;
}

export async function fetchAllRFQs(msalInstance: IPublicClientApplication): Promise<RFQ[]> {
    const response = await apiClient(msalInstance).get(`/RFQs`, {
        headers: { 'accept': '*/*' },
    });
    if (!response.data) {
        throw new Error(`Failed to fetch all RFQs`);
    }
    return response.data;
}

export async function createRFQ(rfq: RFQCreate, msalInstance: IPublicClientApplication): Promise<RFQ> {
    const response = await apiClient(msalInstance).post(`/RFQs`, rfq, {
        headers: { 'accept': '*/*' },
    });
    if (!response.data) {
        throw new Error(`Failed to create RFQ`);
    }
    return response.data;
}

export async function updateRFQ(rfqId: bigint, rfq: RFQUpdate, msalInstance: IPublicClientApplication): Promise<RFQ> {
    const response = await apiClient(msalInstance).put(`/RFQs/${rfqId}`, rfq, {
        headers: { 'accept': '*/*' },
    });
    if (!response.data) {
        throw new Error(`Failed to update RFQ with ID ${rfqId}`);
    }
    return response.data;
}


export async function fetchRFQImages(rfqId: bigint, msalInstance: IPublicClientApplication): Promise<RFQImage[]> {
    const response = await apiClient(msalInstance).get(`/RFQs/${rfqId}/images`, {
        headers: { 'accept': '*/*' },
    });
    if (!response.data) {
        throw new Error(`Failed to fetch RFQ images for RFQ with ID ${rfqId}`);
    }
    return response.data;
}

export async function uploadRFQImage(
    rfqId: bigint,
    file: File,
    fileName: string,
    msalInstance: IPublicClientApplication
): Promise<boolean> {
    // Step 1: Get signed upload URL, passing fileName in the body
    const urlResponse = await apiClient(msalInstance).post(
        `/rfq/${rfqId}/images/upload-url`,
        { fileName: fileName },
        { headers: { 'accept': '*/*' } }
    );
    if (!urlResponse.data || !urlResponse.data.uploadUrl) {
        throw new Error(`Failed to get upload URL for RFQ with ID ${rfqId}`);
    }
    const uploadUrl = urlResponse.data.uploadUrl;

    // Step 2: Upload file to signed URL
    const uploadResp = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type,
        },
    });

    if (!uploadResp.ok) {
        throw new Error(`Failed to upload image for RFQ with ID ${rfqId}`);
    }

    return true;
}