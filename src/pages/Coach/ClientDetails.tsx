import {
  Avatar,
  Box,
  Grid,
  Heading,
  HStack,
  Spinner,
  Tabs,
  Text,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useClientDetails } from '@/features/coach/hooks/useClientDetails';
import { useClientHistory } from '@/features/coach/hooks/useClientHistory';
import { ClientJournalTab } from '@/features/coach/components/ClientJournalTab';
import { ClientProgramTab } from '@/features/coach/components/ClientProgramTab';
import { COACH_CONTENT_MAX_W, COACH_GRID_MAX_W } from '@/features/coach';

const ClientDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const { data: client, isLoading } = useClientDetails(clientId!);
  const { data: history = [] } = useClientHistory(clientId!);

  const [searchParams] = useSearchParams();
  const defaultTab =
    searchParams.get('tab') === 'programme' ? 'programme' : 'journal';

  // La DA distingue vraiment deux mises en page, pas juste deux largeurs :
  // un sélecteur d'onglets en mobile, deux colonnes simultanées en web.
  const isDesktop = useBreakpointValue({ base: false, md: true });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="60vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!client) return null;

  const sessionCount = client.program.sessions.length;

  return (
    <Box
      maxW={isDesktop ? COACH_GRID_MAX_W : COACH_CONTENT_MAX_W}
      mx="auto"
      px={4}
      py={8}
    >
      <VStack align="stretch" gap={1} mb={6}>
        <HStack
          gap={1.5}
          color="fg.muted"
          cursor="pointer"
          onClick={() => navigate('/coach')}
          _hover={{ color: 'app.primary' }}
          transition="color 0.15s"
          w="fit-content"
        >
          <LuArrowLeft size={13} />
          <Text fontSize="xs" fontWeight="medium">
            Clients
          </Text>
        </HStack>
        <HStack gap={4} align="center">
          <Avatar.Root size="lg">
            <Avatar.Fallback name={`${client.firstName} ${client.lastName}`} />
            <Avatar.Image src={client.picture} />
          </Avatar.Root>
          <VStack align="start" gap={0}>
            <Heading size="lg">
              {client.firstName} {client.lastName}
            </Heading>
            <Text fontSize="sm" color="fg.muted">
              {sessionCount} séance{sessionCount > 1 ? 's' : ''}
              {client.unseenCount > 0 &&
                ` · ${client.unseenCount} non vue${client.unseenCount > 1 ? 's' : ''}`}
            </Text>
          </VStack>
        </HStack>
      </VStack>

      {isDesktop ? (
        <Grid templateColumns="1fr 1fr" gap={8} alignItems="start">
          <Box>
            <Heading size="sm" mb={4}>
              Journal
            </Heading>
            <ClientJournalTab history={history} clientId={clientId!} />
          </Box>
          <Box>
            <Heading size="sm" mb={4}>
              Programme
            </Heading>
            <ClientProgramTab client={client} clientId={clientId!} />
          </Box>
        </Grid>
      ) : (
        <Tabs.Root defaultValue={defaultTab} variant="line">
          <Tabs.List>
            <Tabs.Trigger value="journal" flex={1}>
              Journal
            </Tabs.Trigger>
            <Tabs.Trigger value="programme" flex={1}>
              Programme
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="journal">
            <ClientJournalTab history={history} clientId={clientId!} />
          </Tabs.Content>
          <Tabs.Content value="programme">
            <ClientProgramTab client={client} clientId={clientId!} />
          </Tabs.Content>
        </Tabs.Root>
      )}
    </Box>
  );
};

export default ClientDetails;
