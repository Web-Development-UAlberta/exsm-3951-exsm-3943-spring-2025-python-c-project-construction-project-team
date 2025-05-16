import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchRenovationTags,
    createRenovationTag,
    deleteRenovationTag
} from "./renotagsQueries";
import { RenovationTag } from "./renotags.types";

// GET all tags
export function useRenovationTags(msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["renotags"],
        queryFn: () => fetchRenovationTags(msalInstance),
    });
}

// POST a new tag
export function useCreateRenovationTag(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (tag: RenovationTag) => createRenovationTag(tag, msalInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["renotags"] });
        }
    });
}

// DELETE a tag
export function useDeleteRenovationTag(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteRenovationTag(id, msalInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["renotags"] });
        }
    });
}
