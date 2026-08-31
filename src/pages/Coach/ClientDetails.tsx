import { useEffect, useState } from 'react';
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
import { LuArrowLeft, LuSave, LuX } from 'react-icons/lu';
import { useClientDetails } from '@/features/coach/hooks/useClientDetails';
import { useClientHistory } from '@/features/coach/hooks/useClientHistory';
import { useProgramEditor } from '@/features/program/hooks/useProgramEditor';
import { useUpdateProgramSessions } from '@/features/program/hooks/useProgramMutations';
import { ClientProgramTab } from '@/features/coach/components/ClientProgramTab';
import { SessionRail } from '@/features/coach/components/SessionRail';
import { SessionFeedbackStrip } from '@/features/coach/components/SessionFeedbackStrip';
import { COACH_ROUTES } from '@/config/routes';

const ClientDetails = () => {
  const { clientId, sessionIndex } = useParams();
  const navigate = useNavigate();

  const { data: client, isLoading } = useClientDetails(clientId!);
  const { data: history = [] } = useClientHistory(clientId!);
  const { program, initialize, actions } = useProgramEditor(null);
  const updateProgramMutation = useUpdateProgramSessions(clientId!);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  useEffect(() => {
    if (client?.program) initialize(client.program);
  }, [client, initialize]);

  // À partir de 2xl (1536px), le retour du client passe en colonne de droite
  // plutôt qu'en bandeau : c'est ce qui occupe la largeur d'un 1920.
  const isWide = useBreakpointValue({ base: false, '2xl': true });

  const currentIndex = Math.max(0, (Number(sessionIndex) || 1) - 1);
  const activeSession = program?.sessions[currentIndex] ?? null;

  const isDirty =
    !!program &&
    !!client &&
    JSON.stringify(program.sessions) !==
      JSON.stringify(client.program.sessions);

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

  return (
    <Box w="100%" px={{ base: 4, md: 8 }} py={6}>
      <VStack align="stretch" gap={1} mb={5}>
        <HStack
          gap={1.5}
          color="fg.muted"
          cursor="pointer"
          onClick={() => navigate(COACH_ROUTES.clients)}
          _hover={{ color: 'app.primary' }}
          transition="color 0.15s"
          w="fit-content"
        >
          <LuArrowLeft size={13} />
          <Text fontSize="xs" fontWeight="medium">
            Clients
          </Text>
        </HStack>
        <HStack gap={3} align="center">
          <Avatar.Root size="md">
            <Avatar.Fallback name={`${client.firstName} ${client.lastName}`} />
            <Avatar.Image src={client.picture} />
          </Avatar.Root>
          <VStack align="start" gap={0} flex={1} minW={0}>
            <Heading size="lg">
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
                <Heading size="md">Séance {activeSession.order}</Heading>
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
                onRemoveSession={handleRemoveActiveSession}
                onUpdateSessionNotes={(notes) =>
                  actions.updateSessionNotes(activeSession._id, notes)
                }
                onAddBlock={(type) => actions.addBlock(activeSession._id, type)}
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
        <HStack
          justify="flex-end"
          gap={3}
          position="sticky"
          bottom={0}
          bg="bg.canvas"
          py={4}
          mt={6}
          borderTop="1px solid"
          borderColor="whiteAlpha.100"
        >
          <Text fontSize="sm" color="fg.muted" mr="auto">
            Modifications non enregistrées
          </Text>
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
            <Dialog.Footer gap={3}>
              <Button
                bg="app.primary"
                color="bg.canvas"
                fontWeight="bold"
                onClick={confirmDiscard}
              >
                Annuler les modifications
              </Button>
              <Button
                variant="ghost"
                color="fg.muted"
                onClick={() => setIsCancelConfirmOpen(false)}
              >
                Continuer l'édition
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
};

export default ClientDetails;
