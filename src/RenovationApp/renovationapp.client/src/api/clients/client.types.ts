import { RFQ } from '../rfq/rfq.types';
import { ProjectComment, ProjectFile, ProjectTask, Project, ProjectCommunication } from '../projects/project.types';
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

// Client Details
export type ClientDetails = {
    basicInfo: ClientBasicInfo & {
        mail?: string;
        mobilePhone?: string;
        location?: ClientLocation;
    };
    projects?: ClientProject[];
    communications?: ClientCommunication[];
    files?: ClientFile[];
    tasks?: ClientTask[];
}

// Client Project
export type ClientProject = {
    id: number;
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
    projectName?: string;
    createdTimestamp: string;
    message: string;
    type: 'comment' | 'communication';
    createdBy?: string;
}

// Client File
export type ClientFile = {
    id: number;
    projectId: number;
    projectName?: string;
    fileName: string;
    fileUri: string;
    type: 'image' | 'document';
    uploadedTimestamp: string;
}

// Client Task
export type ClientTask = {
    id: number;
    projectId: number;
    projectName?: string;
    title?: string;
    description?: string;
    status?: string;
    createdTimestamp: string;
}

// Client Details Response
export type ClientDetailsResponse = {
    basicInfo: ClientContactDisplay;
    projects: Project[];
    allComments: ProjectComment[];
    allFiles: ProjectFile[];
    allTasks: ProjectTask[];
    allCommunications: ProjectCommunication[];
}