import { apiClient } from '../../axios';
import { IPublicClientApplication } from "@azure/msal-browser";
import { ProjectComment,ProjectCommentEdit } from "../project.types";
import { bigIntConverter } from '../../../utils/bigIntConvert';

// Fetch all comments for a project
export async function fetchProjectComments(projectId: bigint, msalInstance: IPublicClientApplication): Promise<ProjectComment[]> {
    const response = await apiClient(msalInstance).get(`/projects/${bigIntConverter.toAPI(projectId)}/comments`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch comments for project ${projectId}`);
    }
    return response.data.map((comment: any) => ({
        ...comment,
        id: bigIntConverter.fromAPI(comment.id),
        projectId: bigIntConverter.fromAPI(comment.projectId)
    }));
}

// Fetch a single comment by id
export async function fetchProjectCommentById(
    projectId: bigint,
    commentId: bigint,
    msalInstance: IPublicClientApplication
): Promise<ProjectComment> {
    const response = await apiClient(msalInstance).get(`/projects/${bigIntConverter.toAPI(projectId)}/comments/${bigIntConverter.toAPI(commentId)}`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch comment ${commentId}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId)
    }
}

// Create a new comment
export async function createProjectComment(
    projectId: bigint,
    comment: ProjectCommentEdit,
    msalInstance: IPublicClientApplication
): Promise<ProjectComment> {
    const response = await apiClient(msalInstance).post(`/projects/${bigIntConverter.toAPI(projectId)}/comments`, comment, {});
    if (!response.data) {
        throw new Error(`Failed to create comment for project ${projectId}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId)
    }
}

// Update a comment
export async function updateProjectComment(
    projectId: bigint,
    commentId: bigint,
    comment: ProjectCommentEdit,
    msalInstance: IPublicClientApplication
): Promise<ProjectComment> {
    const response = await apiClient(msalInstance).put(`/projects/${bigIntConverter.toAPI(projectId)}/comments/${bigIntConverter.toAPI(commentId)}`, comment, {});
    if (!response.data) {
        throw new Error(`Failed to update comment ${commentId}`);
    }
    return {
        ...response.data,
        id: bigIntConverter.fromAPI(response.data.id),
        projectId: bigIntConverter.fromAPI(response.data.projectId)
    }
}

// Delete a comment
export async function deleteProjectComment(
    projectId: bigint,
    commentId: bigint,
    msalInstance: IPublicClientApplication
): Promise<boolean> {
    const response = await apiClient(msalInstance).delete(`/projects/${bigIntConverter.toAPI(projectId)}/comments/${bigIntConverter.toAPI(commentId)}`, {});
    if (response.status !== 204) {
        throw new Error(`Failed to delete comment ${commentId}`);
    }
    return true;
}
