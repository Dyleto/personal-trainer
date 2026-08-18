import {
  Container,
  Button,
  VStack,
  Box,
  Spinner,
  Drawer,
} from '@chakra-ui/react';
import { useToastError } from '@/hooks/useToastError';
import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';
import { useExercise } from '@/features/exercise/hooks/useExercise';
import {
  useCreateExercise,
  useUpdateExercise,
  useDeleteExercise,
} from '@/features/exercise/hooks/useExerciseMutations';
import { Exercise } from '@/types';
import { ExerciseEditor } from '@/features/exercise/components/ExerciseEditor';

const ExerciseForm = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!exerciseId;

  const {
    data: exercise,
    isLoading: fetching,
    error,
  } = useExercise(exerciseId);
  const createMutation = useCreateExercise();
  const updateMutation = useUpdateExercise();
  const deleteMutation = useDeleteExercise();

  useToastError(error, "Impossible de charger l'exercice");

  const handleSave = async (data: Partial<Exercise>) => {
    if (isEditMode) {
      updateMutation.mutate(
        { id: exerciseId!, data },
        { onSuccess: () => navigate('/coach/exercises') }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => navigate('/coach/exercises'),
      });
    }
  };

  const handleDelete = async () => {
    if (!exercise) return;
    if (
      !globalThis.confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')
    )
      return;
    deleteMutation.mutate(exerciseId!, {
      onSuccess: () => navigate('/coach/exercises'),
    });
  };

  const isSavingOrDeleting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <Drawer.Root
      open={true}
      size="full"
      onOpenChange={(e) => !e.open && navigate('/coach/exercises')}
    >
      <Drawer.Positioner>
        <Drawer.Content bg="bg.canvas">
          <Drawer.Body>
            <Container maxW="container.md" py={8}>
              {fetching ? (
                <Box display="flex" justifyContent="center" py={12}>
                  <Spinner size="xl" />
                </Box>
              ) : (
                <VStack gap={6} align="stretch">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/coach/exercises')}
                    alignSelf="flex-start"
                  >
                    <LuArrowLeft />
                    Retour
                  </Button>
                  <ExerciseEditor
                    initialData={isEditMode ? exercise : undefined}
                    isEditing={isEditMode}
                    isLoading={isSavingOrDeleting}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    onCancel={() => navigate('/coach/exercises')}
                  />
                </VStack>
              )}
            </Container>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default ExerciseForm;
