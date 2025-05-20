export { useClientData } from './client';
export type {
    ClientBasicInfo,
    ClientContactDisplay,
    ClientDetailsResponse,
    ClientLocation
} from './client.types';

export {
    fetchClientById,
    fetchAllClients,
    fetchClientContactInfoById,
    fetchClientsWithProjectsRFQs,
    fetchClientDetails,
    fetchRFQWithClientInfo,
} from './clientQueries';