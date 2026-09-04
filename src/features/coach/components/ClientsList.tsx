import {
  Avatar,
  Box,
  Button,
  HStack,
  Input,
  SkeletonCircle,
  SkeletonText,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuSearch, LuX } from 'react-icons/lu';
import { useClients } from '@/features/coach/hooks/useClients';
import { useToastError } from '@/hooks/useToastError';
import { EFFORT_ZONE_COLOR, getEffortLevel } from '@/features/client/constants';
import { Card } from '@/components/Card';
import { hitArea } from '@/components/hitArea';
import { COACH_ROUTES } from '@/config/routes';
import { stripAccents } from '@/utils/formatters';
import { Client } from '@/types';

const SILENCE_THRESHOLD_DAYS = 14;

const daysSince = (date: Date | string) =>
  Math.floor((Date.now() - new Date(date).getTime()) / 86400000);

/**
 * Depuis combien de jours ce client n'a rien fait.
 *
 * Sans séance terminée on compte depuis la mise en relation : « jamais fait
 * de séance » et « a décroché » restent deux phrases différentes à l'écran,
 * mais pour trier ce sont bien deux formes de la même inactivité, et celui
 * qu'on a inscrit il y a trois mois sans qu'il commence est le plus urgent
 * des deux.
 */
const inactivityDays = (client: Client): number =>
  daysSince(client.lastCompletedAt ?? client.linkedAt);

const silenceLabel = (client: Client): string | null => {
  if (!client.lastCompletedAt) return null;
  const days = daysSince(client.lastCompletedAt);
  if (days < SILENCE_THRESHOLD_DAYS) return null;
  const weeks = Math.floor(days / 7);
  return weeks >= 8 ? 'rien depuis 2 mois+' : `rien depuis ${weeks} sem.`;
};

/**
 * La ligne d'état, en une phrase : quand, et comment ça s'est passé.
 * « il y a 3 jours » seul ne dit pas s'il faut agir ; « Trop dure » seul ne
 * dit pas si c'était hier ou le mois dernier.
 */
const activityLabel = (client: Client): string => {
  if (!client.lastCompletedAt) {
    const days = daysSince(client.linkedAt);
    return days >= SILENCE_THRESHOLD_DAYS
      ? 'jamais fait de séance'
      : 'nouveau client';
  }
  const silence = silenceLabel(client);
  if (silence) return silence;

  const days = daysSince(client.lastCompletedAt);
  if (days <= 0) return "séance aujourd'hui";
  if (days === 1) return 'séance hier';
  return `il y a ${days} jours`;
};

type ClientSort = 'triage' | 'alpha' | 'recent';

const CLIENT_SORTS: { value: ClientSort; label: string }[] = [
  { value: 'triage', label: 'À traiter' },
  { value: 'recent', label: 'Activité' },
  { value: 'alpha', label: 'A → Z' },
];

const byName = (a: Client, b: Client) =>
  `${a.firstName} ${a.lastName}`.localeCompare(
    `${b.firstName} ${b.lastName}`,
    'fr',
    { sensitivity: 'base' }
  );

// À traiter d'abord — le plus de séances non vues —, puis le plus longtemps
// sans rien faire, puis l'alphabétique. Le premier nom de la liste est
// toujours le prochain à traiter, pour l'une ou l'autre raison.
const sortClients = (clients: Client[], sort: ClientSort): Client[] => {
  const list = [...clients];

  if (sort === 'alpha') return list.sort(byName);
  if (sort === 'recent')
    return list.sort(
      (a, b) => inactivityDays(a) - inactivityDays(b) || byName(a, b)
    );

  return list.sort((a, b) => {
    if (a.unseenCount !== b.unseenCount) return b.unseenCount - a.unseenCount;
    const gap = inactivityDays(b) - inactivityDays(a);
    if (gap !== 0) return gap;
    return byName(a, b);
  });
};

const matches = (client: Client, query: string): boolean => {
  const needle = stripAccents(query).toLowerCase().trim();
  if (!needle) return true;
  const haystack = stripAccents(
    `${client.firstName} ${client.lastName}`
  ).toLowerCase();
  return needle.split(/\s+/).every((word) => haystack.includes(word));
};

interface ClientRowProps {
  client: Client;
  onSelect: () => void;
}

const ClientRow = ({ client, onSelect }: ClientRowProps) => {
  const effort = getEffortLevel(client.lastEffort);

  return (
    <Card
      accentColor="app.primary"
      hoverEffect="border"
      withGlow={false}
      onClick={onSelect}
      p={3}
    >
      <HStack justify="space-between" gap={3} align="center">
        <HStack gap={3} minW={0} flex={1}>
          <Avatar.Root size="sm" flexShrink={0}>
            <Avatar.Fallback name={`${client.firstName} ${client.lastName}`} />
            {client.picture && <Avatar.Image src={client.picture} />}
          </Avatar.Root>
          <VStack align="start" gap={0} minW={0} flex={1}>
            <Text fontWeight="semibold" fontSize="sm" truncate maxW="100%">
              {client.firstName} {client.lastName}
            </Text>
            <HStack gap={1.5} fontSize="xs" color="fg.muted" minW={0}>
              {effort && (
                <>
                  <Text
                    as="span"
                    fontWeight="bold"
                    color={EFFORT_ZONE_COLOR[effort.zone]}
                    flexShrink={0}
                  >
                    {effort.label}
                  </Text>
                  <Text as="span" flexShrink={0}>
                    ·
                  </Text>
                </>
              )}
              <Text as="span" truncate>
                {activityLabel(client)}
              </Text>
            </HStack>
          </VStack>
        </HStack>

        {/* Un nombre, pas une pastille : « 2 séances à lire » et « 1 séance à
            lire » ne demandent pas le même temps.

            Doré et non rouge : sur la même ligne, le rouge dit déjà que la
            séance a été dure. Deux significations sans rapport sur une seule
            couleur, à quelques centimètres l'une de l'autre, ne se lisent
            plus. Le doré est partout ailleurs la couleur de ce qui appelle
            une action. */}
        {client.unseenCount > 0 && (
          <Box
            flexShrink={0}
            minW="22px"
            h="22px"
            px={1.5}
            borderRadius="full"
            bg="app.primary"
            color="bg.canvas"
            fontSize="xs"
            fontWeight="bold"
            fontFamily="mono"
            display="flex"
            alignItems="center"
            justifyContent="center"
            aria-label={`${client.unseenCount} séance${client.unseenCount > 1 ? 's' : ''} non vue${client.unseenCount > 1 ? 's' : ''}`}
          >
            {client.unseenCount}
          </Box>
        )}
      </HStack>
    </Card>
  );
};

export const ClientsList = () => {
  const navigate = useNavigate();
  const { data: clients = [], isLoading, error, refetch } = useClients();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<ClientSort>('triage');

  useToastError(error, 'Impossible de charger vos clients');

  const visibleClients = useMemo(
    () =>
      sortClients(
        clients.filter((c) => matches(c, query)),
        sort
      ),
    [clients, query, sort]
  );

  // Toujours l'atelier, jamais le journal.
  //
  // Les séances non vues y menaient : on arrivait sur le bon client et le bon
  // retour — « trop dure, je n'ai pas pu finir le dernier bloc » — sur un
  // écran en lecture seule. Le geste que ce retour appelle, alléger la
  // séance, se joue dans l'atelier, qui affiche déjà ce même retour à côté du
  // programme qu'il commente. Le journal reste l'historique complet, ouvert
  // par son propre bouton.
  const handleSelect = (client: Client) =>
    navigate(COACH_ROUTES.clientSession(client._id, 1));

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

  if (clients.length === 0) {
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
    <VStack align="stretch" gap={3}>
      {/* Chercher et trier n'apparaissent qu'à partir du moment où la liste
          ne tient plus d'un coup d'œil. En dessous, l'ordre de traitement
          suffit et deux commandes de plus ne feraient qu'encombrer. */}
      {clients.length > 5 && (
        <VStack align="stretch" gap={2}>
          <HStack
            gap={2}
            px={2}
            py={1}
            borderBottomWidth="1px"
            borderColor="whiteAlpha.200"
            _focusWithin={{ borderColor: 'app.primary' }}
            transition="border-color 0.2s"
          >
            <LuSearch size={14} color="var(--chakra-colors-fg-muted)" />
            <Input
              placeholder="Chercher un client…"
              aria-label="Chercher un client"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              variant="subtle"
              bg="transparent"
              border="none"
              outline="none"
              size="sm"
              _focus={{ boxShadow: 'none', outline: 'none' }}
              _focusVisible={{ boxShadow: 'none', outline: 'none' }}
            />
            {query && (
              <Box
                as="button"
                aria-label="Effacer la recherche"
                color="fg.muted"
                _hover={{ color: 'fg' }}
                flexShrink={0}
                onClick={() => setQuery('')}
                css={hitArea(32)}
              >
                <LuX size={13} />
              </Box>
            )}
          </HStack>

          <HStack gap={1} role="group" aria-label="Trier les clients">
            {CLIENT_SORTS.map((option) => (
              <Box
                key={option.value}
                as="button"
                aria-pressed={sort === option.value}
                onClick={() => setSort(option.value)}
                px={2.5}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight={sort === option.value ? 'bold' : 'normal'}
                color={sort === option.value ? 'bg.canvas' : 'fg.muted'}
                bg={sort === option.value ? 'app.primary' : 'whiteAlpha.100'}
                _hover={{
                  bg:
                    sort === option.value
                      ? 'app.primary.hover'
                      : 'whiteAlpha.200',
                }}
                css={hitArea(32)}
              >
                {option.label}
              </Box>
            ))}
          </HStack>
        </VStack>
      )}

      {visibleClients.length === 0 ? (
        <Text color="fg.muted" fontSize="sm" py={8} textAlign="center">
          Aucun client ne correspond à « {query} ».
        </Text>
      ) : (
        <VStack align="stretch" gap={2}>
          {visibleClients.map((client) => (
            <ClientRow
              key={client._id}
              client={client}
              onSelect={() => handleSelect(client)}
            />
          ))}
        </VStack>
      )}
    </VStack>
  );
};
