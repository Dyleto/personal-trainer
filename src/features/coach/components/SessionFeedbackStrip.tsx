import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { CompletedSession } from '@/types';
import { getRelativeDate } from '@/features/client';
import { EFFORT_ZONE_COLOR, getEffortLevel } from '@/features/client/constants';
import { EffortTrend } from './EffortTrend';

interface SessionFeedbackStripProps {
  // Déjà filtré par la page appelante sur originalSessionId === session._id
  history: CompletedSession[];
  // 'strip' : bandeau au-dessus de la séance (écrans étroits)
  // 'panel' : colonne de contexte à droite (à partir de 2xl)
  variant?: 'strip' | 'panel';
}

export const SessionFeedbackStrip = ({
  history,
  variant = 'strip',
}: SessionFeedbackStripProps) => {
  const recent = [...history].sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  if (variant === 'panel') {
    return (
      <Box
        borderWidth="1px"
        borderColor="whiteAlpha.100"
        borderRadius="lg"
        p={4}
      >
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="fg.muted"
          textTransform="uppercase"
          letterSpacing="wider"
          mb={3}
        >
          Retour du client
        </Text>

        {recent.length === 0 ? (
          <Text fontSize="xs" color="fg.muted">
            Cette séance n'a pas encore été faite.
          </Text>
        ) : (
          <VStack align="stretch" gap={4}>
            {/* Ce qui est actionnable en premier : la dérive, pas le détail. */}
            <EffortTrend history={recent} />

            <VStack align="stretch" gap={3}>
              {recent.slice(0, 3).map((completed) => (
                <Box
                  key={completed._id}
                  borderLeftWidth="2px"
                  borderLeftColor="session.rest"
                  pl={3}
                >
                  <Text fontSize="xs" color="fg.muted">
                    {getRelativeDate(completed.completedAt)}
                  </Text>
                  {completed.clientNotes ? (
                    <Text fontSize="xs" color="fg" fontStyle="italic" mt={0.5}>
                      "{completed.clientNotes}"
                    </Text>
                  ) : (
                    <Text
                      fontSize="xs"
                      color="fg.muted"
                      fontStyle="italic"
                      mt={0.5}
                    >
                      Aucun commentaire
                    </Text>
                  )}
                </Box>
              ))}
            </VStack>
          </VStack>
        )}
      </Box>
    );
  }

  if (recent.length === 0) return null;
  const last = recent[0];
  const level = getEffortLevel(last.feedback?.effort);

  return (
    <Box
      bg="session.rest/10"
      borderLeftWidth="2px"
      borderLeftColor="session.rest"
      borderRadius="0 6px 6px 0"
      px={3}
      py={2}
      mb={3}
      fontSize="xs"
      color="fg.muted"
    >
      <HStack gap={2} flexWrap="wrap">
        <Text flexShrink={0}>{getRelativeDate(last.completedAt)} —</Text>
        {level && (
          <Text
            as="span"
            fontWeight="bold"
            color={EFFORT_ZONE_COLOR[level.zone]}
            flexShrink={0}
          >
            {level.label}
          </Text>
        )}
        {last.clientNotes ? (
          <Text as="span" fontStyle="italic" color="fg">
            "{last.clientNotes}"
          </Text>
        ) : (
          <Text as="span" fontStyle="italic">
            Aucun commentaire
          </Text>
        )}
      </HStack>
    </Box>
  );
};
