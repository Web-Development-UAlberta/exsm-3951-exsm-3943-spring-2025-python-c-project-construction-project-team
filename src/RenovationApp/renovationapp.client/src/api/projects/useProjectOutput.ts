import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjects, fetchProjectById, createProject, updateProject, deleteProject, approveProjectQuote } from "./projectOutputQueries";
import { ProjectOutputDTO } from "./project.types";

export function useProjects(msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", "output"],
        queryFn: () => fetchProjects(msalInstance),
    });
}

export function useProject(id: number, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", "output", id],
        queryFn: () => fetchProjectById(id, msalInstance),
    });
}

export function useUpdateProject(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number, data: Partial<ProjectOutputDTO> }) =>
            updateProject(id, data, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects", "output"] });
            queryClient.invalidateQueries({ queryKey: ["projects", "output", variables.id] });
        }
    });
}

export function useCreateProject(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<ProjectOutputDTO>) =>
            createProject(data, msalInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", "output"] });
        }
    });
}

export function useDeleteProject(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) =>
            deleteProject(id, msalInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", "output"] });
        }
    });
}

export function useApproveProjectQuote(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) =>
            approveProjectQuote(id, msalInstance),
        onSuccess: (_result, id) => {
            queryClient.invalidateQueries({ queryKey: ["projects", "output"] });
            queryClient.invalidateQueries({ queryKey: ["projects", "output", id] });
        }
    });
}
