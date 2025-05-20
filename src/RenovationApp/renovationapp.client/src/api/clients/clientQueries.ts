import { IPublicClientApplication } from "@azure/msal-browser";
import { graphClient } from '../axios';
import { ClientBasicInfo, ClientContactDisplay, ClientProfile, RFQWithClientInfo } from './client.types';
import { fetchRFQById } from '../rfq/rfqQueries';

export async function fetchClientById(msalInstance: IPublicClientApplication, clientId: string): Promise<ClientBasicInfo> {
    const response = await graphClient(msalInstance).get(
        `/users/${clientId}?$select=id,displayName,givenName,surname`
    );

    if (!response.data) {
        throw new Error("Failed to fetch client information");
    }

    return response.data;
}

export async function fetchAllClients(msalInstance: IPublicClientApplication): Promise<ClientBasicInfo[]> {
    const response = await graphClient(msalInstance).get(
        `/users?$select=id,displayName,givenName,surname`
    );

    if (!response.data?.value) {
        throw new Error("Failed to fetch clients");
    }

    return response.data.value;
}

export async function fetchClientContactInfoById(msalInstance: IPublicClientApplication, clientId: string): Promise<ClientContactDisplay> {
    const response = await graphClient(msalInstance).get(
        `/users/${clientId}?$select=id,givenName,surname,mail,mobilePhone,state,streetAddress,country,city`
    );

    if (!response.data) {
        throw new Error("Failed to fetch client contact information");
    }

    return response.data;
}

export async function fetchAllClientContactInfo(msalInstance: IPublicClientApplication): Promise<ClientContactDisplay[]> {
    const response = await graphClient(msalInstance).get(
        `/users?$select=id,givenName,surname,mail,mobilePhone,state,streetAddress,country,city`
    );

    if (!response.data?.value) {
        throw new Error("Failed to fetch clients");
    }

    return response.data.value;
}

export async function fetchClientProfile(msalInstance: IPublicClientApplication, clientId: string): Promise<ClientProfile> {
    const response = await graphClient(msalInstance).get(
        `/users/${clientId}?$select=id,givenName,surname,mail,mobilePhone,state,streetAddress,country,city,postalCode,jobTitle`
    );

    if (!response.data) {
        throw new Error("Failed to fetch client profile");
    }

    return response.data;
}


export async function fetchRFQWithClientInfo(msalInstance: IPublicClientApplication, rfqId: bigint): Promise<RFQWithClientInfo> {
    const rfq = await fetchRFQById(BigInt(rfqId), msalInstance);
    const client = await fetchClientById(msalInstance, rfq.clientId);
    if (!rfq || !client) {
        throw new Error("Failed to fetch RFQ or client information");
    }
    return {
        rfqData: rfq,
        clientInfo: client
    };
}