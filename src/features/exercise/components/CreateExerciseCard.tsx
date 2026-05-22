import { useThemeColors } from "@/hooks/useThemeColors";
import { Box, VStack } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";

interface CreateExerciseCardProps {
  onClick?: () => void;
}

export const CreateExerciseCard = ({ onClick }: CreateExerciseCardProps) => {
  const colors = useThemeColors();

  return (
    <Box
      p={6}
      borderWidth="2px"
      borderStyle="dashed"
      borderColor={colors.primary}
      borderRadius="xl"
      cursor={onClick ? "pointer" : "default"}
      transition="all 0.3s ease"
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="200px"
      _hover={{
        borderColor: colors.primaryHover,
        bg: colors.primaryBg,
        transform: "translateY(-2px)",
      }}
      onClick={() => onClick?.()}
    >
      <VStack gap={3} color={colors.primary}>
        <Box
          p={3}
          bg={colors.primaryBg}
          borderRadius="full"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor={colors.primary}
        >
          <LuPlus size={32} />
        </Box>
        <Box fontWeight="bold" fontSize="md" textAlign="center">
          Créer un exercice
        </Box>
      </VStack>
    </Box>
  );
};
