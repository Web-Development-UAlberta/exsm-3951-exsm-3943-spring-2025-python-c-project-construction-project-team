import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicProjects, fetchPublicProjectImageURLs } from "./projectpublicQueries";

const QUERY_KEY = "projects-pub";

export function getPublicProjects( msalInstance: IPublicClientApplication) {
    const query = useQuery({
        queryKey: [QUERY_KEY],
        queryFn: () => fetchPublicProjects(msalInstance),
    });
    return query;
}

export function getPublicProjectImageURLs(projectId: bigint, msalInstance: IPublicClientApplication) {
    const query = useQuery({
        queryKey: [QUERY_KEY, "images", {id:projectId}],
        queryFn: () => fetchPublicProjectImageURLs(msalInstance, projectId),
    });
    return query;
}