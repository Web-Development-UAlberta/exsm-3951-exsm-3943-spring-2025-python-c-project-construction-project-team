import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllRFQs, fetchRFQById, createRFQ, updateRFQ, fetchRFQImages, uploadRFQImage } from "./rfqQueries";
import { RFQ, RFQCreate, RFQUpdate} from "./rfq.types";
import { bigIntConverter } from "../../utils/bigIntConvert";

const QUERY_KEY = "rfqs";

export function getRFQById(rfqId: bigint, msalInstance: IPublicClientApplication) {
    const query = useQuery({
        queryKey: [QUERY_KEY, { id: bigIntConverter.toAPI(rfqId) }],
        queryFn: () => fetchRFQById(rfqId, msalInstance),
        enabled: !!rfqId,
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
        queryKey: [QUERY_KEY, { id: bigIntConverter.toAPI(rfqId) }, "images"],
        queryFn: () => fetchRFQImages(rfqId, msalInstance),
        enabled: !!rfqId,
    });
    return query;
}

export function useCreateRFQ(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (rfq: RFQCreate) => createRFQ(rfq, msalInstance),
        onSuccess: (result: RFQ) => {
            queryClient.setQueryData([QUERY_KEY, { id: bigIntConverter.toAPI(result.id) }], result);
        }
    });
    return mutation;
}

export function useUpdateRFQ(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({ rfqId, rfq }: { rfqId: bigint; rfq: RFQUpdate }) => updateRFQ(rfqId, rfq, msalInstance),
        onSuccess: (result: RFQ, variables) => {
            // Convert bigint to string 
            const rfqIdString = bigIntConverter.toAPI(variables.rfqId);
            // Update the specific RFQ in the cache
            queryClient.setQueryData([QUERY_KEY, { id: rfqIdString }], result);
            // Update the list of RFQs
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            // Update the images for the specific RFQ if it exists
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { id: rfqIdString }, "images"] });
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