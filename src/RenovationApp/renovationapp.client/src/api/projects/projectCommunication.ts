import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchProjectCommunications,
    fetchProjectCommunicationById,
    createProjectCommunication,
    updateProjectCommunication,
    deleteProjectCommunication
} from "./projectCommunicationQueries";
import { ProjectCommunicationDTO } from "./project.types";

const QUERY_KEY = "projectCommunications";

export function useProjectCommunications(projectId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: [QUERY_KEY, { projectId }],
        queryFn: () => fetchProjectCommunications(projectId, msalInstance),
    });
}

export function useProjectCommunication(projectId: bigint, communicationId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: [QUERY_KEY, { projectId, communicationId }],
        queryFn: () => fetchProjectCommunicationById(projectId, communicationId, msalInstance),
    });
}

export function useCreateProjectCommunication(projectId: bigint, msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (communication: ProjectCommunicationDTO) =>
            createProjectCommunication(projectId, communication, msalInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId }] });
        }
    });
}

export function useUpdateProjectCommunication(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, communicationId, communication }: { projectId: bigint, communicationId: bigint, communication: ProjectCommunicationDTO }) =>
            updateProjectCommunication(projectId, communicationId, communication, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId: variables.projectId }] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId: variables.projectId, communicationId: variables.communicationId }] });
        }
    });
}

export function useDeleteProjectCommunication(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, communicationId }: { projectId: bigint, communicationId: bigint }) =>
            deleteProjectCommunication(projectId, communicationId, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId: variables.projectId }] });
        }
    });
}
