export enum RoomSize {
    Small = "Small",
    Medium = "Medium",
    Large = "Large",
    ExtraSpacious = "ExtraSpacious"
}

export enum RFQStatus {
    Created = "Created",
    Quoted = "Quoted",
    Approved = "Approved",
    Declined = "Declined"
}

export enum RenovationType {
    KitchenRemodels = "KitchenRemodels",
    BathroomRenovations = "BathroomRenovations",
    BasementFinishing = "BasementFinishing",
    HomeAdditions = "HomeAdditions"
}

export type RFQImage = {
    id: number;
    fileName: string;
    filePath: string;
    uploadedAt: string; // ISO string for DateTime
    imageUri: string;
    rfqId: number;
    rfq: RFQ;
};

export type RFQ = {
    id: number;
    createdTimestamp: string; // ISO string
    clientId: number;
    status?: RFQStatus | null;
    assignedEmployeeId?: string | null;
    preferredMaterial?: string | null;
    description?: string | null;
    renovationType?: RenovationType | null;
    budget?: number | null;
    projectAddress?: string | null;
    roomSize?: RoomSize | null;
    rfqImages?: RFQImage[] | null;
    project?: string | null; //TODO this will need to be changed to a project object when we have it
};
