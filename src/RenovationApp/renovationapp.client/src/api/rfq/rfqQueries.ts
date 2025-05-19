import { apiClient } from '../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { RFQ, RFQCreate, RFQUpdate, RFQImage } from "./rfq.types";

export async function fetchRFQById(rfqId: bigint, msalInstance: IPublicClientApplication): Promise<RFQ> {
    const response = await apiClient(msalInstance).get(`/rfq/${rfqId}`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch RFQ with ID ${rfqId}`);
    }
    return response.data;
}

export async function fetchAllRFQs(msalInstance: IPublicClientApplication): Promise<RFQ[]> {
    const response = await apiClient(msalInstance).get(`/rfq`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch all RFQs`);
    }
    return response.data;
}

export async function createRFQ(rfq: RFQCreate, msalInstance: IPublicClientApplication): Promise<RFQ> {
    const response = await apiClient(msalInstance).post(`/rfq`, rfq, {});
    if (!response.data) {
        throw new Error(`Failed to create RFQ`);
    }
    return response.data;
}

export async function updateRFQ(rfqId: bigint, rfq: RFQUpdate, msalInstance: IPublicClientApplication): Promise<RFQ> {
    const response = await apiClient(msalInstance).put(`/rfq/${rfqId}`, rfq, {});
    if (!response.data) {
        throw new Error(`Failed to update RFQ with ID ${rfqId}`);
    }
    return response.data;
}


export async function fetchRFQImages(rfqId: bigint, msalInstance: IPublicClientApplication): Promise<RFQImage[]> {
    const response = await apiClient(msalInstance).get(`/rfq/${rfqId}/images`, {});
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
    console.log("urlResponse", urlResponse)

    if (urlResponse.status !== 200) {
        throw new Error(`Failed to get upload URL for RFQ with ID ${rfqId}`);
    }
    const uploadUrl = urlResponse.data.url;

    // Step 2: Upload file to signed URL
    const uploadResp = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type,
        },
    });
    
    console.log("uploadResp", uploadResp);

    if (!uploadResp.ok) {
        throw new Error(`Failed to upload image for RFQ with ID ${rfqId}`);
    }

    return true;
}