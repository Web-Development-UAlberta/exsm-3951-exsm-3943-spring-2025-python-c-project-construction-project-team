import { IPublicClientApplication } from "@azure/msal-browser";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAllUsers, fetchGraphMe } from "./graphQueries";
import { graphMe } from "./graph.types";

const QUERY_KEY = "identity";

export function getActiveUserInfo(msalInstance: IPublicClientApplication) {
    const query = useQuery({
        queryKey: [QUERY_KEY, "me"],
        queryFn: () => fetchGraphMe(msalInstance),
    });
    return query;
}

export function getAllUserInfo(msalInstance: IPublicClientApplication) {
    const query = useQuery({
        queryKey: [QUERY_KEY, "all"],
        queryFn: () => fetchAllUsers(msalInstance),
    });
    return query;
}