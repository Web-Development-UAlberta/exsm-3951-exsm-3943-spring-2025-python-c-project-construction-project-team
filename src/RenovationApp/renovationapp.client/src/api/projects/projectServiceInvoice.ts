import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchProjectServiceInvoices,
    fetchProjectServiceInvoiceById,
    createProjectServiceInvoice,
    updateProjectServiceInvoice,
    deleteProjectServiceInvoice
} from "./projectServiceInvoiceQueries";
import { ProjectServiceInvoice, ProjectServiceInvoiceDTO } from "./project.types";

const QUERY_KEY = "projectServiceInvoices";

export function useProjectServiceInvoices(projectId: bigint, serviceId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: [QUERY_KEY, { projectId, serviceId }],
        queryFn: () => fetchProjectServiceInvoices(projectId, serviceId, msalInstance),
    });
}

export function useProjectServiceInvoice(projectId: bigint, serviceId: bigint, invoiceId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: [QUERY_KEY, { projectId, serviceId, invoiceId }],
        queryFn: () => fetchProjectServiceInvoiceById(projectId, serviceId, invoiceId, msalInstance),
    });
}

export function useCreateProjectServiceInvoice(projectId: bigint, serviceId: bigint, msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (invoice: ProjectServiceInvoiceDTO) =>
            createProjectServiceInvoice(projectId, serviceId, invoice, msalInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId, serviceId }] });
        }
    });
}

export function useUpdateProjectServiceInvoice(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, serviceId, invoiceId, invoice }: { projectId: bigint, serviceId: bigint, invoiceId: bigint, invoice: ProjectServiceInvoiceDTO }) =>
            updateProjectServiceInvoice(projectId, serviceId, invoiceId, invoice, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId: variables.projectId, serviceId: variables.serviceId }] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId: variables.projectId, serviceId: variables.serviceId, invoiceId: variables.invoiceId }] });
        }
    });
}

export function useDeleteProjectServiceInvoice(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, serviceId, invoiceId }: { projectId: bigint, serviceId: bigint, invoiceId: bigint }) =>
            deleteProjectServiceInvoice(projectId, serviceId, invoiceId, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, { projectId: variables.projectId, serviceId: variables.serviceId }] });
        }
    });
}
