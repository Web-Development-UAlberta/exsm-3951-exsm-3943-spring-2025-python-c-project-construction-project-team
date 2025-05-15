import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchProjectTasks,
    fetchProjectTaskById,
    createProjectTask,
    updateProjectTask,
    deleteProjectTask
} from "./projectTaskQueries";
import { ProjectTaskDTO } from "./project.types";

export function useProjectTasks(projectId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", projectId, "tasks"],
        queryFn: () => fetchProjectTasks(projectId, msalInstance),
    });
}

export function useProjectTask(projectId: bigint, taskId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", projectId, "tasks", taskId],
        queryFn: () => fetchProjectTaskById(projectId, taskId, msalInstance),
    });
}

export function useCreateProjectTask(projectId: bigint, msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (task: ProjectTaskDTO) =>
            createProjectTask(projectId, task, msalInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", projectId, "tasks"] });
        }
    });
}

export function useUpdateProjectTask(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, taskId, task }: { projectId: bigint, taskId: bigint, task: ProjectTaskDTO }) =>
            updateProjectTask(projectId, taskId, task, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "tasks"] });
            queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "tasks", variables.taskId] });
        }
    });
}

export function useDeleteProjectTask(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, taskId }: { projectId: bigint, taskId: bigint }) =>
            deleteProjectTask(projectId, taskId, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "tasks"] });
        }
    });
}
