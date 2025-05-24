import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjectFiles, uploadProjectFile } from "./projectFileQueries";
import { apiClient } from '../../axios';
import { bigIntConverter } from '../../../utils/bigIntConvert';


const QUERY_KEY = "projects";

export function useProjectFiles(projectId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: [QUERY_KEY, bigIntConverter.toAPI(projectId), "files"],
        queryFn: () => fetchProjectFiles(projectId, msalInstance),
    });
}

export function useUploadProjectFile(msalInstance: IPublicClientApplication) {
    const mutation = useMutation({
        mutationFn: ({ projectId, file, fileType }: { projectId: bigint, file: File; fileType: string }) => uploadProjectFile(projectId, file, fileType, msalInstance),
    });
    return mutation;
}

export function useDeleteProjectFile(projectId: bigint, msalInstance: IPublicClientApplication) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: bigint) =>
      apiClient(msalInstance).delete(`/projects/${bigIntConverter.toAPI(projectId)}/files/${bigIntConverter.toAPI(fileId)}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", bigIntConverter.toAPI(projectId), "files"] });
    },
  });
}