import { IPublicClientApplication } from "@azure/msal-browser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RenovationTag } from "./renotag.types";
import { createRenovationTag, deleteRenovationTag, fetchRenovationTags } from "./renotagQueris";

const QUERY_KEY = "renovation-tag";

// Public query that doesn't require msalInstance
export function getRenovationTags() {
    const query = useQuery({
        queryKey: [QUERY_KEY],
        queryFn: () => fetchRenovationTags(),
    });
    return query;
}

export function useCreateRenovationTag(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (tag: RenovationTag) => createRenovationTag(msalInstance, tag),
        onSuccess: () => {
            // Invalidate and refetch the renovation tags query
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
}

export function useDeleteRenovationTag(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (tagId: string) => deleteRenovationTag(msalInstance, tagId),
        onSuccess: () => {
            // Invalidate and refetch the renovation tags query
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
}