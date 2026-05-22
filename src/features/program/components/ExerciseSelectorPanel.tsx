import {
  Drawer,
  Input,
  VStack,
  Box,
  HStack,
  Button,
  Spinner,
  Grid,
} from "@chakra-ui/react";
import { useExercises } from "@/features/exercise/hooks/useExercises";
import { useExerciseFilter } from "@/features/exercise/hooks/useExerciseFilter";
import { useState } from "react";
import { LuSearch, LuX } from "react-icons/lu";
import { Exercise } from "@/types";
import {
  CreateExerciseCard,
  ExerciseEditor,
  ExerciseLibraryCard,
} from "@/features/exercise";
import { useCreateExercise } from "@/features/exercise/hooks/useExerciseMutations";

interface ExerciseSelectorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
}

export const ExerciseSelectorPanel = ({
  isOpen,
  onClose,
  onSelect,
}: ExerciseSelectorPanelProps) => {
  const { data: exercises = [], isLoading } = useExercises();
  const [searchQuery, setSearchQuery] = useState("");
  const [onCreateMode, setOnCreateMode] = useState(false);

  const createMutation = useCreateExercise();
  const filteredExercises = useExerciseFilter(exercises, searchQuery);

  const handleSave = (exercise: Partial<Exercise>) => {
    createMutation.mutate(exercise, {
      onSuccess: (response) => {
        onSelect(response.data);
        setOnCreateMode(false);
      },
    });
  };

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      size={{ base: "full", md: "md", lg: "lg", xl: "xl" }}
      modal={false}
      preventScroll={false}
    >
      <Drawer.Positioner pointerEvents="none">
        <Drawer.Content bg="gray.900">
          <Drawer.Header borderBottomWidth="1px" borderColor="whiteAlpha.100">
            <HStack justify="space-between">
              <Drawer.Title>
                {onCreateMode ? "Créer un exercice" : "Ajouter un exercice"}
              </Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <Button size="sm" variant="ghost" onClick={onClose}>
                  <LuX />
                </Button>
              </Drawer.CloseTrigger>
            </HStack>
          </Drawer.Header>
          <Drawer.Body p={4}>
            {onCreateMode ? (
              <ExerciseEditor
                onSave={handleSave}
                onCancel={() => setOnCreateMode(false)}
              />
            ) : (
              <VStack gap={4} align="stretch" h="full">
                <Box position="relative">
                  <Input
                    placeholder="Rechercher un exercice..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    pl={10}
                    bg="whiteAlpha.50"
                    border="none"
                  />
                  <Box
                    position="absolute"
                    left={3}
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.400"
                  >
                    <LuSearch />
                  </Box>
                </Box>

                {isLoading ? (
                  <Box textAlign="center" py={10}>
                    <Spinner />
                  </Box>
                ) : (
                  <Grid
                    templateColumns={{ base: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                    gap={4}
                  >
                    <CreateExerciseCard onClick={() => setOnCreateMode(true)} />
                    {filteredExercises.map((exercise) => (
                      <ExerciseLibraryCard
                        key={exercise._id}
                        exercise={exercise}
                        onClick={() => onSelect(exercise)}
                      />
                    ))}
                  </Grid>
                )}
              </VStack>
            )}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
