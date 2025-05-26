import { useQuery } from "@tanstack/react-query";
import { fetchPublicProjects, fetchPublicProjectImageURLs, fetchPublicProjectsWithImages } from "./projectpublicQueries";

export function getPublicProjects() {
    const query = useQuery({
        queryKey: ["projects-pub"],
        queryFn: () => fetchPublicProjects(),
    });
    return query;
}

export function getPublicProjectImageURLs(projectId: bigint) {
    const query = useQuery({
        queryKey: ["projects-pub", projectId, "public-images"],
        queryFn: () => fetchPublicProjectImageURLs(projectId),
    });
    return query;
}

export function getPublicProjectsWithImages() {
    const query = useQuery({
        queryKey: ["projects-pub"],
        queryFn: () => fetchPublicProjectsWithImages(),
    });
    return query;
}