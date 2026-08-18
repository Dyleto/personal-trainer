import {
  Avatar,
  Box,
  Card,
  Container,
  Drawer,
  HStack,
  Heading,
  Spinner,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useClientDetails } from '@/features/coach/hooks/useClientDetails';
import { useClientHistory } from '@/features/coach/hooks/useClientHistory';
import { ClientJournalTab } from '@/features/coach/components/ClientJournalTab';
import { ClientProgramTab } from '@/features/coach/components/ClientProgramTab';

const ClientDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const { data: client, isLoading } = useClientDetails(clientId!);
  const { data: history } = useClientHistory(clientId!);

  const [searchParams] = useSearchParams();
  const defaultTab =
    searchParams.get('tab') === 'programme' ? 'programme' : 'journal';

  return (
    <Drawer.Root
      open={true}
      size="full"
      onOpenChange={(e) => !e.open && navigate('/coach')}
    >
      <Drawer.Positioner>
        <Drawer.Content bg="bg.canvas">
          <Drawer.Body>
            {isLoading && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minH="100vh"
              >
                <Spinner size="xl" />
              </Box>
            )}

            {client && (
              <Container maxW="container.xl" px={4} py={8}>
                <VStack gap={6} align="stretch">
                  <HStack justify="space-between">
                    <Button variant="ghost" onClick={() => navigate('/coach')}>
                      <LuArrowLeft /> Retour
                    </Button>
                  </HStack>

                  <Card.Root>
                    <Card.Body>
                      <HStack gap={6}>
                        <Avatar.Root size="2xl">
                          <Avatar.Fallback
                            name={`${client.firstName} ${client.lastName}`}
                          />
                          <Avatar.Image src={client.picture} />
                        </Avatar.Root>
                        <VStack align="start" gap={1} flex={1}>
                          <Heading size="xl">
                            {client.firstName} {client.lastName}
                          </Heading>
                          <Text color="fg.muted" fontSize="md">
                            {client.email}
                          </Text>
                        </VStack>
                      </HStack>
                    </Card.Body>
                  </Card.Root>

                  <Tabs.Root defaultValue={defaultTab} variant="line" mt={4}>
                    <Tabs.List>
                      <Tabs.Trigger value="journal">Journal</Tabs.Trigger>
                      <Tabs.Trigger value="programme">Programme</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="journal">
                      <ClientJournalTab
                        history={history ?? []}
                        clientId={clientId!}
                      />
                    </Tabs.Content>
                    <Tabs.Content value="programme">
                      <ClientProgramTab client={client} clientId={clientId!} />
                    </Tabs.Content>
                  </Tabs.Root>
                </VStack>
              </Container>
            )}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default ClientDetails;
