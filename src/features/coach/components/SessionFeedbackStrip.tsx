import { Box, HStack, Text } from '@chakra-ui/react';
import { CompletedSession } from '@/types';
import { getRelativeDate } from '@/features/client';

interface SessionFeedbackStripProps {
  // Déjà filtré par la page appelante sur originalSessionId === session._id
  history: CompletedSession[];
}

// Version provisoire (avant Phase 16) : date + dernier commentaire.
// La tendance d'effort viendra remplacer ce contenu une fois feedback.effort
// disponible — volontairement pas de note ici, cf. p16.
export const SessionFeedbackStrip = ({
  history,
}: SessionFeedbackStripProps) => {
  if (history.length === 0) return null;

  const last = [...history].sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )[0];

  return (
    <Box
      bg="session.rest/10"
      borderLeftWidth="2px"
      borderLeftColor="session.rest"
      borderRadius="0 6px 6px 0"
      px={3}
      py={2}
      mb={4}
      fontSize="xs"
      color="fg.muted"
    >
      <HStack gap={2} flexWrap="wrap">
        <Text flexShrink={0}>{getRelativeDate(last.completedAt)} —</Text>
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
