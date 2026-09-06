import { toaster } from '@/components/ui/toasterInstance';
import api from '@/config/api';
import { queryKeys } from '@/config/queryKeys';
import { Session } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateProgramSessions = (clientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessions: Session[]) => {
      const formattedSessions = sessions.map((session, si) => ({
        _id: session._id,
        order: si + 1,
        notes: session.notes?.trim(),
        suggestedDays: session.suggestedDays ?? [],
        blocks: session.blocks.map((block, bi) => ({
          type: block.type,
          label: block.label || undefined,
          order: bi + 1,
          notes: block.notes?.trim(),
          durationMinutes: block.durationMinutes,
          intervalMinutes: block.intervalMinutes,
          rounds: block.rounds,
          restBetweenRounds: block.restBetweenRounds,
          workDuration: block.workDuration,
          restDuration: block.restDuration,
          repsScheme: block.repsScheme,
          exercises: block.exercises
            .filter((ex) => ex.exercise?._id)
            .map((ex, ei) => ({
              exerciseId: ex.exercise._id,
              order: ei + 1,
              sets: ex.sets,
              reps: ex.reps,
              duration: ex.duration,
              restBetweenSets: ex.restBetweenSets,
              customMetric: ex.customMetric,
            })),
        })),
      }));

      const { data } = await api.put(
        `/api/coach/clients/${clientId}/program/sessions`,
        { sessions: formattedSessions }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.coach.clients.detail(clientId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.client.program.get(),
      });
      toaster.create({ title: 'Programme sauvegardé', type: 'success' });
    },
    onError: () => {
      toaster.create({
        title: 'Erreur lors de la sauvegarde du programme',
        type: 'error',
      });
    },
  });
};
