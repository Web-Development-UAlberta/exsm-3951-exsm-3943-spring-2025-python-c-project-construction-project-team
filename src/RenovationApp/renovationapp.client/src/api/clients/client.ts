import { useQuery } from '@tanstack/react-query';
import { IPublicClientApplication } from '@azure/msal-browser';
import { fetchClientById, fetchAllClients, fetchClientContactInfoById, fetchClientsWithProjectsRFQs, fetchClientDetails, fetchRFQWithClientInfo } from './clientQueries';
import { ClientBasicInfo, ClientContactDisplay, ClientDetailsResponse } from './client.types';
import { RFQWithClientInfo } from '../rfq/rfq.types';

const QUERY_KEY = "client";

export function useClientData(instance: IPublicClientApplication) {
    const getClient = (clientId: string) => {
        return useQuery<ClientBasicInfo>({
            queryKey: [QUERY_KEY, clientId],
            queryFn: () => fetchClientById(instance, clientId),
            staleTime: 5 * 60 * 1000,
        });
    };

    const getAllClients = () => {
        return useQuery<ClientBasicInfo[]>({
            queryKey: [QUERY_KEY, "all"],
            queryFn: () => fetchAllClients(instance),
            staleTime: 5 * 60 * 1000,
        });
    };

    const getClientContactInfoById = (clientId: string) => {
        return useQuery<ClientContactDisplay>({
            queryKey: [QUERY_KEY, clientId, "contact"],
            queryFn: () => fetchClientContactInfoById(instance, clientId),
            staleTime: 5 * 60 * 1000,
        });
    };

    const getAllClientContactInfo = () => {
        return useQuery<ClientContactDisplay[]>({
            queryKey: [QUERY_KEY, "all", "contact"],
            queryFn: () => fetchClientsWithProjectsRFQs(instance),
            staleTime: 5 * 60 * 1000,
        });
    };

    const getClientDetails = (clientId: string) => {
        return useQuery<ClientDetailsResponse>({
            queryKey: [QUERY_KEY, clientId, "details"],
            queryFn: () => fetchClientDetails(instance, clientId),
            staleTime: 5 * 60 * 1000,
        });
    };

    const getRFQWithClientInfo = (rfqId: bigint) => {
        return useQuery<RFQWithClientInfo>({
            queryKey: ['rfq', rfqId, 'withClient'],
            queryFn: () => fetchRFQWithClientInfo(instance, rfqId),
            staleTime: 5 * 60 * 1000
        });
    };

    return {
        getClient,
        getAllClients,
        getClientContactInfoById,
        getAllClientContactInfo,
        getClientDetails,
        getRFQWithClientInfo
    };
}