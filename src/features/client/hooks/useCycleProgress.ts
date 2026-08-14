import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import { queryKeys } from '@/config/queryKeys';
import { useCompleteSession } from './useCompleteSession';
import { SessionMetrics } from '@/types';

export const useCycleProgress = () => {
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
  const completed = useMemo(() => historyQuery.data ?? [], [historyQuery.data]);

  const history = useMemo(
    () =>
      [...completed].sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      ),
    [completed]
  );

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );

  const { currentCycleNumber, sessionsDoneInCurrentCycle, nextSession } =
    useMemo(() => {
      const currentProgramSessionIds = sessions.map((s) => s._id);
      const currentProgramHistory = history.filter((c) =>
        currentProgramSessionIds.includes(c.originalSessionId)
      );

      const totalCompletedInProgram = currentProgramHistory.length;
      const completedCycles = Math.floor(
        totalCompletedInProgram / (sessions.length || 1)
      );

      const lastCompleted = currentProgramHistory[0];
      const next = lastCompleted
        ? sessions.find(
            (s) =>
              s.order === (lastCompleted.sessionOrder % sessions.length) + 1
          )
        : sessions[0];

      return {
        currentCycleNumber: completedCycles + 1,
        sessionsDoneInCurrentCycle:
          totalCompletedInProgram % (sessions.length || 1),
        nextSession: next,
      };
    }, [history, sessions]);

  const activeSession = useMemo(
    () =>
      selectedSessionId
        ? sessions.find((session) => session._id === selectedSessionId)
        : nextSession,
    [selectedSessionId, sessions, nextSession]
  );

  const isManualSelection =
    selectedSessionId !== null && selectedSessionId !== nextSession?._id;

  const selectSession = useCallback((sessionId: string | null) => {
    setSelectedSessionId(sessionId);
  }, []);

  const handleSubmitLog = useCallback(
    (metrics: SessionMetrics, clientNotes: string, completedAt?: string) => {
      if (!activeSession) return;
      completeSession.mutate(
        {
          sessionId: activeSession._id,
          metrics,
          clientNotes,
          completedAt,
        },
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
    currentCycleNumber,
    sessionsDoneInCurrentCycle,
    handleSubmitLog,
    isLoading: programQuery.isLoading || historyQuery.isLoading,
    isError: programQuery.isError || historyQuery.isError,
    isSubmitting: completeSession.isPending,
  };
};
