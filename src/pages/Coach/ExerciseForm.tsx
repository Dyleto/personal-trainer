import {
  Container,
  Button,
  VStack,
  Box,
  Spinner,
  Dialog,
  Text,
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
import { useState } from 'react';

const ExerciseForm = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!exerciseId;
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

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

  // Le dernier avertissement natif du produit disparaît ici : tout le reste
  // passe déjà par le Dialog du design system.
  const confirmDelete = () => {
    setIsDeleteConfirmOpen(false);
    deleteMutation.mutate(exerciseId!, {
      onSuccess: () => navigate('/coach/exercises'),
    });
  };

  const isSavingOrDeleting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
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
            usageCount={exercise?.usageCount}
            onDelete={() => setIsDeleteConfirmOpen(true)}
            onCancel={() => navigate('/coach/exercises')}
          />
        </VStack>
      )}
      <Dialog.Root
        open={isDeleteConfirmOpen}
        onOpenChange={(e) => !e.open && setIsDeleteConfirmOpen(false)}
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
              <Dialog.Title>Supprimer cet exercice ?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text color="fg.muted" fontSize="sm">
                « {exercise?.name} » sera retiré de votre bibliothèque. Cette
                action est définitive.
              </Text>
            </Dialog.Body>
            <Dialog.Footer gap={3}>
              <Button
                variant="ghost"
                color="fg.muted"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Annuler
              </Button>
              <Button
                colorPalette="red"
                fontWeight="bold"
                onClick={confirmDelete}
                loading={deleteMutation.isPending}
              >
                Supprimer
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Container>
  );
};

export default ExerciseForm;
