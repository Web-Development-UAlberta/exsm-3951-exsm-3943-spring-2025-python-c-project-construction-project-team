// types.ts
export interface Address {
  // fullName: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface PersonalInformation {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface RequestItem {
  id: string;
  date: string;
  type: string;
  status: string;
  description: string;
  projectAddress?: string;
  roomSize?: string;
  budget?: string;
  preferredMaterials?: string;
  message?: string;
  services?: {
    kitchenRemodel?: boolean;
    homeAdditions?: boolean;
    basementFinishing?: boolean;
    bathroomRenovation?: boolean;
  };
  files?: string[]; // Filenames or file info
}

