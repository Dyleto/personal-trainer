import {
  Avatar,
  Box,
  Button,
  HStack,
  SkeletonCircle,
  SkeletonText,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '@/features/coach/hooks/useClients';
import { useToastError } from '@/hooks/useToastError';
import { Card } from '@/components/Card';
import { COACH_ROUTES } from '@/config/routes';
import { Client } from '@/types';

const SILENCE_THRESHOLD_DAYS = 14;

const daysSince = (date: Date | string) =>
  Math.floor((Date.now() - new Date(date).getTime()) / 86400000);

/**
 * Un client silencieux depuis plus de deux semaines. Sans date de dernière
 * séance, on ne conclut rien : l'API ne renvoie le champ que s'il existe, et
 * « jamais fait de séance » n'est pas la même chose que « a décroché ».
 */
const silenceLabel = (client: Client): string | null => {
  if (!client.lastCompletedAt) return null;
  const days = daysSince(client.lastCompletedAt);
  if (days < SILENCE_THRESHOLD_DAYS) return null;
  const weeks = Math.floor(days / 7);
  return weeks >= 8 ? 'rien depuis 2 mois+' : `rien depuis ${weeks} sem.`;
};

// À traiter d'abord, puis les silencieux, puis l'alphabétique : le premier nom
// de la liste est toujours le prochain à traiter, pour l'une ou l'autre raison.
const sortClients = (clients: Client[]): Client[] =>
  [...clients].sort((a, b) => {
    if (a.unseenCount > 0 !== b.unseenCount > 0)
      return a.unseenCount > 0 ? -1 : 1;

    const aSilent = !!silenceLabel(a);
    const bSilent = !!silenceLabel(b);
    if (aSilent !== bSilent) return aSilent ? -1 : 1;

    return `${a.firstName} ${a.lastName}`.localeCompare(
      `${b.firstName} ${b.lastName}`
    );
  });

interface ClientRowProps {
  client: Client;
  onSelect: () => void;
}

const ClientRow = ({ client, onSelect }: ClientRowProps) => {
  const silence = silenceLabel(client);

  return (
    <Card
      accentColor="app.primary"
      hoverEffect="border"
      withGlow={false}
      onClick={onSelect}
      p={3}
    >
      <HStack justify="space-between" gap={3}>
        <HStack gap={3} minW={0}>
          <Avatar.Root size="sm" flexShrink={0}>
            <Avatar.Fallback name={`${client.firstName} ${client.lastName}`} />
            {client.picture && <Avatar.Image src={client.picture} />}
          </Avatar.Root>
          <Text fontWeight="semibold" fontSize="sm" truncate>
            {client.firstName} {client.lastName}
          </Text>
        </HStack>
        <HStack gap={2.5} flexShrink={0}>
          {/* Ni pastille ni couleur : le rouge est déjà pris par les séances à
              commenter, et ceci est un fait, pas une alerte. */}
          {silence && (
            <Text fontSize="xs" color="fg.muted">
              {silence}
            </Text>
          )}
          {client.unseenCount > 0 && (
            <Box
              w="8px"
              h="8px"
              borderRadius="full"
              bg="session.work"
              flexShrink={0}
              aria-label={`${client.unseenCount} séance${client.unseenCount > 1 ? 's' : ''} non vue${client.unseenCount > 1 ? 's' : ''}`}
            />
          )}
        </HStack>
      </HStack>
    </Card>
  );
};

export const ClientsList = () => {
  const navigate = useNavigate();
  const { data: clients = [], isLoading, error, refetch } = useClients();

  useToastError(error, 'Impossible de charger vos clients');

  const sortedClients = useMemo(() => sortClients(clients), [clients]);

  const handleSelect = (client: Client) => {
    // Une séance non vue ouvre directement le journal ; sinon l'atelier
    // s'ouvre sur la première séance.
    if (client.unseenCount > 0) {
      navigate(COACH_ROUTES.clientJournal(client._id));
    } else {
      navigate(COACH_ROUTES.clientSession(client._id, 1));
    }
  };

  if (isLoading) {
    return (
      <VStack align="stretch" gap={2}>
        {[...Array(6)].map((_, index) => (
          <Card key={index} onClick={() => {}} p={3}>
            <HStack gap={3}>
              <SkeletonCircle size="8" />
              <SkeletonText noOfLines={1} width="140px" />
            </HStack>
          </Card>
        ))}
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack gap={4} py={12} textAlign="center">
        <Text color="app.error" fontWeight="bold">
          Erreur de chargement
        </Text>
        <Text color="fg.muted" fontSize="sm">
          Impossible de récupérer la liste de vos clients.
        </Text>
        <Button bg="app.primary" color="bg.canvas" onClick={() => refetch()}>
          Réessayer
        </Button>
      </VStack>
    );
  }

  if (sortedClients.length === 0) {
    return (
      <VStack gap={2} py={12} textAlign="center">
        <Text color="fg.muted">Aucun client pour le moment</Text>
        <Text color="fg.muted" fontSize="sm">
          Invitez votre premier client pour commencer.
        </Text>
      </VStack>
    );
  }

  return (
    <VStack align="stretch" gap={2}>
      {sortedClients.map((client) => (
        <ClientRow
          key={client._id}
          client={client}
          onSelect={() => handleSelect(client)}
        />
      ))}
    </VStack>
  );
};
