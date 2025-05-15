import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjectFiles, uploadProjectFile } from "./projectFileQueries";

const QUERY_KEY = "projectFiles";

export function useProjectFiles(projectId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: [QUERY_KEY, { projectId }],
        queryFn: () => fetchProjectFiles(projectId, msalInstance),
    });
}

export function useUploadProjectFile(projectId: bigint, msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ file, fileType }: { file: File; fileType: string }) =>
            uploadProjectFile(projectId, file, fileType, msalInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId }] });
        }
    });
}
