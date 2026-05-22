import ClickableCard from "@/components/ClickableCard";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Exercise } from "@/types";
import { Box, VStack } from "@chakra-ui/react";
import { LuDumbbell } from "react-icons/lu";

interface ExerciseLibraryCardProps {
  exercise: Exercise;
  onClick?: () => void;
}

export const ExerciseLibraryCard = ({ exercise, onClick }: ExerciseLibraryCardProps) => {
  const colors = useThemeColors();

  return (
    <ClickableCard
      onClick={() => onClick?.()}
      p={6}
      color={colors.primary}
      cursor={onClick ? "pointer" : "default"}
    >
      <VStack gap={3} align="stretch">
        <Box
          p={3}
          bg={colors.primaryBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={colors.primaryBorder}
          alignSelf="center"
        >
          <LuDumbbell size={28} color={colors.primaryHex} />
        </Box>

        <Box fontWeight="bold" fontSize="lg" textAlign="center" color="white">
          {exercise.name}
        </Box>

        {exercise.description && (
          <Box fontSize="sm" color="gray.400" lineClamp={2} textAlign="center">
            {exercise.description}
          </Box>
        )}
      </VStack>
    </ClickableCard>
  );
};
