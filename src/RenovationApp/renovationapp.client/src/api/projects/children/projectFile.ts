import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchProjectFiles, uploadProjectFile } from "./projectFileQueries";

const QUERY_KEY = "projects";

export function useProjectFiles(projectId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: [QUERY_KEY, projectId, "files"],
        queryFn: () => fetchProjectFiles(projectId, msalInstance),
    });
}

export function useUploadProjectFile(msalInstance: IPublicClientApplication) {
    const mutation = useMutation({
        mutationFn: ({ projectId, file, fileType }: { projectId: bigint, file: File; fileType: string }) => uploadProjectFile(projectId, file, fileType, msalInstance),
    });
    return mutation;
}
