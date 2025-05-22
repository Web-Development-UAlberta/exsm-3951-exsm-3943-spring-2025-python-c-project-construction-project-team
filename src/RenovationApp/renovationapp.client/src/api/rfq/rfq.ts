import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllRFQs, fetchRFQById, createRFQ, updateRFQ, fetchRFQImages, uploadRFQImage } from "./rfqQueries";
import { RFQ, RFQCreate, RFQUpdate} from "./rfq.types";

const QUERY_KEY = "rfq";

export function getRFQById(rfqId: bigint, msalInstance: IPublicClientApplication) {
    const query = useQuery({
        queryKey: [QUERY_KEY, {id:rfqId}],
        queryFn: () => fetchRFQById(rfqId, msalInstance),
    });
    return query;
}

export function getAllRFQs(msalInstance: IPublicClientApplication) {
    const query = useQuery({
        queryKey: [QUERY_KEY],
        queryFn: () => fetchAllRFQs(msalInstance),
    });
    return query;
}

export function getRFQImagesByRFQId(rfqId: bigint, msalInstance: IPublicClientApplication) {
    const query = useQuery({
        queryKey: [QUERY_KEY, "images", {id:rfqId}],
        queryFn: () => fetchRFQImages(rfqId, msalInstance),
    });
    return query;
}

export function useCreateRFQ(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (rfq: RFQCreate) => createRFQ(rfq, msalInstance),
        onSuccess: (result: RFQ) => {
            queryClient.setQueryData(["rfqs", { id: result.id }], result);
        }
    });
    return mutation;
}

export function useUpdateRFQ(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({ rfqId, rfq }: { rfqId: bigint; rfq: RFQUpdate }) => updateRFQ(rfqId, rfq, msalInstance),
        onSuccess: (result: RFQ) => {
            queryClient.setQueryData(["rfqs", { id: result.id }], result);
        }
    });
    return mutation;
}

export function uploadImageToRFQ(msalInstance: IPublicClientApplication) {
    const mutation = useMutation({
        mutationFn: ({ rfqId, file, fileName }: { rfqId: bigint; file: File; fileName: string }) => uploadRFQImage(rfqId, file, fileName, msalInstance),
    });
    return mutation;
}