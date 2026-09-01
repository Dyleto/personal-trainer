import { useOutletContext, useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Container,
  HStack,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';
import {
  CLIENT_CONTENT_MAX_W,
  CompleteSessionModal,
  GuidedSession,
  SessionDetail,
  getSessionSummary,
  useClientSessions,
} from '@/features/client';
import { PerformedEntry, PerformedValues } from '@/types';
import { CLIENT_ROUTES } from '@/config/routes';

// Le réalisé se saisit exercice par exercice pendant la séance, puis part en
// une fois avec le bilan. La clé est « ordre du bloc : ordre de l'exercice »,
// exactement l'adressage attendu par l'API.
const toPerformedEntries = (
  performed: Record<string, PerformedValues>
): PerformedEntry[] =>
  Object.entries(performed)
    .filter(([, v]) => v.weight !== undefined || v.reps !== undefined)
    .map(([key, v]) => {
      const [blockOrder, exerciseOrder] = key.split(':').map(Number);
      return { blockOrder, exerciseOrder, ...v };
    });

type ClientSessionsData = ReturnType<typeof useClientSessions>;

const SessionScreen = () => {
  const navigate = useNavigate();
  const {
    sessions,
    activeSession,
    isManualSelection,
    handleSubmitLog,
    isLoading,
    isSubmitting,
    lastPerformance,
  } = useOutletContext<ClientSessionsData>();
  const [isGuidedOpen, setIsGuidedOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const [performed, setPerformed] = useState<Record<string, PerformedValues>>(
    {}
  );

  // La saisie appartient à une séance précise : passer à une autre depuis le
  // programme ne doit pas traîner les poids de la précédente dans le bilan.
  const [performedFor, setPerformedFor] = useState(activeSession?._id);
  if (activeSession?._id !== performedFor) {
    setPerformedFor(activeSession?._id);
    setPerformed({});
  }

  const handlePerformedChange = useCallback(
    (key: string, next: PerformedValues) =>
      setPerformed((prev) => ({ ...prev, [key]: next })),
    []
  );

  if (isLoading) {
    return (
      <Container maxW={CLIENT_CONTENT_MAX_W} py={8} px={4}>
        <VStack align="stretch" gap={4}>
          <Skeleton h="20px" w="120px" borderRadius="md" />
          <Skeleton h="80px" borderRadius="lg" />
          <Skeleton h="200px" borderRadius="lg" />
        </VStack>
      </Container>
    );
  }

  if (sessions.length === 0) {
    return (
      <Container maxW={CLIENT_CONTENT_MAX_W} py={8} px={4}>
        <Box
          p={8}
          textAlign="center"
          bg="whiteAlpha.50"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="whiteAlpha.100"
        >
          <Text fontSize="lg" fontWeight="bold" mb={1}>
            Pas encore de programme
          </Text>
          <Text color="fg.muted" fontSize="sm">
            Ton coach n'a pas encore ajouté de séances. Reviens bientôt.
          </Text>
        </Box>
      </Container>
    );
  }

  if (!activeSession) {
    return (
      <Container maxW={CLIENT_CONTENT_MAX_W} py={8} px={4}>
        <Box
          p={8}
          textAlign="center"
          bg="whiteAlpha.50"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="whiteAlpha.100"
        >
          <Text fontSize="lg" fontWeight="bold" mb={1}>
            Séance introuvable
          </Text>
          <Text color="fg.muted" fontSize="sm" mb={4}>
            Cette séance n'existe plus dans ton programme.
          </Text>
          <Button
            variant="outline"
            borderColor="whiteAlpha.200"
            onClick={() => navigate(CLIENT_ROUTES.program)}
          >
            Voir le programme
          </Button>
        </Box>
      </Container>
    );
  }

  const pillLabel = isManualSelection ? 'Séance choisie' : 'À faire';
  const pillColor = isManualSelection ? 'app.primary' : 'session.work';
  const pillTextColor = isManualSelection ? 'app.primary' : 'session.work.fg';
  const hasExercises = activeSession.blocks.some((b) => b.exercises.length > 0);
  const summary =
    activeSession.blocks.length === 0
      ? 'Aucun bloc'
      : getSessionSummary(activeSession);

  return (
    <Container
      maxW={CLIENT_CONTENT_MAX_W}
      py={8}
      px={4}
      pb={{ base: '220px', md: 8 }}
    >
      <VStack align="stretch" gap={1} mb={4}>
        <HStack
          gap={1.5}
          color="fg.muted"
          cursor="pointer"
          onClick={() => navigate(CLIENT_ROUTES.program)}
          _hover={{ color: 'app.primary' }}
          transition="color 0.15s"
          w="fit-content"
        >
          <LuArrowLeft size={13} />
          <Text fontSize="xs" fontWeight="medium">
            Programme
          </Text>
        </HStack>
        <HStack justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold">
            Séance {activeSession.order}
          </Text>
          <Box
            px={2}
            py={0.5}
            borderRadius="full"
            bg={`${pillColor}/16`}
            fontSize="2xs"
            fontWeight="bold"
            color={pillTextColor}
            textTransform="uppercase"
            letterSpacing="wider"
          >
            {pillLabel}
          </Box>
        </HStack>
        <Text fontSize="xs" color="fg.muted">
          {summary}
        </Text>
      </VStack>

      <SessionDetail
        session={activeSession}
        performed={performed}
        onPerformedChange={handlePerformedChange}
        lastPerformance={lastPerformance}
      />

      <VStack
        align="stretch"
        gap={2}
        mt={5}
        position={{ base: 'fixed', md: 'static' }}
        bottom={{ base: '70px', md: 'auto' }}
        left={{ base: 0, md: 'auto' }}
        right={{ base: 0, md: 'auto' }}
        bg={{ base: 'bg.canvas', md: 'transparent' }}
        p={{ base: 4, md: 0 }}
        borderTop={{ base: '1px solid', md: 'none' }}
        borderColor="whiteAlpha.100"
        zIndex={20}
      >
        {hasExercises && (
          <Button
            w="full"
            bg="app.primary"
            color="bg.canvas"
            fontWeight="bold"
            size="lg"
            onClick={() => setIsGuidedOpen(true)}
            _hover={{ bg: 'app.primary.hover' }}
          >
            Démarrer la séance
          </Button>
        )}
        <Button
          w="full"
          variant="outline"
          borderColor="whiteAlpha.200"
          color="fg"
          size="lg"
          onClick={() => setIsCompleteModalOpen(true)}
          _hover={{ bg: 'whiteAlpha.50' }}
        >
          J'ai terminé cette séance
        </Button>
      </VStack>

      {isGuidedOpen && (
        <GuidedSession
          session={activeSession}
          onExit={() => setIsGuidedOpen(false)}
          onFinish={() => {
            setIsGuidedOpen(false);
            setIsCompleteModalOpen(true);
          }}
          lastPerformance={lastPerformance}
        />
      )}

      <CompleteSessionModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onSubmit={(feedback, notes, completedAt) => {
          handleSubmitLog(
            feedback,
            notes,
            completedAt,
            toPerformedEntries(performed)
          );
          setIsCompleteModalOpen(false);
        }}
        isLoading={isSubmitting}
      />
    </Container>
  );
};
export default SessionScreen;
