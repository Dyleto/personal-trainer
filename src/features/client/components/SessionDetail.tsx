import { PerformedValues, Session } from '@/types';
import { BlockCard } from '@/features/program/components/BlockCard';
import { Box, Skeleton, Text, VStack } from '@chakra-ui/react';
import { PerformedFields } from './PerformedFields';
import {
  formatLastPerformance,
  LastPerformance,
  performedKey,
} from '../lastPerformance';

interface SessionDetailProps {
  session: Session;
  isLoading?: boolean;
  /** Saisie du réalisé. Absent = lecture seule, rendu inchangé. */
  performed?: Record<string, PerformedValues>;
  onPerformedChange?: (key: string, next: PerformedValues) => void;
  lastPerformance?: Map<string, LastPerformance>;
}

export const SessionDetail = ({
  session,
  isLoading,
  performed,
  onPerformedChange,
  lastPerformance,
}: SessionDetailProps) => {
  if (isLoading) {
    return (
      <VStack align="stretch" gap={3}>
        <Skeleton h="80px" borderRadius="lg" />
        <Skeleton h="200px" borderRadius="lg" />
      </VStack>
    );
  }

  const isRecording = !!performed && !!onPerformedChange;

  return (
    <VStack align="stretch" gap={4}>
      {session.notes && (
        <Box
          p={3}
          bg="whiteAlpha.50"
          borderRadius="md"
          borderLeft="3px solid"
          borderLeftColor="app.primary.border"
        >
          <Text fontSize="xs" color="fg.muted" mb={1} fontWeight="bold">
            Note du coach
          </Text>
          <Text fontSize="sm" color="fg" whiteSpace="pre-wrap">
            {session.notes}
          </Text>
        </Box>
      )}

      {session.blocks.map((block) => (
        <BlockCard
          key={block._id}
          block={block}
          renderExerciseExtra={
            isRecording
              ? ({ blockOrder, exerciseOrder, exerciseId }) => {
                  const key = performedKey(blockOrder, exerciseOrder);
                  return (
                    <PerformedFields
                      value={performed[key] ?? {}}
                      onChange={(next) => onPerformedChange(key, next)}
                      lastLabel={formatLastPerformance(
                        exerciseId
                          ? lastPerformance?.get(exerciseId)
                          : undefined
                      )}
                    />
                  );
                }
              : undefined
          }
        />
      ))}
      {session.blocks.length === 0 && (
        <Box p={4} textAlign="center">
          <Text color="fg.muted" fontSize="sm">
            Aucun bloc pour cette séance.
          </Text>
        </Box>
      )}
    </VStack>
  );
};
