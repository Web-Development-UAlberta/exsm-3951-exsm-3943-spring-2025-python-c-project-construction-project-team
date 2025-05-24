import { publicApiClient } from '../publicAxios';
import { apiClient } from '../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { RenovationTag } from "./renotag.types";

// Public endpoint that doesn't require authentication
export async function fetchRenovationTags(): Promise<RenovationTag[]> {
    const response = await publicApiClient().get(`/renotags`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch renovation tags`);
    }
    return response.data;
}

// These operations still require authentication
export async function createRenovationTag(
    msalInstance: IPublicClientApplication, 
    tag: RenovationTag
): Promise<RenovationTag> {
    const response = await apiClient(msalInstance).post('/renotags', tag);
    if (!response.data) {
        throw new Error('Failed to create renovation tag');
    }
    return response.data;
}

export async function deleteRenovationTag(
    msalInstance: IPublicClientApplication,
    tagId: string
): Promise<void> {
    const response = await apiClient(msalInstance).delete(`/renotags/${tagId}`);
    if (response.status !== 204) {
        throw new Error('Failed to delete renovation tag');
    }
}