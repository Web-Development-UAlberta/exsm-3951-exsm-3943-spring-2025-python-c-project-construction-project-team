import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjectFiles, uploadProjectFile } from "./projectFileQueries";
import { apiClient } from '../../axios';


export function useProjectFiles(projectId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", projectId, "files"],
        queryFn: () => fetchProjectFiles(projectId, msalInstance),
    });
}

export function useUploadProjectFile(projectId: bigint, msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ file, fileType }: { file: File; fileType: string }) =>
            uploadProjectFile(projectId, file, fileType, msalInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", projectId, "files"] });
        }
    });
}

export function useDeleteProjectFile(projectId: bigint, msalInstance: IPublicClientApplication) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: bigint) =>
      apiClient(msalInstance).delete(`/projects/${projectId}/files/${fileId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "files"] });
    },
  });
}