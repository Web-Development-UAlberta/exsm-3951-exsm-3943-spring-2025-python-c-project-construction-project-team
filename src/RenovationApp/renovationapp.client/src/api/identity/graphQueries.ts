import { graphClient } from '../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { graphMe } from "./graph.types";
// To call Microsoft Graph for user profile, you need the "User.Read" scope.
// Example: scopes: ["User.Read"]

export async function fetchGraphMe(msalInstance: IPublicClientApplication): Promise<graphMe> {
    const response = await graphClient(['user.read'], msalInstance).get(`/me?$select=displayName,givenName,surname,mail,mobilePhone,postalCode,state,streetAddress,country,city`, {
        //headers: { 'accept': 'application/json' }
    });
    if (!response.data) {
        throw new Error("Failed to fetch user profile from Microsoft Graph");
    }
    return response.data;
}

export async function fetchAllUsers(msalInstance: IPublicClientApplication): Promise<graphMe[]> {
    try {
        const response = await graphClient(['User.Read.All'], msalInstance).get(`/users?$select=displayName,givenName,surname,mail,mobilePhone`);

        if (!response.data || !response.data.value) {
            throw new Error("Failed to fetch users from Microsoft Graph");
        }

        return response.data.value;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw new Error("Failed to retrieve users.");
    }
}

