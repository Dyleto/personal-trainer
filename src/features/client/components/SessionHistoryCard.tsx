import { Card } from '@/components/Card';
import { CompletedSession } from '@/types';
import {
  getCompletedSessionBlockTypes,
  getEffortSummary,
} from '@/features/client';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { LuChevronRight } from 'react-icons/lu';
import { useState } from 'react';
import { CompletedSessionDrawer } from './CompletedSessionDrawer';
import { EFFORT_ZONE_COLOR } from '@/features/client/constants';

interface SessionHistoryCardProps {
  completed: CompletedSession;
  showUnseenIndicator?: boolean;
}

export const SessionHistoryCard = ({
  completed,
  showUnseenIndicator = false,
}: SessionHistoryCardProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const completedDate = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(completed.completedAt));

  // Un mot que le client et le coach lisent pareil, au lieu d'un nombre
  // qu'aucun des deux ne peut interpréter.
  const effort = getEffortSummary(completed);

  return (
    <Card
      accentColor="app.primary"
      hoverEffect="border"
      withGlow={false}
      onClick={() => setIsDrawerOpen(true)}
      p={4}
    >
      <VStack align="stretch" gap={2}>
        <HStack justify="space-between" align="center">
          <HStack gap={2}>
            <Text fontSize="sm" fontWeight="bold">
              Séance {completed.sessionOrder}
            </Text>
            {showUnseenIndicator && (
              <Box
                px={2}
                py={0.5}
                borderRadius="full"
                bg="session.work/16"
                color="session.work.fg"
                fontSize="2xs"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Nouveau
              </Box>
            )}
          </HStack>
          {effort && (
            <Text
              fontSize="xs"
              fontWeight="bold"
              color={EFFORT_ZONE_COLOR[effort.zone]}
            >
              {effort.label}
            </Text>
          )}
        </HStack>

        <Text fontSize="xs" color="fg.muted">
          {completedDate} · {getCompletedSessionBlockTypes(completed)}
        </Text>

        {completed.clientNotes && (
          <Text fontSize="xs" color="fg.muted" fontStyle="italic" lineClamp={2}>
            "{completed.clientNotes}"
          </Text>
        )}

        <HStack gap={1} color="app.primary" justify="flex-end">
          <Text fontSize="xs" fontWeight="medium">
            Voir le détail
          </Text>
          <LuChevronRight size={13} color="var(--chakra-colors-app-primary)" />
        </HStack>
      </VStack>

      <CompletedSessionDrawer
        completed={completed}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        editable
      />
    </Card>
  );
};
