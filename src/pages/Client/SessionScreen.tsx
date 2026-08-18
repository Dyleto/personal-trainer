import { useOutletContext, useNavigate } from 'react-router-dom';
import { useState } from 'react';
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

type ClientSessionsData = ReturnType<typeof useClientSessions>;

const SessionScreen = () => {
  const navigate = useNavigate();
  const {
    activeSession,
    isManualSelection,
    handleSubmitLog,
    isLoading,
    isSubmitting,
  } = useOutletContext<ClientSessionsData>();
  const [isGuidedOpen, setIsGuidedOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

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
            Programme terminé 🎉
          </Text>
          <Text color="fg.muted" fontSize="sm">
            Toutes les séances sont complétées. Ton coach prépare la suite.
          </Text>
        </Box>
      </Container>
    );
  }

  const pillLabel = isManualSelection ? 'Séance choisie' : 'À faire';
  const pillColor = isManualSelection ? 'app.primary' : 'session.work';
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
          onClick={() => navigate('/client/programme')}
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
            color={pillColor}
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

      <SessionDetail session={activeSession} />

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
        />
      )}

      <CompleteSessionModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onSubmit={(metrics, notes, completedAt) => {
          handleSubmitLog(metrics, notes, completedAt);
          setIsCompleteModalOpen(false);
        }}
        isLoading={isSubmitting}
      />
    </Container>
  );
};
export default SessionScreen;
