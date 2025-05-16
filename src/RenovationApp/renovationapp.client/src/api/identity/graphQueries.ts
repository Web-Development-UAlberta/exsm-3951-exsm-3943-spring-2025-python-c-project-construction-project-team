import { graphClient } from '../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { graphMe } from "./graph.types";
// To call Microsoft Graph for user profile, you need the "User.Read" scope.
// Example: scopes: ["User.Read"]

export async function fetchGraphMe(msalInstance: IPublicClientApplication): Promise<graphMe> {
    const response = await graphClient(msalInstance).get(`/me?$select=displayName,givenName,surname,mail,postalCode,state,streetAddress,country,city`, {
        //headers: { 'accept': 'application/json' }
    });
    if (!response.data) {
        throw new Error("Failed to fetch user profile from Microsoft Graph");
    }
    return response.data;
}

