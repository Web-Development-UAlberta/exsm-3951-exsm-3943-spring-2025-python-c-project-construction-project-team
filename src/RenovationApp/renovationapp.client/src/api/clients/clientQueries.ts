import { IPublicClientApplication } from "@azure/msal-browser";
import { graphClient } from '../axios';
import { ClientBasicInfo, ClientContactDisplay, RFQWithClientInfo, ClientDetailsResponse } from './client.types';
import { fetchRFQById } from '../rfq/rfqQueries';

export async function fetchClientById(msalInstance: IPublicClientApplication, clientId: string): Promise<ClientBasicInfo> {
    const response = await graphClient(msalInstance).get(
        `/users/${clientId}?$select=id,givenName,surname`
    );

    if (!response.data) {
        throw new Error("Failed to fetch client information");
    }

    return response.data;
}

export async function fetchAllClients(msalInstance: IPublicClientApplication): Promise<ClientBasicInfo[]> {
    const response = await graphClient(msalInstance).get(
        `/users?$select=id,givenName,surname`
    );

    if (!response.data?.value) {
        throw new Error("Failed to fetch clients");
    }

    return response.data.value;
}

export async function fetchClientContactInfoById(msalInstance: IPublicClientApplication, clientId: string): Promise<ClientContactDisplay> {
    const response = await graphClient(msalInstance).get(
        `/users/${clientId}?$select=id,givenName,surname,mail,mobilePhone,city,state`
    );

    if (!response.data) {
        throw new Error("Failed to fetch client contact information");
    }

    return response.data;
}

export async function fetchAllClientContactInfo(msalInstance: IPublicClientApplication): Promise<ClientContactDisplay[]> {
    const response = await graphClient(msalInstance).get(
        `/users?$select=id,givenName,surname,mail,mobilePhone,city,state`
    );

    if (!response.data?.value) {
        throw new Error("Failed to fetch clients");
    }

    return response.data.value;
}

export async function fetchClientDetails(msalInstance: IPublicClientApplication, clientId: string): Promise<ClientDetailsResponse> {
    const response = await graphClient(msalInstance).get(
        `/users/${clientId}?$select=id,givenName,surname,mail,mobilePhone,city,state`
    );

    if (!response.data) {
        throw new Error("Failed to fetch client profile");
    }

    const [projects, comments, files, tasks, communications] = await Promise.all([
        fetch(`/api/projects?clientId=${clientId}`).then(res => res.json()),
        fetch(`/api/comments?clientId=${clientId}`).then(res => res.json()),
        fetch(`/api/files?clientId=${clientId}`).then(res => res.json()),
        fetch(`/api/tasks?clientId=${clientId}`).then(res => res.json()),
        fetch(`/api/communications?clientId=${clientId}`).then(res => res.json())
    ]);

    return {
        basicInfo: {
            id: response.data.id,
            givenName: response.data.givenName,
            surname: response.data.surname,
            mail: response.data.mail,
            mobilePhone: response.data.mobilePhone,
            location: {
                city: response.data.city,
                state: response.data.state
            }
        },
        projects,
        allComments: comments,
        allFiles: files,
        allTasks: tasks,
        allCommunications: communications
    };
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