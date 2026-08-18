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
    selectSession,
    history,
    handleSubmitLog,
    isLoading: programQuery.isLoading || historyQuery.isLoading,
    isError: programQuery.isError || historyQuery.isError,
    isSubmitting: completeSession.isPending,
  };
};
