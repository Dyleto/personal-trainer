import { CompletedSession } from '@/types';
import { useEffect, useState } from 'react';
import { useMarkHistoryAsViewed } from '@/features/coach/hooks/useMarkHistoryAsViewed';
import { SessionHistoryCard } from '@/features/client';
import { Box, Grid } from '@chakra-ui/react';

interface Props {
  history: CompletedSession[];
  clientId: string;
}

export const ClientJournalTab = ({ history, clientId }: Props) => {
  const { mutate: markHistoryAsViewed } = useMarkHistoryAsViewed(clientId);
  const [initialUnseenIds] = useState<Set<string>>(
    () =>
      new Set(history.filter((c) => c.viewedByCoach !== true).map((c) => c._id))
  );

  useEffect(() => {
    if (initialUnseenIds.size > 0) markHistoryAsViewed();
  }, [initialUnseenIds, markHistoryAsViewed]);

  if (history.length === 0) {
    return (
      <Box p={4} color="fg.muted">
        Aucune séance réalisée pour l'instant.
      </Box>
    );
  }

  return (
    <Grid
      templateColumns={{
        base: '1fr',
        md: 'repeat(2, 1fr)',
        xl: 'repeat(3, 1fr)',
      }}
      gap={4}
      alignItems="start"
    >
      {history.map((c) => (
        <SessionHistoryCard
          key={c._id}
          completed={c}
          showUnseenIndicator={initialUnseenIds.has(c._id)}
        />
      ))}
    </Grid>
  );
};
