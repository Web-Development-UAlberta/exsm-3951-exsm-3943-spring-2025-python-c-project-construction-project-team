import { IPublicClientApplication } from "@azure/msal-browser";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchGraphMe, updateGraphMe, fetchProjectManagers } from "./graphQueries";
import { graphMe } from "./graph.types";

const QUERY_KEY = "identity";

export function getActiveUserInfo(msalInstance: IPublicClientApplication) {
    const query = useQuery({
        queryKey: [QUERY_KEY, "me"],
        queryFn: () => fetchGraphMe(msalInstance),
    });
    return query;
}

// Update active user information
export function updateActiveUserInfo(msalInstance: IPublicClientApplication) {
    return useMutation({
        mutationFn: (data: Partial<graphMe>) => updateGraphMe(msalInstance, data),
    });
}

export function getProjectManagers(msalInstance: IPublicClientApplication) {
    const query = useQuery({
        queryKey: [QUERY_KEY, "projectManagers"],
        queryFn: () => fetchProjectManagers(msalInstance),
        refetchOnWindowFocus: false,
    });
    return query;
}