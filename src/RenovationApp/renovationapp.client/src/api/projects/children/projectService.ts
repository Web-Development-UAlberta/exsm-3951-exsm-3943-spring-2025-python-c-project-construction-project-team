import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchProjectServices,
    fetchProjectServiceById,
    createProjectService,
    updateProjectService,
    deleteProjectService
} from "./projectServiceQueries";
import {
    ProjectServiceCreateDTO,
    ProjectServiceUpdateDTO
} from "../project.types";

export function useProjectServices(projectId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", projectId, "services"],
        queryFn: () => fetchProjectServices(projectId, msalInstance),
    });
}

export function useProjectService(projectId: bigint, serviceId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", projectId, "services", serviceId],
        queryFn: () => fetchProjectServiceById(projectId, serviceId, msalInstance),
    });
}

export function useCreateProjectService(projectId: bigint, msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (service: ProjectServiceCreateDTO) =>
            createProjectService(projectId, service, msalInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", projectId, "services"] });
        }
    });
}

export function useUpdateProjectService(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, serviceId, service }: { projectId: bigint, serviceId: bigint, service: ProjectServiceUpdateDTO }) =>
            updateProjectService(projectId, serviceId, service, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "services"] });
            queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "services", variables.serviceId] });
        }
    });
}

export function useDeleteProjectService(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, serviceId }: { projectId: bigint, serviceId: bigint }) =>
            deleteProjectService(projectId, serviceId, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "services"] });
        }
    });
}
