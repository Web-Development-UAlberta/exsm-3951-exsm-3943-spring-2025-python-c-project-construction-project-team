import { apiClient } from '../../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { ProjectComment,ProjectCommentEdit } from "../project.types";

// Fetch all comments for a project
export async function fetchProjectComments(projectId: bigint, msalInstance: IPublicClientApplication): Promise<ProjectComment[]> {
    const response = await apiClient(msalInstance).get(`/projects/${projectId}/comments`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch comments for project ${projectId}`);
    }
    return response.data;
}

// Fetch a single comment by id
export async function fetchProjectCommentById(
    projectId: bigint,
    commentId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectComment> {
    const response = await apiClient(msalInstance).get(`/projects/${projectId}/comments/${commentId}`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch comment ${commentId}`);
    }
    return response.data;
}

// Create a new comment
export async function createProjectComment(
    projectId: bigint,
    comment: ProjectCommentEdit,
    msalInstance: IPublicClientApplication
): Promise<ProjectComment> {
    const response = await apiClient(msalInstance).post(`/projects/${projectId}/comments`, comment, {});
    if (!response.data) {
        throw new Error(`Failed to create comment for project ${projectId}`);
    }
    return response.data;
}

// Update a comment
export async function updateProjectComment(
    projectId: bigint,
    commentId: bigint,
    comment: ProjectCommentEdit,
    msalInstance: IPublicClientApplication
): Promise<ProjectComment> {
    const response = await apiClient(msalInstance).put(`/projects/${projectId}/comments/${commentId}`, comment, {});
    if (!response.data) {
        throw new Error(`Failed to update comment ${commentId}`);
    }
    return response.data;
}

// Delete a comment
export async function deleteProjectComment(
    projectId: bigint,
    commentId: bigint,
    msalInstance: IPublicClientApplication
): Promise<boolean> {
    const response = await apiClient(msalInstance).delete(`/projects/${projectId}/comments/${commentId}`, {});
    if (response.status !== 204) {
        throw new Error(`Failed to delete comment ${commentId}`);
    }
    return true;
}
