import { mockContacts } from "./contactMock";
import { ClientDetailsResponse } from "../api/clients";

const mockProjects = [
    {
        id: 1,
        renovationType: 'Kitchen Remodel',
        status: 'In Progress',
        createdTimestamp: '2025-01-15T10:00:00Z',
        quoteScheduleEndOverride: '2025-02-15T10:00:00Z',
    },
    {
        id: 2,
        renovationType: 'Bathroom Renovation',
        status: 'Completed',
        createdTimestamp: '2025-03-20T10:00:00Z',
        quoteScheduleEndOverride: '2025-04-20T10:00:00Z',
    },
    {
        id: 3,
        renovationType: 'Basement Development',
        status: 'Pending',
        createdTimestamp: '2025-05-01T10:00:00Z',
        quoteScheduleEndOverride: '2025-06-01T10:00:00Z',
    }
];

const mockTasks = [
    {
        id: 1,
        projectId: 1,
        title: 'Initial Consultation',
        description: 'Meet with client to discuss kitchen renovation requirements',
        status: 'Completed',
        createdTimestamp: '2025-01-16T10:00:00Z'
    },
    {
        id: 2,
        projectId: 1,
        title: 'Design Proposal',
        description: 'Create and submit kitchen design proposals',
        status: 'In Progress',
        createdTimestamp: '2025-01-20T10:00:00Z'
    },
    {
        id: 3,
        projectId: 2,
        title: 'Material Selection',
        description: 'Select tiles, fixtures, and materials for bathroom',
        status: 'Completed',
        createdTimestamp: '2025-03-21T10:00:00Z'
    },
    {
        id: 4,
        projectId: 3,
        title: 'Budget Review',
        description: 'Review and finalize project budget',
        status: 'Pending',
        createdTimestamp: '2025-05-02T10:00:00Z'
    }
];

const mockCommunications = [
    {
        id: 1,
        projectId: 1,
        message: 'Initial consultation completed. Client prefers modern design.',
        type: 'comment',
        createdTimestamp: '2025-01-16T11:00:00Z',
        createdBy: 'Design Team'
    },
    {
        id: 2,
        projectId: 1,
        message: 'Design proposals sent via email.',
        type: 'communication',
        createdTimestamp: '2025-01-21T14:30:00Z',
        createdBy: 'Project Manager'
    },
    {
        id: 3,
        projectId: 2,
        message: 'Material samples delivered to client.',
        type: 'comment',
        createdTimestamp: '2025-03-22T09:15:00Z',
        createdBy: 'Supply Team'
    },
    {
        id: 4,
        projectId: 3,
        message: 'Client requested additional basement layout options.',
        type: 'comment',
        createdTimestamp: '2025-05-03T16:45:00Z',
        createdBy: 'Sales Team'
    }
];

export const mockClientDetails = (contactId: string): ClientDetailsResponse => {
    const contact = mockContacts.find(contact => contact.id === contactId);

    return {
        basicInfo: {
            id: contact?.id || 'mock-1',
            givenName: contact?.givenName || 'John',
            surname: contact?.surname || 'Doe',
            mail: contact?.mail || 'john.doe@example.com',
            mobilePhone: contact?.mobilePhone || '(555) 123-4567',
            streetAddress: '123 Main Street',
            city: contact?.location?.city || 'Edmonton',
            state: contact?.location?.state || 'AB',
            postalCode: 'T5A 0A1'
        },
        projects: mockProjects.map(project => ({
            ...project,
            clientId: contact?.id || 'mock-1'
        })),
        tasks: mockTasks,
        communications: mockCommunications.map(comm => ({
            ...comm,
            type: comm.type as "comment" | "communication",
            createdBy: comm.createdBy || contact?.id || 'mock-1'
        }))
    };
};