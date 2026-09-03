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
  RecordPerformed,
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

  // Terminer une séance se déroule en deux temps : « tu veux noter tes
  // charges ? », puis le bilan. `idle` couvre la lecture, où l'écran ne
  // demande rien.
  const [flow, setFlow] = useState<'idle' | 'record' | 'review'>('idle');

  const [performed, setPerformed] = useState<Record<string, PerformedValues>>(
    {}
  );

  // La saisie appartient à une séance précise : passer à une autre depuis le
  // programme ne doit pas traîner les poids de la précédente dans le bilan.
  const [performedFor, setPerformedFor] = useState(activeSession?._id);
  if (activeSession?._id !== performedFor) {
    setPerformedFor(activeSession?._id);
    setPerformed({});
    setFlow('idle');
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
        {/* On revient d'où l'on vient neuf fois sur dix : l'accueil. Le
            programme reste à un onglet de distance. Un vrai bouton, pas un
            HStack cliquable : il faut pouvoir l'atteindre au clavier. */}
        <Box
          as="button"
          aria-label="Revenir à Aujourd'hui"
          w="fit-content"
          onClick={() => navigate(CLIENT_ROUTES.today)}
          color="fg.muted"
          _hover={{ color: 'app.primary' }}
          _focusVisible={{
            outline: '2px solid',
            outlineColor: 'app.primary',
            outlineOffset: '2px',
          }}
          transition="color 0.15s"
        >
          <HStack gap={1.5}>
            <LuArrowLeft size={13} />
            <Text fontSize="xs" fontWeight="medium">
              Aujourd'hui
            </Text>
          </HStack>
        </Box>
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

      {/* En lecture, une séance se lit : pas de champ vide sous chaque
          exercice avant même de l'avoir commencée. La saisie arrive à la
          fin, dans RecordPerformed — mais ce qu'on avait mis la dernière
          fois s'affiche dès maintenant, c'est là qu'on en a besoin. */}
      <SessionDetail
        session={activeSession}
        lastPerformance={lastPerformance}
      />

      <VStack
        align="stretch"
        gap={2}
        mt={5}
        position={{ base: 'fixed', md: 'static' }}
        // Ancré au bas de l'écran plutôt qu'à 70 px : la barre d'onglets ne
        // fait pas exactement 70 px — elle dépend de la zone sûre du
        // téléphone — et l'écart laissait passer un filet de page entre les
        // deux. Le fond descend maintenant derrière la barre.
        bottom={{ base: 0, md: 'auto' }}
        left={{ base: 0, md: 'auto' }}
        right={{ base: 0, md: 'auto' }}
        bg={{ base: 'bg.canvas', md: 'transparent' }}
        p={{ base: 4, md: 0 }}
        pb={{
          base: 'calc(env(safe-area-inset-bottom, 0px) + 78px)',
          md: 0,
        }}
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
          onClick={() => setFlow('record')}
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
            setFlow('record');
          }}
          lastPerformance={lastPerformance}
        />
      )}

      {/* Remonté à chaque ouverture : la question repart de zéro plutôt que
          de rouvrir sur la saisie déjà dépliée. */}
      <RecordPerformed
        key={flow === 'record' ? 'record-open' : 'record-closed'}
        session={activeSession}
        isOpen={flow === 'record'}
        performed={performed}
        onPerformedChange={handlePerformedChange}
        lastPerformance={lastPerformance}
        onCancel={() => setFlow('idle')}
        onContinue={() => setFlow('review')}
      />

      <CompleteSessionModal
        isOpen={flow === 'review'}
        onClose={() => setFlow('idle')}
        onSubmit={(feedback, notes, completedAt) => {
          handleSubmitLog(
            feedback,
            notes,
            completedAt,
            toPerformedEntries(performed)
          );
          setFlow('idle');
        }}
        isLoading={isSubmitting}
      />
    </Container>
  );
};
export default SessionScreen;
