import { Session, SessionMetrics } from '@/types';
import { CompleteSessionModal } from './CompleteSessionModal';
import { NextSessionCard } from './NextSessionCard';
import { Box, HStack, Skeleton, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { LuListChecks } from 'react-icons/lu';

interface CurrentSessionProps {
  session: Session | undefined;
  isManualSelection?: boolean;
  onComplete: (
    metrics: SessionMetrics,
    notes: string,
    completedAt?: string
  ) => void;
  onChooseSession?: () => void;
  isLoading?: boolean;
}

export const CurrentSession = ({
  session,
  isManualSelection,
  onComplete,
  onChooseSession,
  isLoading,
}: CurrentSessionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (
    metrics: SessionMetrics,
    notes: string,
    completedAt?: string
  ) => {
    onComplete(metrics, notes, completedAt);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <Box
        p={5}
        bg="whiteAlpha.50"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="whiteAlpha.100"
      >
        <VStack align="stretch" gap={3}>
          <Skeleton h="16px" w="140px" borderRadius="md" />
          <Skeleton h="12px" w="220px" borderRadius="md" />
          <Skeleton h="80px" borderRadius="lg" mt={1} />
        </VStack>
      </Box>
    );
  }

  if (!session) {
    return (
      <Box
        p={8}
        textAlign="center"
        bg="whiteAlpha.50"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="whiteAlpha.100"
      >
        <Text fontSize="lg" fontWeight="bold" mb={1}>
          Programme terminé 🎉
        </Text>
        <Text color="gray.400" fontSize="sm">
          Toutes les séances sont complétées. Ton coach prépare la suite.
        </Text>
      </Box>
    );
  }

  return (
    <>
      <Box maxW="2xl" mx="auto" w="full">
        {onChooseSession && (
          <HStack
            justify="center"
            gap={1.5}
            mb={3}
            cursor="pointer"
            color="gray.400"
            _hover={{ color: 'gray.200' }}
            onClick={onChooseSession}
            transition="color 0.15s"
          >
            <LuListChecks size={14} />
            <Text fontSize="sm" fontWeight="medium">
              Choisir une autre séance
            </Text>
          </HStack>
        )}
        <NextSessionCard
          session={session}
          isManualSelection={isManualSelection}
          onComplete={() => setIsModalOpen(true)}
        />
      </Box>
      <CompleteSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};
