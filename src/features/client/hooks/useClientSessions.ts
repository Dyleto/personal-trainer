import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import { queryKeys } from '@/config/queryKeys';
import { useCompleteSession } from './useCompleteSession';
import { SessionMetrics } from '@/types';

export const useClientSessions = () => {
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

  const completedSessionIds = useMemo(
    () => new Set(history.map((h) => h.originalSessionId)),
    [history]
  );

  const sortedSessions = useMemo(
    () => [...sessions].sort((a, b) => a.order - b.order),
    [sessions]
  );

  // Première séance triée qui n'a pas encore été complétée — pas un calcul
  // par index, pour rester correct même si le client saute une séance.
  const nextSession = useMemo(
    () => sortedSessions.find((s) => !completedSessionIds.has(s._id)),
    [sortedSessions, completedSessionIds]
  );

  const isProgramComplete = sortedSessions.length > 0 && !nextSession;

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );

  const activeSession = useMemo(
    () =>
      selectedSessionId
        ? sessions.find((s) => s._id === selectedSessionId)
        : nextSession,
    [selectedSessionId, sessions, nextSession]
  );
  const isManualSelection =
    selectedSessionId !== null && selectedSessionId !== nextSession?._id;

  const selectSession = useCallback(
    (sessionId: string | null) => setSelectedSessionId(sessionId),
    []
  );

  const handleSubmitLog = useCallback(
    (metrics: SessionMetrics, clientNotes: string, completedAt?: string) => {
      if (!activeSession) return;
      completeSession.mutate(
        { sessionId: activeSession._id, metrics, clientNotes, completedAt },
        { onSuccess: () => setSelectedSessionId(null) }
      );
    },
    [activeSession, completeSession]
  );

  return {
    sessions,
    nextSession,
    activeSession,
    isManualSelection,
    isProgramComplete,
    selectSession,
    history,
    handleSubmitLog,
    isLoading: programQuery.isLoading || historyQuery.isLoading,
    isError: programQuery.isError || historyQuery.isError,
    isSubmitting: completeSession.isPending,
  };
};
