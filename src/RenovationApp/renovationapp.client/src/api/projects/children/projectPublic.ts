import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicProjects, fetchPublicProjectImageURLs } from "./projectpublicQueries";

export function getPublicProjects( msalInstance: IPublicClientApplication) {
    const query = useQuery({
        queryKey: ["projects-pub"],
        queryFn: () => fetchPublicProjects(msalInstance),
    });
    return query;
}

export function getPublicProjectImageURLs(projectId: bigint, msalInstance: IPublicClientApplication) {
    const query = useQuery({
        queryKey: ["projects-pub", projectId, "public-images"],
        queryFn: () => fetchPublicProjectImageURLs(msalInstance, projectId),
    });
    return query;
}