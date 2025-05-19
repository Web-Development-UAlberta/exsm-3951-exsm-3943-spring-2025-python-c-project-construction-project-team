import { apiClient } from '../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { RenovationTag } from "./renotags.types";
import publicApiClient from '../publicAxios';

// GET all tags
export async function fetchRenovationTags(): Promise<RenovationTag[]> {
    const response = await publicApiClient().get('/renotags', {});
    if (!response.data) throw new Error('Failed to fetch renovation tags');
    return response.data;
}

// POST a new tag
export async function createRenovationTag(
    tag: RenovationTag,
    msalInstance: IPublicClientApplication
): Promise<RenovationTag> {
    const response = await apiClient(msalInstance).post('/renotags', tag, {});
    if (!response.data) throw new Error('Failed to create renovation tag');
    return response.data;
}

// DELETE a tag by id
export async function deleteRenovationTag(
    id: string,
    msalInstance: IPublicClientApplication
): Promise<boolean> {
    const response = await apiClient(msalInstance).delete(`/renotags/${id}`, {});
    if (response.status !== 204) throw new Error('Failed to delete renovation tag');
    return true;
}
