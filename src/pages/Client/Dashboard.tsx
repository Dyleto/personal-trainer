import {
  CycleProgress,
  CurrentSession,
  SessionHistory,
  useCycleProgress,
} from "@/features/client";
import { FullProgramDrawer } from "@/features/client/components/FullProgramDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { Container, HStack, Text, VStack } from "@chakra-ui/react";
import { Header } from "@/components/Header";
import { useState } from "react";

const ClientDashboard = () => {
  const { user } = useAuth();
  const {
    sessions,
    nextSession,
    history,
    currentCycleNumber,
    sessionsDoneInCurrentCycle,
    handleSubmitLog,
  } = useCycleProgress();

  const [isProgramOpen, setIsProgramOpen] = useState(false);

  return (
    <Container py={8} px={4}>
      <VStack gap={8} align="stretch">
        <HStack justify="space-between" w="100%" px={2} align="start">
          <VStack gap={0}>
            <Text fontSize="xl" fontWeight="bold" ml={5}>
              Bonjour {user?.firstName},
            </Text>
          </VStack>
          <Header />
        </HStack>

        <CycleProgress
          sessions={sessions}
          currentCycleNumber={currentCycleNumber}
          sessionsDoneInCurrentCycle={sessionsDoneInCurrentCycle}
          onViewProgram={() => setIsProgramOpen(true)}
        />

        <CurrentSession nextSession={nextSession} onComplete={handleSubmitLog} />

        {history.length > 0 && <SessionHistory history={history} />}
      </VStack>

      <FullProgramDrawer
        isOpen={isProgramOpen}
        onClose={() => setIsProgramOpen(false)}
        sessions={sessions}
        nextSession={nextSession}
        sessionsDoneInCurrentCycle={sessionsDoneInCurrentCycle}
      />
    </Container>
  );
};

export default ClientDashboard;
