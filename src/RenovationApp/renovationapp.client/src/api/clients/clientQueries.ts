import { IPublicClientApplication } from "@azure/msal-browser";
import { graphClient } from '../axios';
import { ClientBasicInfo, ClientContactDisplay, ClientDetailsResponse } from './client.types';
import { RFQ } from '../rfq/rfq.types';
import { Project } from '../projects/project.types';

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

export async function fetchClientsWithProjectsRFQs(msalInstance: IPublicClientApplication): Promise<ClientContactDisplay[]> {
    const response = await graphClient(msalInstance).get(
        `/users?$select=id,givenName,surname,mail,mobilePhone,city,state`
    );

    if (!response.data?.value) {
        throw new Error("Failed to fetch clients");
    }

    // Get projects and RFQs
    const [projects, rfqs] = await Promise.all([
        fetch(`/api/projects`).then(res => res.json()),
        fetch(`/api/rfqs`).then(res => res.json())
    ]);

    // Filter clients based on projects and RFQs
    const clientsWithProjectsOrRFQs = response.data.value.filter((user: ClientContactDisplay) => {
        const hasProjects = projects.some((project: Project) => project.clientId === user.id);
        const hasRFQs = rfqs.some((rfq: RFQ) => rfq.clientId === user.id);
        return hasProjects || hasRFQs;
    });

    return clientsWithProjectsOrRFQs;
}

export async function fetchClientDetails(msalInstance: IPublicClientApplication, clientId: string): Promise<ClientDetailsResponse> {
    const response = await graphClient(msalInstance).get(
        `/users/${clientId}?$select=id,givenName,surname,mail,mobilePhone,city,state`
    );

    if (!response.data) {
        throw new Error("Failed to fetch client profile");
    }

    const [projects, tasks, communications] = await Promise.all([
        fetch(`/api/projects?clientId=${clientId}`).then(res => res.json()),
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
        tasks,
        communications
    };
}
