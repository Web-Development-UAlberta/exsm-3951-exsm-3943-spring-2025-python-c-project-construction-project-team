import { ClientContactDisplay } from "../api/clients";

export const mockContacts: ClientContactDisplay[] = [
    {
        id: 'mock-1',
        givenName: 'John',
        surname: 'Doe',
        mail: 'john.doe@example.com',
        mobilePhone: '111-111-1111',
        location: {
            city: 'Edmonton',
            state: 'AB',
        },
        hasProjects: true,
        hasRFQs: true,
    },
    {
        id: 'mock-2',
        givenName: 'Jane',
        surname: 'Smith',
        mail: 'jane.smith@hotmail.com',
        mobilePhone: '222-222-2222',
        location: {
            city: 'Calgary',
            state: 'AB',
        },
        hasProjects: true,
        hasRFQs: true,
    },
    {
        id: 'mock-3',
        givenName: 'Jesse',
        surname: 'Huang',
        mail: 'jesse@yahoo.ca',
        mobilePhone: '333-333-3333',
        location: {
            city: 'Vancouver',
            state: 'BC',
        },
        hasProjects: false,
        hasRFQs: true,
    },
    {
        id: 'mock-4',
        givenName: 'Emily',
        surname: 'Johnson',
        mail: 'emily.johnson@example.com',
        mobilePhone: '444-444-4444',
        location: {
            city: 'Toronto',
            state: 'ON',
        },
        hasProjects: false,
        hasRFQs: true,
    }
]