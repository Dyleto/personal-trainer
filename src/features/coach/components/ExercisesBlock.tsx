import ClickableCard from "@/components/ClickableCard";
import { useExerciseStats } from "@/features/coach/hooks/useExerciseStats";
import { useExercises } from "@/features/exercise/hooks/useExercises";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useToastError } from "@/hooks/useToastError";
import { Box, HStack, Skeleton, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { LuArrowRight, LuLibrary } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export const ExercisesBlock = () => {
  const navigate = useNavigate();
  const colors = useThemeColors();

  const { data: { count = 0 } = {}, isLoading: statsLoading, error } = useExerciseStats();
  const { data: exercises = [], isLoading: exercisesLoading } = useExercises();

  useToastError(error, "Impossible de charger le nombre d'exercices");

  const recentExercises = useMemo(
    () =>
      [...exercises]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [exercises]
  );

  const isLoading = statsLoading || exercisesLoading;

  if (isLoading) {
    return (
      <ClickableCard onClick={() => {}} color={colors.primary} minW="50%">
        <VStack gap={4} align="stretch">
          <HStack justify="space-between">
            <Skeleton height="20px" width="55%" />
            <Skeleton height="18px" width="18px" />
          </HStack>
          <Skeleton height="44px" width="30%" />
          <HStack gap={2} flexWrap="wrap">
            <Skeleton height="24px" width="90px" borderRadius="full" />
            <Skeleton height="24px" width="70px" borderRadius="full" />
            <Skeleton height="24px" width="80px" borderRadius="full" />
          </HStack>
        </VStack>
      </ClickableCard>
    );
  }

  return (
    <ClickableCard
      onClick={() => navigate("/coach/exercises")}
      color={colors.primary}
      minW="50%"
    >
      <VStack gap={4} align="stretch">
        {/* Titre + flèche */}
        <HStack justify="space-between" align="center">
          <HStack gap={3}>
            <Box
              p={2}
              bg={colors.primaryBg}
              borderRadius="md"
              borderWidth="1px"
              borderColor={colors.primaryBorder}
            >
              <LuLibrary size={18} color={colors.primaryHex} />
            </Box>
            <Box fontWeight="semibold" fontSize="md" color="white">
              Mes exercices
            </Box>
          </HStack>
          <Box color={colors.primary}>
            <LuArrowRight size={18} />
          </Box>
        </HStack>

        {/* Compteur hero */}
        <HStack gap={2} align="baseline">
          <Box fontSize="4xl" fontWeight="bold" color="white" lineHeight={1}>
            {count}
          </Box>
          <Box fontSize="sm" color="gray.500">
            exercice{count !== 1 ? "s" : ""}
          </Box>
        </HStack>

        {/* Chips des exercices récents */}
        {recentExercises.length > 0 && (
          <HStack gap={2} flexWrap="wrap">
            {recentExercises.map((ex, index) => (
              <Box
                key={ex._id}
                display={{ base: index < 2 ? "block" : "none", md: "block" }}
                px={3}
                py={1}
                bg={colors.primaryBg}
                borderRadius="full"
                borderWidth="1px"
                borderColor={colors.primaryBorder}
                fontSize="xs"
                fontWeight="medium"
                color="white"
                maxW="150px"
                truncate
              >
                {ex.name}
              </Box>
            ))}
            {/* +N mobile : tout ce qui dépasse 2 */}
            {count > 2 && (
              <Box
                display={{ base: "block", md: "none" }}
                px={3}
                py={1}
                bg="gray.700"
                borderRadius="full"
                fontSize="xs"
                fontWeight="medium"
                color="gray.400"
              >
                +{count - 2}
              </Box>
            )}
            {/* +N desktop : tout ce qui dépasse 5 */}
            {count > 5 && (
              <Box
                display={{ base: "none", md: "block" }}
                px={3}
                py={1}
                bg="gray.700"
                borderRadius="full"
                fontSize="xs"
                fontWeight="medium"
                color="gray.400"
              >
                +{count - 5}
              </Box>
            )}
          </HStack>
        )}
      </VStack>
    </ClickableCard>
  );
};
