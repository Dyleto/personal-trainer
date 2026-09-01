import { CompletedSession } from '@/types';
import { useEffect, useState } from 'react';
import { EFFORT_ZONE_COLOR } from '@/features/client/constants';
import { useMarkHistoryAsViewed } from '@/features/coach/hooks/useMarkHistoryAsViewed';
import {
  CompletedSessionDrawer,
  getEffortSummary,
  getRelativeDate,
} from '@/features/client';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { LuChevronRight } from 'react-icons/lu';

interface Props {
  history: CompletedSession[];
  clientId: string;
}

interface JournalEntryProps {
  completed: CompletedSession;
  isUnseen: boolean;
  onOpen: () => void;
}

const JournalEntry = ({ completed, isUnseen, onOpen }: JournalEntryProps) => {
  const effort = getEffortSummary(completed);

  return (
    <Box
      py={3}
      px={2}
      borderRadius="md"
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
      cursor="pointer"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      _hover={{ bg: 'whiteAlpha.50' }}
      _focusVisible={{
        outline: '2px solid',
        outlineColor: 'app.primary',
        outlineOffset: '-2px',
      }}
    >
      <HStack justify="space-between" align="baseline">
        <HStack gap={2}>
          <Text fontWeight="bold" fontSize="sm">
            Séance {completed.sessionOrder}
          </Text>
          {isUnseen && (
            <Box w="6px" h="6px" borderRadius="full" bg="session.work" />
          )}
        </HStack>
        <HStack gap={2}>
          <Text fontSize="xs" color="fg.muted">
            {getRelativeDate(completed.completedAt)}
          </Text>
          {effort && (
            <Text
              fontSize="xs"
              fontWeight="bold"
              color={EFFORT_ZONE_COLOR[effort.zone]}
            >
              {effort.label}
            </Text>
          )}
          <LuChevronRight size={13} color="var(--chakra-colors-fg-muted)" />
        </HStack>
      </HStack>
      {completed.clientNotes ? (
        <Text fontSize="sm" color="fg" fontStyle="italic" mt={1.5}>
          "{completed.clientNotes}"
        </Text>
      ) : (
        <Text fontSize="sm" color="fg.muted" fontStyle="italic" mt={1.5}>
          Aucun commentaire laissé par le client.
        </Text>
      )}
    </Box>
  );
};

export const ClientJournalTab = ({ history, clientId }: Props) => {
  const { mutate: markHistoryAsViewed } = useMarkHistoryAsViewed(clientId);
  const [openCompleted, setOpenCompleted] = useState<CompletedSession | null>(
    null
  );

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
    <>
      <VStack align="stretch" gap={0}>
        {history.map((c) => (
          <JournalEntry
            key={c._id}
            completed={c}
            isUnseen={initialUnseenIds?.has(c._id) ?? false}
            onOpen={() => setOpenCompleted(c)}
          />
        ))}
      </VStack>

      {openCompleted && (
        <CompletedSessionDrawer
          completed={openCompleted}
          isOpen={!!openCompleted}
          onClose={() => setOpenCompleted(null)}
        />
      )}
    </>
  );
};
