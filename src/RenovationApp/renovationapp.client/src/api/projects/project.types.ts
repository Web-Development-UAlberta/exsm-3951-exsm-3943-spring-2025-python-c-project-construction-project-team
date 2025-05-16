export type ProjectPublicInfo = {
    id: bigint;
    renovationType?: string;
    costCategory?: number | null;
    renovationTagIds?: string[] | null;

}

export type FileDownload = {
    fileName: string;
    fileType: string;
    url: string;
}

export type ProjectPublicInfoWithImages = ProjectPublicInfo & {
    images: FileDownload[];
}