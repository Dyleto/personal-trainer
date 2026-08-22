import { ClientWithDetails, Exercise } from '@/types';
import { useEffect, useState } from 'react';
import { useProgramEditor } from '@/features/program/hooks/useProgramEditor';
import { useUpdateProgramSessions } from '@/features/program/hooks/useProgramMutations';
import {
  SessionCard,
  ExerciseSelectorPanel,
  CreateSessionCard,
} from '@/features/program';
import { Box, Button, Grid, Heading, HStack, Text } from '@chakra-ui/react';
import { LuPencil, LuSave, LuX } from 'react-icons/lu';

interface SelectorState {
  isOpen: boolean;
  sessionId: string | null;
  blockId: string | null;
}

interface Props {
  client: ClientWithDetails;
  clientId: string;
}

export const ClientProgramTab = ({ client, clientId }: Props) => {
  const { program, initialize, actions } = useProgramEditor(null);
  const updateProgramMutation = useUpdateProgramSessions(clientId);
  const [isEditing, setIsEditing] = useState(false);
  const [selectorState, setSelectorState] = useState<SelectorState>({
    isOpen: false,
    sessionId: null,
    blockId: null,
  });

  useEffect(() => {
    if (client.program && !isEditing) {
      initialize(client.program);
    }
  }, [client, initialize, isEditing]);

  const handleSave = () => {
    if (!program) return;
    updateProgramMutation.mutate(program.sessions, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const handleCancel = () => {
    if (client.program) initialize(client.program);
    setIsEditing(false);
  };

  const handleOpenSelector = (sessionId: string, blockId: string) => {
    setSelectorState({ isOpen: true, sessionId, blockId });
  };

  const handleSelectExercise = (exercise: Exercise) => {
    const { sessionId, blockId } = selectorState;
    if (sessionId && blockId) {
      actions.addExercise(sessionId, blockId, exercise);
    }
    setSelectorState((prev) => ({ ...prev, isOpen: false }));
  };

  if (!program) return null;

  return (
    <>
      <Box mt={4}>
        <HStack justify="space-between" mb={6}>
          <Heading size="lg">Programme</Heading>
          {isEditing ? (
            <HStack>
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={updateProgramMutation.isPending}
              >
                <LuX /> Annuler
              </Button>
              <Button
                data-state="active"
                bg="app.primary"
                color="bg.canvas"
                onClick={handleSave}
                loading={updateProgramMutation.isPending}
              >
                <LuSave /> Enregistrer
              </Button>
            </HStack>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <LuPencil /> Modifier
            </Button>
          )}
        </HStack>

        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(auto-fill, minmax(400px, 1fr))',
          }}
          gap={8}
          alignItems="start"
        >
          {program.sessions.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              interactive={false}
              isEditing={isEditing}
              onRemoveSession={() => actions.removeSession(session._id)}
              onUpdateSessionNotes={(notes) =>
                actions.updateSessionNotes(session._id, notes)
              }
              onAddBlock={(type) => actions.addBlock(session._id, type)}
              onRemoveBlock={(blockId) =>
                actions.removeBlock(session._id, blockId)
              }
              onUpdateBlock={(blockId, updates) =>
                actions.updateBlock(session._id, blockId, updates)
              }
              onReorderBlocks={(orderedIds) =>
                actions.reorderBlocks(session._id, orderedIds)
              }

              onAddExercise={(blockId) =>
                handleOpenSelector(session._id, blockId)
              }
              onRemoveExercise={(blockId, index) =>
                actions.removeExercise(session._id, blockId, index)
              }
              onUpdateExercise={(blockId, index, updates) =>
                actions.updateExercise(session._id, blockId, index, updates)
              }
            />
          ))}

          {isEditing && <CreateSessionCard onClick={actions.addSession} />}

          {!isEditing && program.sessions.length === 0 && (
            <Box
              gridColumn="1 / -1"
              p={8}
              bg="whiteAlpha.50"
              borderRadius="lg"
              textAlign="center"
              borderWidth="1px"
              borderColor="whiteAlpha.200"
            >
              <Text color="fg.muted">
                Ce programme ne contient aucune séance pour le moment.
              </Text>
            </Box>
          )}
        </Grid>

        {isEditing && (
          <HStack justify="flex-end" mt={6} gap={3}>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={updateProgramMutation.isPending}
            >
              <LuX /> Annuler
            </Button>
            <Button
              size="sm"
              bg="app.primary"
              color="bg.canvas"
              onClick={handleSave}
              loading={updateProgramMutation.isPending}
            >
              <LuSave /> Enregistrer
            </Button>
          </HStack>
        )}
      </Box>

      {selectorState.isOpen && selectorState.blockId && (
        <ExerciseSelectorPanel
          isOpen={selectorState.isOpen}
          onClose={() =>
            setSelectorState((prev) => ({ ...prev, isOpen: false }))
          }
          onSelect={handleSelectExercise}
        />
      )}
    </>
  );
};
