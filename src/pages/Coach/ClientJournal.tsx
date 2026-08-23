import { useNavigate, useParams } from 'react-router-dom';
import { Box, Heading, HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';
import { useClientDetails } from '@/features/coach/hooks/useClientDetails';
import { useClientHistory } from '@/features/coach/hooks/useClientHistory';
import { ClientJournalTab } from '@/features/coach/components/ClientJournalTab';
import { COACH_ROUTES } from '@/config/routes';
import { COACH_CONTENT_MAX_W } from '@/features/coach';

const ClientJournal = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const { data: client, isLoading } = useClientDetails(clientId!);
  const { data: history = [], isLoading: isHistoryLoading } = useClientHistory(
    clientId!
  );

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

  return (
    <Box maxW={COACH_CONTENT_MAX_W} mx="auto" px={4} py={8}>
      <VStack align="stretch" gap={1} mb={6}>
        <HStack
          gap={1.5}
          color="fg.muted"
          cursor="pointer"
          onClick={() => navigate(COACH_ROUTES.clientSession(clientId!, 1))}
          _hover={{ color: 'app.primary' }}
          transition="color 0.15s"
          w="fit-content"
        >
          <LuArrowLeft size={13} />
          <Text fontSize="xs" fontWeight="medium">
            {client.firstName} {client.lastName}
          </Text>
        </HStack>
        <Heading size="lg">Journal complet</Heading>
      </VStack>

      {isHistoryLoading ? (
        <Spinner size="lg" />
      ) : (
        <ClientJournalTab history={history} clientId={clientId!} />
      )}
    </Box>
  );
};

export default ClientJournal;
