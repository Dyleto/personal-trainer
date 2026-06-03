import { Session, SessionMetrics } from "@/types";
import { CompleteSessionModal } from "./CompleteSessionModal";
import { NextSessionCard } from "./NextSessionCard";
import { Box, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

interface CurrentSessionProps {
  nextSession: Session | undefined;
  onComplete: (metrics: SessionMetrics, notes: string, completedAt?: string) => void;
  isLoading?: boolean;
}

export const CurrentSession = ({
  nextSession,
  onComplete,
  isLoading,
}: CurrentSessionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (metrics: SessionMetrics, notes: string, completedAt?: string) => {
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

  if (!nextSession) {
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
        <NextSessionCard
          session={nextSession}
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
