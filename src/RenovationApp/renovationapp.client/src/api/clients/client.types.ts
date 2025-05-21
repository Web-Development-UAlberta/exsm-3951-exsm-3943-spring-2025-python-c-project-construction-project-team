// Basic Client Information
export type ClientBasicInfo = {
    id: string,
    givenName: string,
    surname: string,
}

// Contact Information for display
export type ClientContactDisplay = ClientBasicInfo & {
    mail: string,
    mobilePhone: string,
    location?: ClientLocation
    hasProjects: boolean,
    hasRFQs: boolean,
}

// Helper for formatting location
export type ClientLocation = {
    city?: string,
    state?: string,
}

// Client Project
export type ClientProject = {
    id: number;
    clientId: string;
    createdTimestamp: string;
    status?: string;
    renovationType?: string;
    rfqId?: number | null;
    quotePriceOverride?: number | null;
    quoteScheduleStartOverride?: string | null;
    quoteScheduleEndOverride?: string | null;
}

// Client Communication
export type ClientCommunication = {
    id: number;
    projectId: number;
    createdTimestamp: string;
    message: string;
    type: 'comment' | 'communication';
    createdBy?: string;
}

// Client Task
export type ClientTask = {
    id: number;
    projectId: number;
    title?: string;
    description?: string;
    status?: string;
    createdTimestamp: string;
}

// Client Details Response
export type ClientDetailsResponse = {
    basicInfo: ClientBasicInfo & {
        mail: string;
        mobilePhone: string;
        streetAddress?: string;
        city?: string;
        state?: string;
        postalCode?: string;
    }
    projects: ClientProject[];
    tasks: ClientTask[];
    communications: ClientCommunication[];
}