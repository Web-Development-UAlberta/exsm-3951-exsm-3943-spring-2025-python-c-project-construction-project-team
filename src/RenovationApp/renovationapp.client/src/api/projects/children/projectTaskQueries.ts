import { apiClient } from '../../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { ProjectTask, ProjectTaskDTO } from "../project.types";
import { bigIntConverter } from '../../../utils/bigIntConvert';

// Fetch all tasks for a project
export async function fetchProjectTasks(
    projectId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectTask[]> {
    const response = await apiClient(msalInstance).get(`/projects/${projectId}/tasks`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch tasks for project ${projectId}`);
    }
    return response.data.map((task: any) => ({
        ...task,
        id: bigIntConverter.fromAPI(task.id),
        projectId: bigIntConverter.fromAPI(task.projectId),
    }));
}
    
// Fetch a single task by id
export async function fetchProjectTaskById(
    projectId: bigint,
    taskId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectTask> {
    const response = await apiClient(msalInstance).get(`/projects/${bigIntConverter.toAPI(projectId)}/tasks/${bigIntConverter.toAPI(taskId)}`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch task ${taskId}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId),
    }
}

// Create a new task
export async function createProjectTask(
    projectId: bigint,
    task: ProjectTaskDTO,
    msalInstance: IPublicClientApplication
): Promise<ProjectTask> {
    const response = await apiClient(msalInstance).post(`/projects/${bigIntConverter.toAPI(projectId)}/tasks`, task, {});
    if (!response.data) {
        throw new Error(`Failed to create task for project ${projectId}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId),
    };
}

// Update a task
export async function updateProjectTask(
    projectId: bigint,
    taskId: bigint,
    task: ProjectTaskDTO,
    msalInstance: IPublicClientApplication
): Promise<ProjectTask> {
    const response = await apiClient(msalInstance).put(`/projects/${bigIntConverter.toAPI(projectId)}/tasks/${bigIntConverter.toAPI(taskId)}`, task, {});
    if (!response.data) {
        throw new Error(`Failed to update task ${taskId}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId),
    }
}

// Delete a task
export async function deleteProjectTask(
    projectId: bigint,
    taskId: bigint,
    msalInstance: IPublicClientApplication
): Promise<boolean> {
    const response = await apiClient(msalInstance).delete(`/projects/${bigIntConverter.toAPI(projectId)}/tasks/${bigIntConverter.toAPI(taskId)}`, {});
    if (response.status !== 204) {
        throw new Error(`Failed to delete task ${taskId}`);
    }
    return true;
}
