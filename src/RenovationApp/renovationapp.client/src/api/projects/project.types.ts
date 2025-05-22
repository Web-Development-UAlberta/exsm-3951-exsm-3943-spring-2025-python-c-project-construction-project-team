import { RenovationTag } from "../renotags/renotags.types";

export type ProjectPublicInfo = {
    id: bigint;
    renovationType?: string;
    costCategory?: number | null;
    renovationTagIds?: string[] | null;

}

export type FileDownload = {
    fileName: string;
    fileType: string;
    url: string;
}

export type ProjectPublicInfoWithImages = ProjectPublicInfo & {
    images: FileDownload[];
}

export type ProjectComment = {
    id: number;
    comment: string;
    createdTimestamp: string;
    createdByEmployee: string;
    projectId: number;
};

export type ProjectCommentEdit = {
    comment: string;
};

export type ProjectFile = {
    id: number;
    uploadedTimestamp: string;
    fileUri: string;
    fileName: string;
    type: 'image' | 'document';
    projectId: number;
};

export type ProjectCommunication = {
    id: number;
    createdTimestamp: string;
    message: string;
    projectId: number;
};

export type ClientInvoice = {
    id: number;
    createdTimestamp: string;
    description?: string | null;
    paymentInstructions?: string | null;
    paid?: string | null;
    amount?: number | null;
    projectId?: number | null;
};

export type ProjectServiceInvoice = {
    id: number;
    createdTimeStamp: string;
    projectServiceId: number;
    amount: number;
    paid?: string | null;
};

export type ProjectServiceType = {
    id: number;
    name?: string | null;
    description?: string | null;
};

export type ProjectService = {
    id: number;
    status?: string | null;
    projectId: number;
    name: string;
    description?: string | null;
    projectServiceTypeId?: number | null;
    projectServiceType?: ProjectServiceType | null;
    quotePrice?: number | null;
    quoteCost?: number | null;
    quoteStartDate: string;
    quoteEndDate: string;
    actualStartDate?: string | null;
    actualEndDate?: string | null;
    projectServiceInvoices: ProjectServiceInvoice[];
};

export type ProjectTask = {
    id: number;
    createdTimestamp: string;
    projectId?: number | null;
    userId?: string | null;
    title?: string | null;
    description?: string | null;
    status?: string | null;
};

export type Project = {
    id: number;
    createdTimestamp: string;
    createdByEmployee: string;
    clientId: string;
    rfqId?: number | null;
    status?: string | null;
    isPublic: boolean;
    quotePriceOverride?: number | null;
    quoteScheduleStartOverride?: string | null;
    quoteScheduleEndOverride?: string | null;
    renovationType?: string | null;
    comments: ProjectComment[];
    files: ProjectFile[];
    communications: ProjectCommunication[];
    clientInvoices: ClientInvoice[];
    projectServices: ProjectService[];
    projectTasks: ProjectTask[];
    renovationTags: RenovationTag[];
};

// DTO types for PUT/POST operations

export type ProjectCommentDTO = {
    comment: string;
};

export type ProjectTaskDTO = {
    userId?: string;
    title?: string;
    description?: string;
    status?: string;
};

export type ProjectServiceCreateDTO = {
    name: string;
    description?: string;
    projectServiceTypeId?: number;
    quotePrice?: number;
    quoteCost?: number;
    quoteStartDate: string;
    quoteEndDate: string;
    actualStartDate?: string;
    actualEndDate?: string;
    status?: string;
};

export type ProjectServiceUpdateDTO = {
    name?: string;
    description?: string;
    projectServiceTypeId?: number;
    quotePrice?: number;
    quoteCost?: number;
    quoteStartDate?: string;
    quoteEndDate?: string;
    actualStartDate?: string;
    actualEndDate?: string;
    status?: string;
};

export type ProjectServiceInvoiceDTO = {
    amount: number;
    paid?: string;
};

export type ProjectCommunicationDTO = {
    message: string;
};

export type ClientInvoiceDTO = {
    description?: string;
    paymentInstructions?: string;
    paid?: string;
    amount?: number;
};

export type ProjectOutComment = {
    id: number;
    createdByEmployee?: string | null;
    comment?: string | null;
    createdTimestamp: string;
};

export type ProjectOutFile = {
    id: number;
    fileName: string;
    type: string;
    fileUri: string;
    uploadedTimestamp: string;
};

export type ProjectOutCommunication = {
    id: number;
    message?: string | null;
    createdTimestamp: string;
};

export type ProjectOutClientInvoice = {
    id: number;
    paid?: string | null;
};

export type ProjectOutService = {
    id: number;
    status?: string | null;
    name: string;
    serviceTypeName?: string | null;
};

export type ProjectOutTask = {
    id: number;
    userId?: string | null;
    title?: string | null;
    status?: string | null;
};

export type ProjectOutputDTO = {
    id: number;
    clientId: string;
    status?: string | null;
    renovationType?: string | null;
    rfq?: number | null;
    comments?: ProjectOutComment[];
    files?: ProjectOutFile[];
    communications?: ProjectOutCommunication[];
    clientInvoices?: ProjectOutClientInvoice[];
    projectServices?: ProjectOutService[];
    projectTasks?: ProjectOutTask[];
};