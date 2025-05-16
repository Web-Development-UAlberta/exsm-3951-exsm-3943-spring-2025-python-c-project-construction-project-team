import { apiClient } from '../../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { ProjectTask, ProjectTaskDTO } from "../project.types";

// Fetch all tasks for a project
export async function fetchProjectTasks(
    projectId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectTask[]> {
    const response = await apiClient(msalInstance).get(`/projects/${projectId}/tasks`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch tasks for project ${projectId}`);
    }
    return response.data;
}

// Fetch a single task by id
export async function fetchProjectTaskById(
    projectId: bigint,
    taskId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectTask> {
    const response = await apiClient(msalInstance).get(`/projects/${projectId}/tasks/${taskId}`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch task ${taskId}`);
    }
    return response.data;
}

// Create a new task
export async function createProjectTask(
    projectId: bigint,
    task: ProjectTaskDTO,
    msalInstance: IPublicClientApplication
): Promise<ProjectTask> {
    const response = await apiClient(msalInstance).post(`/projects/${projectId}/tasks`, task, {});
    if (!response.data) {
        throw new Error(`Failed to create task for project ${projectId}`);
    }
    return response.data;
}

// Update a task
export async function updateProjectTask(
    projectId: bigint,
    taskId: bigint,
    task: ProjectTaskDTO,
    msalInstance: IPublicClientApplication
): Promise<ProjectTask> {
    const response = await apiClient(msalInstance).put(`/projects/${projectId}/tasks/${taskId}`, task, {});
    if (!response.data) {
        throw new Error(`Failed to update task ${taskId}`);
    }
    return response.data;
}

// Delete a task
export async function deleteProjectTask(
    projectId: bigint,
    taskId: bigint,
    msalInstance: IPublicClientApplication
): Promise<boolean> {
    const response = await apiClient(msalInstance).delete(`/projects/${projectId}/tasks/${taskId}`, {});
    if (response.status !== 204) {
        throw new Error(`Failed to delete task ${taskId}`);
    }
    return true;
}
