import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAllRFQs, updateRFQ } from '../../../../api/rfq/rfqQueries';
import { RFQ } from '../../../../api/rfq/rfq.types';
import { IPublicClientApplication } from '@azure/msal-browser';

interface Request {
  id: number;
  clientId: string;
  client: string;
  project_address: string;
  project_manager: string;
  status: string;
}

export const useRFQManagement = (instance: IPublicClientApplication) => {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { 
    data: rfqs, 
    isLoading, 
    error: queryError,
    refetch
  } = useQuery<Request[]>({
    queryKey: ['rfqs'],
    queryFn: async () => {
      const rfqData = await fetchAllRFQs(instance);
      return rfqData.map((rfq: RFQ) => ({
        id: Number(rfq.id),
        clientId: rfq.clientId,
        client: rfq.clientId,
        project_address: rfq.projectAddress ?? 'N/A',
        project_manager: rfq.assignedEmployeeId ?? 'N/A',
        status: rfq.status ?? 'Created'
      }));
    }
  });

  const handleProjectManagerChange = async (requestId: number, managerId: string) => {
    setErrorMessage(null);

    // Optimistic update
    queryClient.setQueryData(['rfqs'], (oldData: Request[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.map(request => 
        request.id === requestId 
          ? { ...request, project_manager: managerId }
          : request
      );
    });

    try {
      await updateRFQ(
        BigInt(requestId), 
        { assignedEmployeeId: managerId }, 
        instance
      );
    } catch (error) {
      console.error('Failed to update project manager:', error);
      setErrorMessage('Failed to update project manager. Please try again.');
      // Only refetch on error to revert the optimistic update
      await refetch();
    }
  };

  return {
    rfqs,
    isLoading,
    queryError,
    errorMessage,
    handleProjectManagerChange,
    refetch
  };
};