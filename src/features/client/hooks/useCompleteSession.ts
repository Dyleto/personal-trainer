import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toaster } from '@/components/ui/toasterInstance';
import { clientService } from '@/services/clientService';
import { queryKeys } from '@/config/queryKeys';
import { SessionMetrics } from '@/types';

export const useCompleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      metrics,
      clientNotes,
      completedAt,
    }: {
      sessionId: string;
      metrics: SessionMetrics;
      clientNotes?: string;
      completedAt?: string;
    }) =>
      clientService.completeSession(sessionId, {
        metrics,
        clientNotes,
        completedAt,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.client.history.all(),
      });
    },
    onError: () => {
      toaster.create({
        title: 'Erreur',
        description: 'Impossible de valider la séance, réessaie.',
        type: 'error',
      });
    },
  });
};
