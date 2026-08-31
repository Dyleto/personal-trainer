import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { CompletedSession } from '@/types';
import { getRelativeDate } from '@/features/client';

interface SessionFeedbackStripProps {
  // Déjà filtré par la page appelante sur originalSessionId === session._id
  history: CompletedSession[];
  // 'strip' : bandeau au-dessus de la séance (écrans étroits)
  // 'panel' : colonne de contexte à droite (à partir de 2xl)
  variant?: 'strip' | 'panel';
}

// Version provisoire (avant Phase 16) : date + commentaire.
// La tendance d'effort viendra s'ajouter ici une fois feedback.effort
// disponible — volontairement pas de note, cf. p16.
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
          fontSize="2xs"
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
          <VStack align="stretch" gap={3}>
            {recent.slice(0, 3).map((completed) => (
              <Box
                key={completed._id}
                borderLeftWidth="2px"
                borderLeftColor="session.rest"
                pl={3}
              >
                <Text fontSize="2xs" color="fg.muted">
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
        )}
      </Box>
    );
  }

  if (recent.length === 0) return null;
  const last = recent[0];

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
