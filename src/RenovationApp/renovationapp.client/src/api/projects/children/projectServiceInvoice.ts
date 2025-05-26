import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchProjectServiceInvoices,
    fetchProjectServiceInvoiceById,
    createProjectServiceInvoice,
    updateProjectServiceInvoice,
    deleteProjectServiceInvoice
} from "./projectServiceInvoiceQueries";
import { ProjectServiceInvoiceDTO } from "../project.types";
import { bigIntConverter } from "../../../utils/bigIntConvert";

export function useProjectServiceInvoices(projectId: bigint, serviceId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", bigIntConverter.toAPI(projectId), "services", bigIntConverter.toAPI(serviceId), "invoice"],
        queryFn: () => fetchProjectServiceInvoices(projectId, serviceId, msalInstance),
    });
}

export function useProjectServiceInvoice(projectId: bigint, serviceId: bigint, invoiceId: bigint, msalInstance: IPublicClientApplication) {
    return useQuery({
        queryKey: ["projects", bigIntConverter.toAPI(projectId), "services", bigIntConverter.toAPI(serviceId), "invoice", bigIntConverter.toAPI(invoiceId)],
        queryFn: () => fetchProjectServiceInvoiceById(projectId, serviceId, invoiceId, msalInstance),
    });
}

export function useCreateProjectServiceInvoice(projectId: bigint, serviceId: bigint, msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (invoice: ProjectServiceInvoiceDTO) =>
            createProjectServiceInvoice(projectId, serviceId, invoice, msalInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", bigIntConverter.toAPI(projectId), "services", bigIntConverter.toAPI(serviceId), "invoice"] });
        }
    });
}

export function useUpdateProjectServiceInvoice(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, serviceId, invoiceId, invoice }: { projectId: bigint, serviceId: bigint, invoiceId: bigint, invoice: ProjectServiceInvoiceDTO }) =>
            updateProjectServiceInvoice(projectId, serviceId, invoiceId, invoice, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects", bigIntConverter.toAPI(variables.projectId), "services", bigIntConverter.toAPI(variables.serviceId), "invoice"] });
            queryClient.invalidateQueries({ queryKey: ["projects", bigIntConverter.toAPI(variables.projectId), "services", bigIntConverter.toAPI(variables.serviceId), "invoice", bigIntConverter.toAPI(variables.invoiceId)] });
        }
    });
}

export function useDeleteProjectServiceInvoice(msalInstance: IPublicClientApplication) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, serviceId, invoiceId }: { projectId: bigint, serviceId: bigint, invoiceId: bigint }) =>
            deleteProjectServiceInvoice(projectId, serviceId, invoiceId, msalInstance),
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects", bigIntConverter.toAPI(variables.projectId), "services", bigIntConverter.toAPI(variables.serviceId), "invoice"] });
        }
    });
}
