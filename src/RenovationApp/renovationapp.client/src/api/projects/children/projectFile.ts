import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjectFiles, uploadProjectFile } from "./projectFileQueries";

export function useProjectFiles(projectId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", projectId, "files"],
        queryFn: () => fetchProjectFiles(projectId, msalInstance),
    });
}

export function useUploadProjectFile(msalInstance: IPublicClientApplication) {
    // const queryClient = useQueryClient();
    // return useMutation({
    //     mutationFn: ({ file, fileType }: { file: File; fileType: string }) =>
    //         uploadProjectFile(projectId, file, fileType, msalInstance),
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ["projects", projectId, "files"] });
    //     }
    // });

    const mutation = useMutation({
        mutationFn: ({ projectId, file, fileType }: { projectId: bigint, file: File; fileType: string }) => uploadProjectFile(projectId, file, fileType, msalInstance),
    });
    return mutation;
}
