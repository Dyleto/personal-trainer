import { useOutletContext, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Box, Container, Grid, HStack, Text, VStack } from '@chakra-ui/react';
import { Card } from '@/components/Card';
import { Session } from '@/types';
import {
  CLIENT_GRID_MAX_W,
  getSessionBlockTypes,
  getSessionSummary,
  useClientSessions,
} from '@/features/client';

type ClientSessionsData = ReturnType<typeof useClientSessions>;
type SessionStatus = 'done' | 'next' | 'upcoming';

function getStatus(
  session: Session,
  nextSession: Session | undefined,
  completedSessionIds: Set<string>
): SessionStatus {
  if (session._id === nextSession?._id) return 'next';
  if (completedSessionIds.has(session._id)) return 'done';
  return 'upcoming';
}

const STATUS_CONFIG: Record<
  SessionStatus,
  { label: string; color: string; bg: string }
> = {
  done: { label: 'Terminée', color: 'session.rest', bg: 'session.rest/16' },
  next: { label: 'À faire', color: 'session.work', bg: 'session.work/16' },
  upcoming: { label: 'À venir', color: 'fg.muted', bg: 'whiteAlpha.50' },
};

interface SessionRowProps {
  session: Session;
  status: SessionStatus;
  onSelect: () => void;
}

const SessionRow = ({ session, status, onSelect }: SessionRowProps) => {
  const config = STATUS_CONFIG[status];

  return (
    <Card
      accentColor={config.color}
      hoverEffect="border"
      withGlow={false}
      onClick={onSelect}
      p={4}
      opacity={status === 'upcoming' ? 0.7 : 1}
    >
      <VStack align="stretch" gap={1.5}>
        <HStack justify="space-between" align="center">
          <Text fontWeight="bold" fontSize="sm">
            Séance {session.order}
          </Text>
          <Box
            px={2}
            py={0.5}
            borderRadius="full"
            bg={config.bg}
            fontSize="2xs"
            fontWeight="bold"
            color={config.color}
            textTransform="uppercase"
            letterSpacing="wider"
          >
            {config.label}
          </Box>
        </HStack>
        {session.blocks.length === 0 ? (
          <Text fontSize="xs" color="fg.muted">
            Aucun bloc pour cette séance.
          </Text>
        ) : (
          <>
            <Text fontSize="xs" color="fg.muted">
              {getSessionSummary(session)}
            </Text>
            <Text fontSize="xs" color="fg.muted">
              {getSessionBlockTypes(session)}
            </Text>
          </>
        )}
      </VStack>
    </Card>
  );
};

const Program = () => {
  const navigate = useNavigate();
  const { sessions, nextSession, selectSession, history } =
    useOutletContext<ClientSessionsData>();

  const completedSessionIds = useMemo(
    () => new Set(history.map((h) => h.originalSessionId)),
    [history]
  );

  const handleSelect = (sessionId: string) => {
    selectSession(sessionId);
    navigate('/client/seance');
  };

  return (
    <Container maxW={CLIENT_GRID_MAX_W} py={6} px={4}>
      <VStack align="stretch" gap={4}>
        <Text fontWeight="bold" fontSize="lg">
          Mon programme
        </Text>

        {sessions.length === 0 ? (
          <Box py={16} textAlign="center" color="fg.muted" fontSize="sm">
            Aucune séance dans le programme.
          </Box>
        ) : (
          <>
            <Text fontSize="xs" color="fg.muted">
              {sessions.length} séance{sessions.length > 1 ? 's' : ''} ·{' '}
              {completedSessionIds.size} complétée
              {completedSessionIds.size > 1 ? 's' : ''}
            </Text>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={3}
            >
              {sessions.map((session) => (
                <SessionRow
                  key={session._id}
                  session={session}
                  status={getStatus(session, nextSession, completedSessionIds)}
                  onSelect={() => handleSelect(session._id)}
                />
              ))}
            </Grid>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Program;
