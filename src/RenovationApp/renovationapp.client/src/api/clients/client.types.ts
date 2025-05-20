import { RFQ } from '../rfq/rfq.types';

// Basic Client Information
export type ClientBasicInfo = {
    id: string,
    displayName: string,
    givenName: string,
    surname: string,
}

// Contact Information for display
export type ClientContactDisplay = ClientBasicInfo & {
    mail: string,
    mobilePhone: string,
    city?: string,
    state?: string,
}

// Full Client Information
export type ClientProfile = ClientContactDisplay & {
    streetAddress?: string,
    postalCode?: string,
    country?: string,
    jobTitle?: string,
}

// Combine with RFQ data
export type RFQWithClientInfo = {
    rfqData: RFQ;
    clientInfo: ClientBasicInfo;
}

// Helper for formatting location
export type ClientLocation = {
    city?: string,
    state?: string,
}