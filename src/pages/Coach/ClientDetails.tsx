import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import {
  LuArrowLeft,
  LuBookOpen,
  LuChevronRight,
  LuSave,
  LuX,
} from 'react-icons/lu';
import { useClientDetails } from '@/features/coach/hooks/useClientDetails';
import { useClientHistory } from '@/features/coach/hooks/useClientHistory';
import { useProgramEditor } from '@/features/program/hooks/useProgramEditor';
import { useUpdateProgramSessions } from '@/features/program/hooks/useProgramMutations';
import { ClientProgramTab } from '@/features/coach/components/ClientProgramTab';
import { SessionRail } from '@/features/coach/components/SessionRail';
import { SessionFeedbackStrip } from '@/features/coach/components/SessionFeedbackStrip';
import { diffProgram, summarizeChanges } from '@/features/program/diffProgram';
import { BackLink } from '@/components/BackLink';
import { Header } from '@/components/Header';
import { hitArea } from '@/components/hitArea';
import { COACH_ROUTES } from '@/config/routes';
import { Exercise } from '@/types';

const ClientDetails = () => {
  const { clientId, sessionIndex } = useParams();
  const navigate = useNavigate();

  const { data: client, isLoading } = useClientDetails(clientId!);
  const { data: history = [] } = useClientHistory(clientId!);
  const { program, initialize, actions } = useProgramEditor(null);
  const updateProgramMutation = useUpdateProgramSessions(clientId!);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isChangeListOpen, setIsChangeListOpen] = useState(false);

  useEffect(() => {
    if (client?.program) initialize(client.program);
  }, [client, initialize]);

  // À partir de 2xl (1536px), le retour du client passe en colonne de droite
  // plutôt qu'en bandeau : c'est ce qui occupe la largeur d'un 1920.
  const isWide = useBreakpointValue({ base: false, '2xl': true });

  const currentIndex = Math.max(0, (Number(sessionIndex) || 1) - 1);
  const activeSession = program?.sessions[currentIndex] ?? null;

  // Le programme entier est en mémoire : « déjà dans ce programme » et
  // « jamais faite » se calculent sans une seule requête de plus.
  const inProgram = useMemo<Exercise[]>(() => {
    const byId = new Map<string, Exercise>();
    program?.sessions.forEach((s) =>
      s.blocks.forEach((b) =>
        b.exercises.forEach((ex) => byId.set(ex.exercise._id, ex.exercise))
      )
    );
    return [...byId.values()].sort((a, b) =>
      a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
    );
  }, [program]);

  const neverDoneIds = useMemo(() => {
    const done = new Set(history.map((h) => h.originalSessionId));
    return new Set(
      (program?.sessions ?? [])
        .filter((s) => !done.has(s._id))
        .map((s) => s._id)
    );
  }, [program, history]);

  const isDirty =
    !!program &&
    !!client &&
    JSON.stringify(program.sessions) !==
      JSON.stringify(client.program.sessions);

  // Ce qui a changé, en clair. La comparaison JSON reste l'autorité sur
  // « peut-on enregistrer » ; ceci ne sert qu'à le raconter.
  const changes = useMemo(
    () =>
      isDirty && program && client
        ? diffProgram(client.program.sessions, program.sessions)
        : [],
    [isDirty, program, client]
  );
  const changeSummary =
    summarizeChanges(changes) || 'Modifications non enregistrées';

  const handleSave = () => {
    if (!program) return;
    updateProgramMutation.mutate(program.sessions);
  };

  const confirmDiscard = () => {
    if (client?.program) initialize(client.program);
    setIsCancelConfirmOpen(false);
  };

  const handleSelectSession = (index: number) => {
    navigate(COACH_ROUTES.clientSession(clientId!, index + 1));
  };

  const handleAddSession = () => {
    actions.addSession();
    navigate(
      COACH_ROUTES.clientSession(clientId!, (program?.sessions.length ?? 0) + 1)
    );
  };

  const handleRemoveActiveSession = () => {
    if (!activeSession) return;
    actions.removeSession(activeSession._id);
    navigate(COACH_ROUTES.clientSession(clientId!, 1));
  };

  const handleDuplicateActiveSession = () => {
    if (!activeSession) return;
    actions.duplicateSession(activeSession._id);
    // La copie est insérée juste après l'originale : on l'ouvre aussitôt,
    // c'est elle qu'on vient créer pour l'ajuster.
    navigate(COACH_ROUTES.clientSession(clientId!, currentIndex + 2));
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="60vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!client || !program) return null;

  const sessionCount = program.sessions.length;
  const sessionHistory = activeSession
    ? history.filter((h) => h.originalSessionId === activeSession._id)
    : [];

  const clientName = `${client.firstName} ${client.lastName}`;

  return (
    <>
      {/* Mobile : une seule barre. Elle remplace le bandeau générique du
          layout (voir le `handle` de la route) et absorbe l'en-tête de page —
          le nom du client à gauche, son journal et le compte à droite. */}
      <Box
        as="header"
        display={{ base: 'block', md: 'none' }}
        position="sticky"
        top={0}
        zIndex={3}
        bg="bg.canvas"
        borderBottomWidth="1px"
        borderColor="whiteAlpha.100"
      >
        <HStack gap={1} align="center" px={2} py={1}>
          <Box
            as="button"
            aria-label="Retour à la liste des clients"
            onClick={() => navigate(COACH_ROUTES.clients)}
            color="fg.muted"
            flexShrink={0}
            p={2}
            css={hitArea(44)}
          >
            <LuArrowLeft size={18} />
          </Box>
          <Heading as="h1" size="sm" flex={1} minW={0} lineClamp={1}>
            {clientName}
          </Heading>
          <Box
            as="button"
            aria-label={
              client.unseenCount > 0
                ? `Journal complet — ${client.unseenCount} séance${client.unseenCount > 1 ? 's' : ''} non vue${client.unseenCount > 1 ? 's' : ''}`
                : 'Journal complet'
            }
            onClick={() => navigate(COACH_ROUTES.clientJournal(clientId!))}
            color="fg.muted"
            flexShrink={0}
            p={2}
            position="relative"
            css={hitArea(44)}
          >
            <LuBookOpen size={18} />
            {client.unseenCount > 0 && (
              <Box
                position="absolute"
                top="4px"
                right="4px"
                w="7px"
                h="7px"
                borderRadius="full"
                bg="app.primary"
              />
            )}
          </Box>
          <Header />
        </HStack>
      </Box>

      <Box w="100%" px={{ base: 4, md: 8 }} py={{ base: 4, md: 6 }}>
        <VStack
          align="stretch"
          gap={1}
          mb={5}
          display={{ base: 'none', md: 'flex' }}
        >
          <BackLink
            label="Clients"
            onClick={() => navigate(COACH_ROUTES.clients)}
          />
          <HStack gap={3} align="center">
            <Avatar.Root size="md">
              <Avatar.Fallback
                name={`${client.firstName} ${client.lastName}`}
              />
              <Avatar.Image src={client.picture} />
            </Avatar.Root>
            <VStack align="start" gap={0} flex={1} minW={0}>
              {/* Le h1 de cet écran est celui de la barre mobile : une seule
                  des deux en-têtes est affichée à la fois, mais toutes deux
                  étaient balisées h1. */}
              <Heading as="p" size="lg" fontWeight="bold">
                {client.firstName} {client.lastName}
              </Heading>
              <Text fontSize="sm" color="fg.muted">
                {sessionCount} séance{sessionCount > 1 ? 's' : ''}
                {client.unseenCount > 0 &&
                  ` · ${client.unseenCount} non vue${client.unseenCount > 1 ? 's' : ''}`}
              </Text>
            </VStack>
            <Button
              size="sm"
              variant="outline"
              flexShrink={0}
              onClick={() => navigate(COACH_ROUTES.clientJournal(clientId!))}
            >
              Journal complet
            </Button>
          </HStack>
        </VStack>

        <Stack
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'stretch', md: 'flex-start' }}
          gap={{ base: 4, md: 6 }}
        >
          <SessionRail
            sessions={program.sessions}
            activeIndex={currentIndex}
            onSelect={handleSelectSession}
            onAddSession={handleAddSession}
            onReorder={actions.reorderSessions}
            neverDoneIds={neverDoneIds}
          />

          <Box
            flex="1 1 auto"
            minW={0}
            maxW={{ base: 'none', md: '980px' }}
            pb={isDirty ? '90px' : 0}
          >
            {activeSession ? (
              <>
                <HStack justify="space-between" align="baseline" mb={3}>
                  <Heading as="h2" size="md">
                    Séance {activeSession.order}
                  </Heading>
                  {sessionHistory.length > 0 && (
                    <Text fontSize="xs" color="fg.muted" flexShrink={0}>
                      faite {sessionHistory.length} fois
                    </Text>
                  )}
                </HStack>

                {!isWide && <SessionFeedbackStrip history={sessionHistory} />}

                <ClientProgramTab
                  key={activeSession._id}
                  session={activeSession}
                  inProgram={inProgram}
                  onRemoveSession={handleRemoveActiveSession}
                  onDuplicateSession={handleDuplicateActiveSession}
                  onUpdateSessionNotes={(notes) =>
                    actions.updateSessionNotes(activeSession._id, notes)
                  }
                  onAddBlock={(type) =>
                    actions.addBlock(activeSession._id, type)
                  }
                  onRemoveBlock={(blockId) =>
                    actions.removeBlock(activeSession._id, blockId)
                  }
                  onUpdateBlock={(blockId, updates) =>
                    actions.updateBlock(activeSession._id, blockId, updates)
                  }
                  onReorderBlocks={(orderedIds) =>
                    actions.reorderBlocks(activeSession._id, orderedIds)
                  }
                  onAddExercise={(blockId, exercise) =>
                    actions.addExercise(activeSession._id, blockId, exercise)
                  }
                  onRemoveExercise={(blockId, index) =>
                    actions.removeExercise(activeSession._id, blockId, index)
                  }
                  onUpdateExercise={(blockId, index, updates) =>
                    actions.updateExercise(
                      activeSession._id,
                      blockId,
                      index,
                      updates
                    )
                  }
                />
              </>
            ) : (
              <Box
                p={8}
                textAlign="center"
                bg="whiteAlpha.50"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="whiteAlpha.100"
              >
                <Text color="fg.muted" fontSize="sm">
                  Ce programme ne contient aucune séance pour le moment.
                </Text>
              </Box>
            )}
          </Box>

          {isWide && activeSession && (
            <Box w="320px" flexShrink={0}>
              <SessionFeedbackStrip history={sessionHistory} variant="panel" />
            </Box>
          )}
        </Stack>

        {isDirty && (
          <Box
            position="sticky"
            bottom={0}
            bg="bg.canvas"
            mt={6}
            borderTop="1px solid"
            borderColor="whiteAlpha.100"
          >
            {/* Le détail est replié par défaut : la barre annonce combien, elle
              n'impose pas la liste. On l'ouvre quand on ne se rappelle plus. */}
            {isChangeListOpen && changes.length > 0 && (
              <VStack
                align="stretch"
                gap={0}
                maxH="180px"
                overflowY="auto"
                pt={3}
              >
                {changes.map((change, index) => (
                  <HStack
                    key={`${change.sessionOrder}-${change.label}-${index}`}
                    gap={2}
                    py={0.5}
                    align="baseline"
                  >
                    <Text
                      as="span"
                      fontSize="xs"
                      fontFamily="mono"
                      color="app.primary"
                      flexShrink={0}
                      w="24px"
                    >
                      {change.sessionOrder > 0
                        ? `S${change.sessionOrder}`
                        : '—'}
                    </Text>
                    <Text as="span" fontSize="xs" color="fg.muted">
                      {change.label}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            )}

            <HStack justify="flex-end" gap={3} py={4}>
              {changes.length > 0 ? (
                <Box
                  as="button"
                  mr="auto"
                  minW={0}
                  textAlign="left"
                  aria-expanded={isChangeListOpen}
                  aria-label={`${changeSummary} — voir le détail`}
                  onClick={() => setIsChangeListOpen((open) => !open)}
                  _focusVisible={{
                    outline: '2px solid',
                    outlineColor: 'app.primary',
                    outlineOffset: '2px',
                  }}
                >
                  <HStack gap={1.5} color="fg.muted" _hover={{ color: 'fg' }}>
                    <Box
                      display="flex"
                      transform={isChangeListOpen ? 'rotate(90deg)' : 'none'}
                      transition="transform 0.15s"
                    >
                      <LuChevronRight size={13} />
                    </Box>
                    <Text as="span" fontSize="sm">
                      {changeSummary}
                    </Text>
                  </HStack>
                </Box>
              ) : (
                <Text fontSize="sm" color="fg.muted" mr="auto">
                  {changeSummary}
                </Text>
              )}
              <Button
                variant="ghost"
                onClick={() => setIsCancelConfirmOpen(true)}
                disabled={updateProgramMutation.isPending}
              >
                <LuX /> Annuler
              </Button>
              <Button
                bg="app.primary"
                color="bg.canvas"
                onClick={handleSave}
                loading={updateProgramMutation.isPending}
              >
                <LuSave /> Enregistrer
              </Button>
            </HStack>
          </Box>
        )}

        <Dialog.Root
          open={isCancelConfirmOpen}
          onOpenChange={(e) => !e.open && setIsCancelConfirmOpen(false)}
        >
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content
              bg="bg.canvas"
              borderColor="whiteAlpha.100"
              borderWidth="1px"
              maxW="sm"
            >
              <Dialog.Header>
                <Dialog.Title>Annuler les modifications ?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text color="fg.muted" fontSize="sm">
                  Les changements apportés à ce programme ne seront pas
                  enregistrés.
                </Text>
              </Dialog.Body>
              <Dialog.Footer gap={2} flexWrap="wrap">
                <Button
                  variant="ghost"
                  color="fg.muted"
                  onClick={() => setIsCancelConfirmOpen(false)}
                >
                  Continuer
                </Button>
                <Button
                  bg="app.error"
                  color="bg.canvas"
                  fontWeight="bold"
                  onClick={confirmDiscard}
                >
                  Abandonner
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      </Box>
    </>
  );
};

export default ClientDetails;
