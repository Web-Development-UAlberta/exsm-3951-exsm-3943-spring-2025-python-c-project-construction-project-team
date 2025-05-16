import { IPublicClientApplication } from "@azure/msal-browser";
import { apiClient } from '../../axios';
import { ProjectPublicInfo, FileDownload, ProjectPublicInfoWithImages } from "../project.types";
import publicApiClient from "../../publicAxios";


export async function fetchPublicProjects(): Promise<ProjectPublicInfo[]> {
    const response = await publicApiClient().get(`/projects-pub`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch public projects`);
    }
    return response.data;
}

export async function fetchPublicProjectImageURLs(projectId: bigint): Promise<FileDownload[]> {
    const response = await publicApiClient().get(`/projects-pub/${projectId}/public-images`, {});
    if (!response.data) {
        throw new Error(`Failed to fetch all images for project with ID ${projectId}`);
    }
    return response.data;
}

export async function fetchPublicProjectsWithImages(): Promise<ProjectPublicInfoWithImages[]> {
    // First, get all the projects
    const projects = await fetchPublicProjects();

    // Create array to hold the final result
    const projectsWithImages: ProjectPublicInfoWithImages[] = [];

    // Process each project sequentially to avoid overwhelming the server
    for (const project of projects) {
        try {
            // Try to get images for this project
            const images = await fetchPublicProjectImageURLs(project.id);

            // Add to our result array
            projectsWithImages.push({
                ...project,
                images: images
            });
        } catch (error) {
            // If fetching images fails, still include the project with empty images
            console.warn(`Could not fetch images for project ${project.id}:`, error);
            projectsWithImages.push({
                ...project,
                images: []
            });
        }
    }

    return projectsWithImages;
}