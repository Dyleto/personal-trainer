import { Box, VStack } from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';

interface CreateExerciseCardProps {
  onClick?: () => void;
}

export const CreateExerciseCard = ({ onClick }: CreateExerciseCardProps) => {
  return (
    <Box
      p={6}
      borderWidth="2px"
      borderStyle="dashed"
      borderColor="app.primary"
      borderRadius="xl"
      cursor={onClick ? 'pointer' : 'default'}
      transition="all 0.3s ease"
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="200px"
      _hover={{
        borderColor: 'app.primary.hover',
        bg: 'app.primary.bg',
        transform: 'translateY(-2px)',
      }}
      onClick={() => onClick?.()}
    >
      <VStack gap={3} color="app.primary">
        <Box
          p={3}
          bg="app.primary.bg"
          borderRadius="full"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor="app.primary"
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
