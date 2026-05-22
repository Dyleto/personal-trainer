import { ExerciseSectionSkeleton } from "@/components/skeletons";
import { SlidePanel } from "@/components/SlidePanel";
import { GRID_LAYOUTS } from "@/constants/layouts";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowLeft, LuSearch, LuDumbbell, LuLibrary } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useExercises } from "@/features/exercise/hooks/useExercises";
import { useExerciseFilter } from "@/features/exercise/hooks/useExerciseFilter";
import { useToastError } from "@/hooks/useToastError";
import { CreateExerciseCard, ExerciseLibraryCard } from "@/features/exercise";

const Exercises = () => {
  const navigate = useNavigate();
  const colors = useThemeColors();

  const { data: exercises = [], isLoading, error } = useExercises();
  const [searchQuery, setSearchQuery] = useState("");

  useToastError(error, "Impossible de charger vos exercices");

  const filtered = useExerciseFilter(exercises, searchQuery);

  return (
    <SlidePanel onClose={() => navigate("/coach")}>
      {(handleClose) => (
        <Container maxW="container.xl" py={8}>
          <VStack gap={6} align="stretch">
            {/* Header */}
            <HStack justify="space-between" align="center">
              <HStack gap={4}>
                <Button variant="ghost" onClick={handleClose}>
                  <LuArrowLeft />
                  Retour
                </Button>
                <HStack gap={4}>
                  <LuLibrary size={28} color={colors.primaryHex} />
                  <Heading size="xl">Mes exercices</Heading>
                </HStack>
              </HStack>
            </HStack>

            {/* Barre de recherche */}
            <HStack
              w="100%"
              bg="gray.800"
              borderRadius="md"
              borderWidth="1px"
              borderColor="gray.700"
              px={3}
            >
              <LuSearch color="gray" />
              <Input
                placeholder="Rechercher un exercice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="lg"
                border="none"
                _focus={{ boxShadow: "none" }}
              />
            </HStack>

            {isLoading ? (
              <ExerciseSectionSkeleton titleWidth="250px" count={8} />
            ) : (
              <Box>
                <HStack gap={3} mb={4}>
                  <LuDumbbell size={24} color={colors.primaryHex} />
                  <Heading size="lg" color={colors.primary}>
                    Exercices ({filtered.length})
                  </Heading>
                </HStack>

                <Grid templateColumns={GRID_LAYOUTS.fourColumns} gap={4}>
                  <CreateExerciseCard
                    onClick={() => navigate("/coach/exercises/new")}
                  />
                  {filtered.map((exercise) => (
                    <ExerciseLibraryCard
                      key={exercise._id}
                      exercise={exercise}
                      onClick={() => navigate(`/coach/exercises/${exercise._id}`)}
                    />
                  ))}
                </Grid>
              </Box>
            )}
          </VStack>
        </Container>
      )}
    </SlidePanel>
  );
};

export default Exercises;
