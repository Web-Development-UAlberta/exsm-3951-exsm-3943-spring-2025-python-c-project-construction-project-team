import { useQuery } from "@tanstack/react-query";
import { fetchPublicProjects, fetchPublicProjectImageURLs, fetchPublicProjectsWithImages } from "./projectpublicQueries";

const QUERY_KEY = "projects-pub";

export function getPublicProjects() {
    const query = useQuery({
        queryKey: [QUERY_KEY],
        queryFn: () => fetchPublicProjects(),
    });
    return query;
}

export function getPublicProjectImageURLs(projectId: bigint) {
    const query = useQuery({
        queryKey: [QUERY_KEY, "images", { id: projectId }],
        queryFn: () => fetchPublicProjectImageURLs(projectId),
    });
    return query;
}

export function getPublicProjectsWithImages() {
    const query = useQuery({
        queryKey: [QUERY_KEY],
        queryFn: () => fetchPublicProjectsWithImages(),
    });
    return query;
}