import { useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import { queryKeys } from '@/config/queryKeys';
import { CLIENT_ROUTES } from '@/config/routes';
import { toaster } from '@/components/ui/toasterInstance';
import { useCompleteSession } from './useCompleteSession';
import { PerformedEntry, SessionFeedback } from '@/types';
import { buildLastPerformanceIndex } from '../lastPerformance';

export const useClientSessions = () => {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();

  const programQuery = useQuery({
    queryKey: queryKeys.client.program.get(),
    queryFn: clientService.getProgram,
  });
  const historyQuery = useQuery({
    queryKey: queryKeys.client.history.all(),
    queryFn: clientService.getHistory,
  });
  const completeSession = useCompleteSession();

  const sessions = useMemo(
    () => programQuery.data?.sessions ?? [],
    [programQuery.data]
  );
  const history = useMemo(
    () =>
      [...(historyQuery.data ?? [])].sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      ),
    [historyQuery.data]
  );

  // Le programme est un cycle : une fois la dernière séance faite, on
  // reprend à la première. Il n'y a pas de « fin » de programme.
  const nextSession = useMemo(() => {
    const sortedSessions = [...sessions].sort((a, b) => a.order - b.order);
    if (sortedSessions.length === 0) return undefined;

    const lastCompleted = history[0];
    if (!lastCompleted) return sortedSessions[0];

    const lastIndex = sortedSessions.findIndex(
      (s) => s._id === lastCompleted.originalSessionId
    );
    if (lastIndex === -1) return sortedSessions[0];

    return sortedSessions[(lastIndex + 1) % sortedSessions.length];
  }, [sessions, history]);

  // « J'avais mis combien la dernière fois ? » se répond depuis l'historique
  // déjà chargé : aucune requête, aucune route supplémentaire.
  const lastPerformance = useMemo(
    () => buildLastPerformanceIndex(history),
    [history]
  );

  const isLoading = programQuery.isLoading || historyQuery.isLoading;

  const requestedSession = sessionId
    ? sessions.find((s) => s._id === sessionId)
    : undefined;
  const activeSession = sessionId ? requestedSession : nextSession;
  const isManualSelection = !!sessionId && sessionId !== nextSession?._id;

  // Un identifiant qui ne correspond à aucune séance (lien périmé, séance
  // supprimée par le coach) ramène au programme plutôt que de rester bloqué.
  useEffect(() => {
    if (!isLoading && sessionId && !requestedSession) {
      toaster.create({
        title: 'Séance introuvable',
        description: "Cette séance n'existe plus dans ton programme.",
        type: 'info',
      });
      navigate(CLIENT_ROUTES.program, { replace: true });
    }
  }, [isLoading, sessionId, requestedSession, navigate]);

  const handleSubmitLog = useCallback(
    (
      feedback: SessionFeedback,
      clientNotes: string,
      completedAt?: string,
      performed?: PerformedEntry[]
    ) => {
      if (!activeSession) return;
      completeSession.mutate(
        {
          sessionId: activeSession._id,
          feedback,
          clientNotes,
          completedAt,
          ...(performed && performed.length > 0 ? { performed } : {}),
        },
        { onSuccess: () => navigate(CLIENT_ROUTES.today) }
      );
    },
    [activeSession, completeSession, navigate]
  );

  return {
    sessions,
    nextSession,
    activeSession,
    isManualSelection,
    history,
    lastPerformance,
    handleSubmitLog,
    isLoading,
    isError: programQuery.isError || historyQuery.isError,
    isSubmitting: completeSession.isPending,
  };
};
