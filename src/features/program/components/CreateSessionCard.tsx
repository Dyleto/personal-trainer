import { Box, VStack, Text } from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';

interface CreateSessionCardProps {
  onClick?: () => void;
}

export const CreateSessionCard = ({ onClick }: CreateSessionCardProps) => {
  return (
    <Box
      w="full"
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
      minH="557px"
      onClick={onClick}
      _hover={{
        borderColor: 'app.primary.hover',
        bg: 'app.primary.bg',
        transform: 'translateY(-2px)',
      }}
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
        <Text fontWeight="bold" fontSize="md" textAlign="center">
          Ajouter une séance
        </Text>
      </VStack>
    </Box>
  );
};
