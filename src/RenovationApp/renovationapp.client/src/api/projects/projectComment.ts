import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchProjectComments,
    fetchProjectCommentById,
    createProjectComment,
    updateProjectComment,
    deleteProjectComment,
} from "./projectCommentQueries";
import { ProjectCommentEdit } from "./project.types";

const QUERY_KEY = "projectComments";

export function useProjectComments(projectId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: [QUERY_KEY, { projectId }],
        queryFn: () => fetchProjectComments(projectId, msalInstance),
    });
}

export function useProjectComment(projectId: bigint, commentId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: [QUERY_KEY, { commentId }],
        queryFn: () => fetchProjectCommentById(projectId, commentId, msalInstance),
    });
}

export function useCreateProjectComment(projectId: bigint, msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (comment: ProjectCommentEdit) =>
            createProjectComment(projectId, comment, msalInstance),
        onSuccess: () => {
            // Invalidate the list of comments for this project
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId }] });
        }
    });
}

export function useUpdateProjectComment(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, commentId, comment }: {projectId: bigint, commentId: bigint; comment: ProjectCommentEdit }) =>
            updateProjectComment(projectId, commentId, comment, msalInstance),
        onSuccess: (_result, variables) => {
            // Invalidate both the single comment and the list for this project
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId: variables.projectId }] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId: variables.projectId, commentId: variables.commentId }] });
        }
    });
}

export function useDeleteProjectComment(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, commentId } : {projectId: bigint, commentId: bigint;}) =>
            deleteProjectComment(projectId, commentId, msalInstance),
        onSuccess: (_result, variables) => {
            // Invalidate the list of comments for this project
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId: variables.projectId }] });
        }
    });
}
