import { useOutletContext } from 'react-router-dom';
import { Box, Container, Grid, Text, VStack } from '@chakra-ui/react';
import {
  CLIENT_GRID_MAX_W,
  SessionHistoryCard,
  useClientSessions,
} from '@/features/client';

type ClientSessionsData = ReturnType<typeof useClientSessions>;

const History = () => {
  const { history } = useOutletContext<ClientSessionsData>();

  return (
    <Container maxW={CLIENT_GRID_MAX_W} py={8} px={4}>
      <VStack align="stretch" gap={4}>
        <Text fontWeight="bold" fontSize="lg">
          Historique
        </Text>

        {history.length === 0 ? (
          <Box py={16} textAlign="center" color="fg.muted" fontSize="sm">
            Aucune séance complétée pour l'instant.
          </Box>
        ) : (
          <>
            <Text fontSize="xs" color="fg.muted">
              {history.length} séance{history.length > 1 ? 's' : ''} complétée
              {history.length > 1 ? 's' : ''}
            </Text>
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                xl: 'repeat(3, 1fr)',
              }}
              gap={4}
              alignItems="start"
            >
              {history.map((c) => (
                <SessionHistoryCard key={c._id} completed={c} />
              ))}
            </Grid>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default History;
