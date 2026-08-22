import { useOutletContext, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/useAuth';
import { Card } from '@/components/Card';
import { CompletedSession } from '@/types';
import {
  CLIENT_CONTENT_MAX_W,
  CompletedSessionDrawer,
  getAverageRating,
  getRelativeDate,
  getSessionBlockTypes,
  getSessionSummary,
  useClientSessions,
} from '@/features/client';
import {
  Box,
  Button,
  Container,
  HStack,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuArrowRight } from 'react-icons/lu';

type ClientSessionsData = ReturnType<typeof useClientSessions>;

const Today = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sessions, nextSession, history, isLoading, isProgramComplete } =
    useOutletContext<ClientSessionsData>();

  const totalCount = sessions.length;
  const recentSessions = history.slice(0, 3);

  const [selectedCompleted, setSelectedCompleted] =
    useState<CompletedSession | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = (completed: CompletedSession) => {
    setSelectedCompleted(completed);
    setIsDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <Container maxW={CLIENT_CONTENT_MAX_W} py={8} px={4}>
        <VStack align="stretch" gap={6}>
          <Skeleton h="24px" w="160px" borderRadius="md" />
          <Skeleton h="140px" borderRadius="xl" />
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW={CLIENT_CONTENT_MAX_W} py={8} px={4}>
      <VStack gap={6} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          Bonjour {user?.firstName},
        </Text>

        {totalCount === 0 ? (
          <Box
            p={8}
            textAlign="center"
            bg="whiteAlpha.50"
            borderRadius="xl"
            borderWidth="1px"
            borderColor="whiteAlpha.100"
          >
            <Text fontSize="lg" fontWeight="bold" mb={1}>
              Pas encore de programme
            </Text>
            <Text color="fg.muted" fontSize="sm">
              Ton coach n'a pas encore ajouté de séances. Reviens bientôt.
            </Text>
          </Box>
        ) : isProgramComplete ? (
          <Box
            p={4}
            borderRadius="xl"
            borderWidth="1px"
            borderColor="session.rest"
            bg="whiteAlpha.50"
          >
            <VStack align="stretch" gap={1.5}>
              <HStack justify="space-between" align="center">
                <Text fontWeight="bold" fontSize="sm">
                  Programme terminé
                </Text>
                <Box
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  bg="session.rest/16"
                  fontSize="2xs"
                  fontWeight="bold"
                  color="session.rest"
                >
                  ✓
                </Box>
              </HStack>
              <Text fontSize="xs" color="fg.muted">
                Les {totalCount} séance{totalCount > 1 ? 's' : ''} sont faites.
                Ton coach prépare la suite.
              </Text>
            </VStack>
          </Box>
        ) : (
          nextSession && (
            <VStack align="stretch" gap={2}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="fg.muted"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                À faire maintenant
              </Text>
              <Box
                p={4}
                borderRadius="xl"
                borderWidth="1px"
                borderColor="app.primary"
                bg="whiteAlpha.50"
              >
                <VStack align="stretch" gap={1.5}>
                  <HStack justify="space-between" align="center">
                    <Text fontWeight="bold" fontSize="sm">
                      Séance {nextSession.order}
                    </Text>
                    <Box
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      bg="session.work/16"
                      fontSize="2xs"
                      fontWeight="bold"
                      color="session.work"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      À faire
                    </Box>
                  </HStack>
                  <Text fontSize="xs" color="fg.muted">
                    {getSessionSummary(nextSession)}
                  </Text>
                  <Text fontSize="xs" color="fg.muted">
                    {getSessionBlockTypes(nextSession)}
                  </Text>
                </VStack>
              </Box>
              <Button
                w="full"
                bg="app.primary"
                color="bg.canvas"
                fontWeight="bold"
                onClick={() => navigate('/client/seance')}
                _hover={{ bg: 'app.primary.hover' }}
              >
                Voir la séance <LuArrowRight />
              </Button>
            </VStack>
          )
        )}

        {recentSessions.length > 0 && (
          <VStack align="stretch" gap={2}>
            <Text
              fontSize="xs"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Séances récentes
            </Text>
            <VStack align="stretch" gap={2}>
              {recentSessions.map((completed) => (
                <Card
                  key={completed._id}
                  accentColor="app.primary"
                  hoverEffect="border"
                  withGlow={false}
                  onClick={() => openDrawer(completed)}
                  p={3}
                >
                  <HStack justify="space-between" align="baseline">
                    <Text fontSize="sm" fontWeight="bold">
                      Séance {completed.sessionOrder}
                    </Text>
                    <Text fontSize="xs" fontWeight="bold" color="app.primary">
                      {getAverageRating(completed.metrics).toFixed(1)} / 5
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="fg.muted" mt={0.5}>
                    {getRelativeDate(completed.completedAt)}
                  </Text>
                </Card>
              ))}
            </VStack>
          </VStack>
        )}
      </VStack>

      {selectedCompleted && (
        <CompletedSessionDrawer
          completed={selectedCompleted}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </Container>
  );
};

export default Today;
