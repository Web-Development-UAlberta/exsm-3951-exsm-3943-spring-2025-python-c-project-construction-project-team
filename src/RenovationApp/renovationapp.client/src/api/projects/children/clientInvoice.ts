import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchClientInvoices,
    fetchClientInvoiceById,
    createClientInvoice,
    updateClientInvoice,
    deleteClientInvoice,
    payClientInvoice
} from "./clientInvoiceQueries";
import { ClientInvoiceDTO } from "../project.types";
import { bigIntConverter } from "../../../utils/bigIntConvert";

export function useClientInvoices(projectId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", bigIntConverter.toAPI(projectId), "clientinvoices"],
        queryFn: () => fetchClientInvoices(projectId, msalInstance),
    });
}

export function useClientInvoice(projectId: bigint, invoiceId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", bigIntConverter.toAPI(projectId), "clientinvoices", bigIntConverter.toAPI(invoiceId)],
        queryFn: () => fetchClientInvoiceById(projectId, invoiceId, msalInstance),
    });
}

export function useCreateClientInvoice(projectId: bigint, msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (invoice: ClientInvoiceDTO) =>
            createClientInvoice(projectId, invoice, msalInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", bigIntConverter.toAPI(projectId), "clientinvoices"] });
        }
    });
}

export function useUpdateClientInvoice(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, invoiceId, invoice }: { projectId: bigint, invoiceId: bigint, invoice: ClientInvoiceDTO }) =>
            updateClientInvoice(projectId, invoiceId, invoice, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects", bigIntConverter.toAPI(variables.projectId), "clientinvoices"] });
            queryClient.invalidateQueries({ queryKey: ["projects", bigIntConverter.toAPI(variables.projectId), "clientinvoices", bigIntConverter.toAPI(variables.invoiceId)] });
        }
    });
}

export function useDeleteClientInvoice(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, invoiceId }: { projectId: bigint, invoiceId: bigint }) =>
            deleteClientInvoice(projectId, invoiceId, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects", bigIntConverter.toAPI(variables.projectId), "clientinvoices"] });
        }
    });
}

export function usePayClientInvoice(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, invoiceId }: { projectId: bigint, invoiceId: bigint }) =>
            payClientInvoice(projectId, invoiceId, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects", bigIntConverter.toAPI(variables.projectId), "clientinvoices"] });
            queryClient.invalidateQueries({ queryKey: ["projects", bigIntConverter.toAPI(variables.projectId), "clientinvoices", bigIntConverter.toAPI(variables.invoiceId)] });
        }
    });
}
