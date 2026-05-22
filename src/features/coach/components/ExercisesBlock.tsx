import ClickableCard from "@/components/ClickableCard";
import { useExerciseStats } from "@/features/coach/hooks/useExerciseStats";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useToastError } from "@/hooks/useToastError";
import {
  Box,
  Heading,
  HStack,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { LuDumbbell, LuArrowRight, LuLibrary } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export const ExercisesBlock = () => {
  const navigate = useNavigate();
  const colors = useThemeColors();

  const { data: { count = 0 } = {}, isLoading, error } = useExerciseStats();

  useToastError(error, "Impossible de charger le nombre d'exercices");

  if (isLoading) {
    return (
      <ClickableCard onClick={() => {}} color={colors.primary} minW="50%">
        <VStack gap={4} align="stretch">
          <HStack justify="space-between" align="start" gap={8}>
            <VStack align="start" gap={2} flex={1}>
              <Skeleton height="32px" width="70%" />
              <Skeleton height="20px" width="50%" />
            </VStack>
          </HStack>
          <Skeleton height="40px" width="80px" />
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
        <HStack justify="space-between" align="start" gap={8}>
          <VStack align="start" gap={2}>
            <HStack gap={4}>
              <LuLibrary size={28} color={colors.primaryHex} />
              <Heading size="xl">Mes exercices</Heading>
            </HStack>
            <Box fontSize="md" color="gray.400">
              Gérez votre bibliothèque d'exercices
            </Box>
          </VStack>
          <Box color={colors.primary} fontSize="2xl" flexShrink={0}>
            <LuArrowRight />
          </Box>
        </HStack>

        <HStack gap={2} mt={2}>
          <Box
            p={2}
            bg={colors.primaryBg}
            borderRadius="md"
            borderWidth="1px"
            borderColor={colors.primaryBorder}
          >
            <LuDumbbell size={20} color={colors.primaryHex} />
          </Box>
          <VStack gap={0} align="start">
            <Box fontSize="xl" fontWeight="bold" color="white">{count}</Box>
            <Box fontSize="xs" color="gray.400">exercices</Box>
          </VStack>
        </HStack>
      </VStack>
    </ClickableCard>
  );
};
