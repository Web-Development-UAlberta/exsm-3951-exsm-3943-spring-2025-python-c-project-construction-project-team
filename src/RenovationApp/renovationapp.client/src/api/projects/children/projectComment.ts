import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchProjectComments,
    fetchProjectCommentById,
    createProjectComment,
    updateProjectComment,
    deleteProjectComment,
} from "./projectCommentQueries";
import { ProjectCommentEdit } from "../project.types";

export function useProjectComments(projectId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", projectId, "comments"],
        queryFn: () => fetchProjectComments(projectId, msalInstance),
    });
}

export function useProjectComment(projectId: bigint, commentId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", projectId, "comments", commentId],
        queryFn: () => fetchProjectCommentById(projectId, commentId, msalInstance),
    });
}

export function useCreateProjectComment(projectId: bigint, msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (comment: ProjectCommentEdit) =>
            createProjectComment(projectId, comment, msalInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", projectId, "comments"] });
        }
    });
}

export function useUpdateProjectComment(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, commentId, comment }: {projectId: bigint, commentId: bigint; comment: ProjectCommentEdit }) =>
            updateProjectComment(projectId, commentId, comment, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "comments"] });
            queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "comments", variables.commentId] });
        }
    });
}

export function useDeleteProjectComment(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, commentId } : {projectId: bigint, commentId: bigint;}) =>
            deleteProjectComment(projectId, commentId, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "comments"] });
        }
    });
}
