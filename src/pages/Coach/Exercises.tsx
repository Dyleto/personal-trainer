import { ExerciseSectionSkeleton } from '@/components/skeletons';
import { useExercises } from '@/features/exercise/hooks/useExercises';
import {
  useCreateExercise,
  useDeleteExercise,
} from '@/features/exercise/hooks/useExerciseMutations';
import { useToastError } from '@/hooks/useToastError';
import { Exercise } from '@/types';
import {
  Box,
  Button,
  Container,
  Dialog,
  Drawer,
  Grid,
  HStack,
  Input,
  Portal,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuPlus, LuSearch, LuX } from 'react-icons/lu';
import { createPortal } from 'react-dom';
import { COACH_ROUTES } from '@/config/routes';
import { ExerciseRow, ExerciseSheet } from '@/features/exercise';
import { stripAccents } from '@/utils/formatters';

const normalize = (s: string) => stripAccents(s).toLowerCase().trim();

const Exercises = () => {
  // L'exercice ouvert est dans l'URL, pas dans un état : un lien vers une
  // fiche s'envoie, et le retour du navigateur referme la fiche.
  const { exerciseId } = useParams();
  const navigate = useNavigate();

  const { data: exercises = [], isLoading, error } = useExercises();
  const createMutation = useCreateExercise();
  const deleteMutation = useDeleteExercise();

  const [query, setQuery] = useState('');
  const [pendingDeletion, setPendingDeletion] = useState<Exercise | null>(null);

  const openSheet = (id: string) => navigate(COACH_ROUTES.exerciseDetails(id));
  const closeSheet = () => navigate(COACH_ROUTES.exercises);

  useToastError(error, 'Impossible de charger vos exercices');

  const isDesktop = useBreakpointValue({ base: false, lg: true });

  // On relit l'exercice dans la liste plutôt que de garder une copie : après
  // une modification, la fiche doit montrer la valeur enregistrée.
  const selected = exercises.find((e) => e._id === exerciseId) ?? null;

  const filtered = useMemo(() => {
    const q = normalize(query);
    return exercises.filter((e) => normalize(e.name).includes(q));
  }, [exercises, query]);

  const trimmed = query.trim();
  const canCreate =
    trimmed.length > 0 &&
    !exercises.some((e) => normalize(e.name) === normalize(trimmed));

  // Groupement alphabétique (les accents rejoignent leur lettre de base : É→E)
  const grouped = useMemo(() => {
    const sorted = [...filtered].sort((a, b) =>
      a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
    );
    const groups: { letter: string; exercises: Exercise[] }[] = [];
    sorted.forEach((ex) => {
      const letter = stripAccents(ex.name[0] ?? '').toUpperCase() || '#';
      const last = groups[groups.length - 1];
      if (last?.letter === letter) last.exercises.push(ex);
      else groups.push({ letter, exercises: [ex] });
    });
    return groups;
  }, [filtered]);

  const letters = grouped.map((g) => g.letter);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollToLetter = (letter: string) => {
    sectionRefs.current[letter]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const create = () => {
    createMutation.mutate(
      { name: trimmed },
      {
        onSuccess: (response) => {
          setQuery('');
          openSheet(response.data._id);
        },
      }
    );
  };

  const confirmDeletion = () => {
    if (!pendingDeletion) return;
    deleteMutation.mutate(pendingDeletion._id, {
      onSuccess: () => {
        if (exerciseId === pendingDeletion._id) closeSheet();
        setPendingDeletion(null);
      },
    });
  };

  const sheet = selected && (
    <ExerciseSheet
      exercise={selected}
      onClose={closeSheet}
      onDelete={() => setPendingDeletion(selected)}
    />
  );

  const list = (
    <VStack gap={0} align="stretch" pr={{ base: 9, lg: 0 }}>
      {grouped.map(({ letter, exercises: group }) => (
        <Box
          key={letter}
          ref={(el: HTMLDivElement | null) => {
            sectionRefs.current[letter] = el;
          }}
        >
          {/* Le repère de lettre est une étiquette, pas une carte : même
              graphie que l'étiquette de type dans l'atelier. */}
          <Box
            position="sticky"
            top={0}
            zIndex={1}
            bg="bg.canvas"
            pt={4}
            pb={1}
          >
            <Text
              fontSize="2xs"
              fontWeight="bold"
              color="fg.muted"
              letterSpacing="wider"
              textTransform="uppercase"
              px={2}
            >
              {letter}
            </Text>
          </Box>
          {group.map((exercise) => (
            <ExerciseRow
              key={exercise._id}
              exercise={exercise}
              selected={selected?._id === exercise._id}
              onClick={() => openSheet(exercise._id)}
            />
          ))}
        </Box>
      ))}

      {/* La recherche crée aussi : un exercice absent se tape et existe,
          exactement comme dans le sélecteur de l'atelier. */}
      {canCreate && (
        <Box
          as="button"
          w="full"
          textAlign="left"
          mt={2}
          px={2}
          py={2.5}
          fontSize="sm"
          color="app.primary"
          borderTopWidth="1px"
          borderColor="whiteAlpha.100"
          _hover={{ bg: 'app.primary/12' }}
          _focusVisible={{
            outline: '2px solid',
            outlineColor: 'app.primary',
            outlineOffset: '-2px',
          }}
          onClick={create}
        >
          <HStack gap={1.5}>
            <LuPlus size={13} />
            <Text as="span">Créer «&nbsp;{trimmed}&nbsp;»</Text>
          </HStack>
        </Box>
      )}
    </VStack>
  );

  return (
    <Container maxW="container.xl" py={6}>
      <VStack gap={4} align="stretch">
        <HStack justify="space-between" align="baseline" gap={3}>
          <Text fontSize="lg" fontWeight="bold">
            Mes exercices
          </Text>
          <Text fontSize="xs" color="fg.muted" flexShrink={0}>
            {filtered.length} exercice{filtered.length !== 1 ? 's' : ''}
            {query && ` · « ${query} »`}
          </Text>
        </HStack>

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
            placeholder="Chercher ou créer un exercice…"
            aria-label="Chercher un exercice"
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
            >
              <LuX size={13} />
            </Box>
          )}
        </HStack>

        {isLoading ? (
          <ExerciseSectionSkeleton titleWidth="250px" count={8} />
        ) : filtered.length === 0 && !canCreate ? (
          <Box py={16} textAlign="center" color="fg.muted" fontSize="sm">
            Aucun exercice — tapez un nom pour en créer un
          </Box>
        ) : (
          <>
            <Grid
              templateColumns={{
                base: '1fr',
                lg: '1fr 380px',
                xl: '1fr 460px',
              }}
              gap={{ base: 0, lg: 8 }}
              alignItems="start"
            >
              <Box minW={0}>{list}</Box>

              {isDesktop && (
                <Box
                  position="sticky"
                  top="80px"
                  alignSelf="start"
                  minW={0}
                  pt={4}
                  borderLeftWidth="2px"
                  borderLeftColor={selected ? 'app.primary' : 'whiteAlpha.200'}
                  pl={5}
                >
                  {selected ? (
                    sheet
                  ) : (
                    <Text fontSize="sm" color="fg.muted">
                      Choisissez un exercice pour voir et modifier sa fiche.
                    </Text>
                  )}
                </Box>
              )}
            </Grid>

            {/* Index alphabétique mobile — portail fixe, toujours visible */}
            {!isDesktop &&
              letters.length > 1 &&
              createPortal(
                <Box
                  position="fixed"
                  right={3}
                  top="50%"
                  style={{ transform: 'translateY(-50%)' }}
                  zIndex={1000}
                  bg="blackAlpha.700"
                  backdropFilter="blur(6px)"
                  borderRadius="full"
                  py={2}
                  px={1.5}
                >
                  <VStack gap={0}>
                    {letters.map((letter) => (
                      <Box
                        key={letter}
                        as="button"
                        aria-label={`Aller à la lettre ${letter}`}
                        onClick={() => scrollToLetter(letter)}
                        fontSize="9px"
                        fontWeight="bold"
                        color="whiteAlpha.800"
                        px={1}
                        lineHeight="1.6"
                        _hover={{ color: 'app.primary' }}
                        userSelect="none"
                      >
                        {letter}
                      </Box>
                    ))}
                  </VStack>
                </Box>,
                document.body
              )}
          </>
        )}
      </VStack>

      {/* Sous 1024 px la fiche s'ouvre en tiroir : la même fiche, pas un
          second écran avec ses propres règles. */}
      <Drawer.Root
        open={!isDesktop && !!selected}
        onOpenChange={(e) => !e.open && closeSheet()}
        size="full"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content bg="bg.canvas">
              <Drawer.Body p={5}>{sheet}</Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      <Dialog.Root
        role="alertdialog"
        open={!!pendingDeletion}
        onOpenChange={(e) => !e.open && setPendingDeletion(null)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content
              bg="bg.canvas"
              borderColor="whiteAlpha.100"
              borderWidth="1px"
              maxW="sm"
            >
              <Dialog.Header>
                <Dialog.Title>Supprimer cet exercice ?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text color="fg.muted" fontSize="sm">
                  «&nbsp;{pendingDeletion?.name}&nbsp;» sera retiré de votre
                  bibliothèque. Cette action est définitive.
                </Text>
              </Dialog.Body>
              <Dialog.Footer gap={2} flexWrap="wrap">
                <Button
                  variant="ghost"
                  color="fg.muted"
                  onClick={() => setPendingDeletion(null)}
                >
                  Conserver
                </Button>
                <Button
                  bg="app.error"
                  color="bg.canvas"
                  fontWeight="bold"
                  onClick={confirmDeletion}
                  loading={deleteMutation.isPending}
                >
                  Supprimer
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Container>
  );
};

export default Exercises;
