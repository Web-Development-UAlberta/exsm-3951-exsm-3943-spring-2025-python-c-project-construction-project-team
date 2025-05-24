import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchProjectTasks,
    fetchProjectTaskById,
    createProjectTask,
    updateProjectTask,
    deleteProjectTask
} from "./projectTaskQueries";
import { ProjectTaskDTO } from "../project.types";
import { bigIntConverter } from "../../../utils/bigIntConvert";

export function useProjectTasks(projectId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", bigIntConverter.toAPI(projectId), "tasks"],
        queryFn: () => fetchProjectTasks(projectId, msalInstance),
    });
}

export function useProjectTask(projectId: bigint, taskId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", bigIntConverter.toAPI(projectId), "tasks", bigIntConverter.toAPI(taskId)],
        queryFn: () => fetchProjectTaskById(projectId, taskId, msalInstance),
    });
}

export function useCreateProjectTask(projectId: bigint, msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (task: ProjectTaskDTO) =>
            createProjectTask(projectId, task, msalInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", bigIntConverter.toAPI(projectId), "tasks"] });
        }
    });
}

export function useUpdateProjectTask(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, taskId, task }: { projectId: bigint, taskId: bigint, task: ProjectTaskDTO }) =>
            updateProjectTask(projectId, taskId, task, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects", bigIntConverter.toAPI(variables.projectId), "tasks"] });
            queryClient.invalidateQueries({ queryKey: ["projects", bigIntConverter.toAPI(variables.projectId), "tasks", bigIntConverter.toAPI(variables.taskId)] });
        }
    });
}

export function useDeleteProjectTask(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, taskId }: { projectId: bigint, taskId: bigint }) =>
            deleteProjectTask(projectId, taskId, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects", bigIntConverter.toAPI(variables.projectId), "tasks"] });
        }
    });
}
