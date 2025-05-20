import { ClientBasicInfo } from "../clients";

export type RFQImage = {
    id: bigint,
    fileName: string,
    uploadedAt: string, // ISO string
    imageUri: string,
};

export type RFQ = {
    id: bigint;
    createdTimestamp: string; // ISO string
    clientId: string;
    status?: string;
    assignedEmployeeId?: string | null;
    preferredMaterial?: string | null;
    description?: string | null;
    renovationType?: string | null;
    budget?: number | null;
    projectAddress?: string | null;
    roomSize?: string | null;
    rfqImages?: bigint[] | null;
    project?: bigint | null; 
};

export type RFQCreate ={
    renovationType: string,
    roomSize: string,
    preferredMaterial: string,
    description: string,
    budget: number,
    projectAddress: string
}

export type RFQUpdate ={
    status?: string,
    renovationType?: string,
    roomSize?: string,
    preferredMaterial?: string,
    description?: string,
    budget?: number,
    projectAddress?: string,
    assignedEmployeeId?: string
}

export type RFQWithClientInfo = {
    rfqData: RFQ;
    clientInfo: ClientBasicInfo;
}