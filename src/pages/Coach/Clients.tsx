import { useState } from 'react';
import {
  Button,
  Container,
  Drawer,
  HStack,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuUserPlus, LuX } from 'react-icons/lu';
import {
  ClientsList,
  InvitationBlock,
  COACH_CONTENT_MAX_W,
} from '@/features/coach';
import { useClients } from '@/features/coach/hooks/useClients';

const Clients = () => {
  const { data: clients = [] } = useClients();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <Container maxW={COACH_CONTENT_MAX_W} py={8} px={4}>
      <VStack align="stretch" gap={6}>
        <HStack justify="space-between" align="center">
          <VStack align="start" gap={0}>
            <Text fontWeight="bold" fontSize="lg">
              Mes clients
            </Text>
            {clients.length > 0 && (
              <Text fontSize="xs" color="fg.muted">
                {clients.length} client{clients.length > 1 ? 's' : ''}
              </Text>
            )}
          </VStack>
          <Button
            size="sm"
            bg="app.primary"
            color="bg.canvas"
            fontWeight="bold"
            _hover={{ bg: 'app.primary.hover' }}
            onClick={() => setIsInviteOpen(true)}
          >
            <LuUserPlus /> Inviter
          </Button>
        </HStack>

        <ClientsList />
      </VStack>

      <Drawer.Root
        open={isInviteOpen}
        onOpenChange={(e) => !e.open && setIsInviteOpen(false)}
        size="sm"
      >
        <Drawer.Positioner>
          <Drawer.Content bg="bg.canvas">
            <Drawer.Header borderBottomWidth="1px" borderColor="whiteAlpha.100">
              <HStack justify="space-between" flex={1}>
                <Text fontWeight="bold">Inviter un client</Text>
                <IconButton
                  aria-label="Fermer"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsInviteOpen(false)}
                >
                  <LuX />
                </IconButton>
              </HStack>
            </Drawer.Header>
            <Drawer.Body p={6}>
              <VStack gap={4} align="center">
                <InvitationBlock />
                <Text textAlign="center" color="fg.muted" fontSize="sm">
                  Partagez le lien d'invitation pour ajouter un nouveau client.
                </Text>
              </VStack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </Container>
  );
};

export default Clients;
