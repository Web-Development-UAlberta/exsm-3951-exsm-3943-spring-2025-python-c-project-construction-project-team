import { graphClient } from '../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { graphMe } from "./graph.types";
// To call Microsoft Graph for user profile, you need the "User.Read" scope.
// Example: scopes: ["User.Read"]

export async function fetchGraphMe(msalInstance: IPublicClientApplication): Promise<graphMe> {
    const response = await graphClient(msalInstance).get(`/me?$select=displayName,givenName,surname,mail,mobilePhone,postalCode,state,streetAddress,country,city`, {
        //headers: { 'accept': 'application/json' }
    });
    if (!response.data) {
        throw new Error("Failed to fetch user profile from Microsoft Graph");
    }
    return response.data;
}

// Update user profile in Microsoft Graph
export async function updateGraphMe(msalInstance: IPublicClientApplication, data: Partial<graphMe>): Promise<void> {
    try {
        await graphClient(msalInstance).patch(`/me`, data, {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        throw new Error("Failed to update user profile");
    }
}

// Job title filtering
export async function fetchProjectManagers(msalInstance: IPublicClientApplication): Promise<graphMe[]> {
    const response = await graphClient(msalInstance).get(
        `/users?$filter=jobTitle eq 'Project Manager'&$select=displayName,givenName,surname,mail,id`
    );

    if (!response.data?.value) {
        throw new Error("Failed to fetch project managers from Microsoft Graph");
    }

    return response.data.value;
}