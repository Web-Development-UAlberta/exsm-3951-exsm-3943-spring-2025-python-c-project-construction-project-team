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
import { ClientInvoiceDTO } from "./project.types";

const QUERY_KEY = "clientInvoices";

export function useClientInvoices(projectId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: [QUERY_KEY, { projectId }],
        queryFn: () => fetchClientInvoices(projectId, msalInstance),
    });
}

export function useClientInvoice(projectId: bigint, invoiceId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: [QUERY_KEY, { projectId, invoiceId }],
        queryFn: () => fetchClientInvoiceById(projectId, invoiceId, msalInstance),
    });
}

export function useCreateClientInvoice(projectId: bigint, msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (invoice: ClientInvoiceDTO) =>
            createClientInvoice(projectId, invoice, msalInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId }] });
        }
    });
}

export function useUpdateClientInvoice(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, invoiceId, invoice }: { projectId: bigint, invoiceId: bigint, invoice: ClientInvoiceDTO }) =>
            updateClientInvoice(projectId, invoiceId, invoice, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId: variables.projectId }] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId: variables.projectId, invoiceId: variables.invoiceId }] });
        }
    });
}

export function useDeleteClientInvoice(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, invoiceId }: { projectId: bigint, invoiceId: bigint }) =>
            deleteClientInvoice(projectId, invoiceId, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId: variables.projectId }] });
        }
    });
}

export function usePayClientInvoice(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, invoiceId }: { projectId: bigint, invoiceId: bigint }) =>
            payClientInvoice(projectId, invoiceId, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId: variables.projectId }] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId: variables.projectId, invoiceId: variables.invoiceId }] });
        }
    });
}
