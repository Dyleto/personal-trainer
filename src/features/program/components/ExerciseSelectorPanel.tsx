import {
  Box,
  Button,
  Drawer,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useCreateExercise } from '@/features/exercise/hooks/useExerciseMutations';
import { useExerciseFilter } from '@/features/exercise/hooks/useExerciseFilter';
import { useExercises } from '@/features/exercise/hooks/useExercises';
import { Exercise } from '@/types';
import { useMemo, useState } from 'react';
import { LuDumbbell, LuLibrary, LuPlus, LuSearch, LuX } from 'react-icons/lu';
import { Heading } from '@chakra-ui/react';
import { ExerciseEditor, ExerciseLibraryCard } from '@/features/exercise';

interface ExerciseSelectorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
}

export const ExerciseSelectorPanel = ({
  isOpen,
  onClose,
  onSelect,
}: ExerciseSelectorPanelProps) => {
  const { data: exercises = [], isLoading } = useExercises();
  const [searchQuery, setSearchQuery] = useState('');
  const [onCreateMode, setOnCreateMode] = useState(false);

  const createMutation = useCreateExercise();
  const filteredExercises = useExerciseFilter(exercises, searchQuery);

  // 5 exercices les plus récents (pour accès rapide)
  const recentExercises = useMemo(
    () =>
      [...exercises]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [exercises]
  );

  const handleSave = (exercise: Partial<Exercise>) => {
    createMutation.mutate(exercise, {
      onSuccess: (response) => {
        onSelect(response.data);
        setOnCreateMode(false);
      },
    });
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      size={{ base: 'full', md: 'md', lg: 'lg', xl: 'xl' }}
      modal={false}
      preventScroll={false}
    >
      <Drawer.Positioner pointerEvents="none">
        <Drawer.Content bg="bg.canvas">
          {/* Header */}
          <Drawer.Header borderBottomWidth="1px" borderColor="whiteAlpha.100">
            <HStack justify="space-between" align="center">
              <HStack gap={2}>
                {onCreateMode ? (
                  <LuDumbbell
                    size={20}
                    color="var(--chakra-colors-app-primary)"
                  />
                ) : (
                  <LuLibrary
                    size={20}
                    color="var(--chakra-colors-app-primary)"
                  />
                )}
                <Heading size="lg">
                  {onCreateMode ? 'Créer un exercice' : 'Mes exercices'}
                </Heading>
              </HStack>
              <HStack gap={2}>
                {onCreateMode ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setOnCreateMode(false)}
                  >
                    Annuler
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    bg="app.primary"
                    color="black"
                    fontWeight="semibold"
                    _hover={{ bg: 'app.primary.hover' }}
                    onClick={() => setOnCreateMode(true)}
                  >
                    <LuPlus />
                    Créer
                  </Button>
                )}
                <Drawer.CloseTrigger asChild>
                  <Button size="sm" variant="ghost" onClick={onClose}>
                    <LuX />
                  </Button>
                </Drawer.CloseTrigger>
              </HStack>
            </HStack>
          </Drawer.Header>

          <Drawer.Body p={4}>
            {onCreateMode ? (
              <ExerciseEditor
                onSave={handleSave}
                onCancel={() => setOnCreateMode(false)}
              />
            ) : (
              <VStack gap={4} align="stretch" h="full">
                {/* Recherche */}
                <HStack
                  bg="surface.card"
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor="surface.card"
                  px={3}
                  _focusWithin={{ borderColor: 'app.primary' }}
                  transition="border-color 0.2s ease"
                >
                  <LuSearch size={14} color="gray" />
                  <Input
                    placeholder="Rechercher un exercice..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    border="none"
                    _focus={{ boxShadow: 'none' }}
                    size="sm"
                  />
                  {searchQuery && (
                    <Box
                      cursor="pointer"
                      color="fg.muted"
                      _hover={{ color: 'fg.muted' }}
                      onClick={() => setSearchQuery('')}
                      flexShrink={0}
                    >
                      <LuX size={12} />
                    </Box>
                  )}
                </HStack>

                {isLoading ? (
                  <Box textAlign="center" py={10}>
                    <Spinner />
                  </Box>
                ) : isSearching ? (
                  /* Résultats de recherche */
                  <VStack gap={1.5} align="stretch">
                    <Text fontSize="xs" color="fg.muted" px={1}>
                      {filteredExercises.length} résultat
                      {filteredExercises.length !== 1 ? 's' : ''}
                    </Text>
                    {filteredExercises.length === 0 ? (
                      <Box
                        py={8}
                        textAlign="center"
                        color="fg.muted"
                        fontSize="sm"
                      >
                        Aucun exercice pour « {searchQuery} »
                      </Box>
                    ) : (
                      filteredExercises.map((exercise) => (
                        <ExerciseLibraryCard
                          key={exercise._id}
                          exercise={exercise}
                          horizontal
                          onClick={() => onSelect(exercise)}
                        />
                      ))
                    )}
                  </VStack>
                ) : (
                  /* Vue par défaut : récents + tous */
                  <VStack gap={5} align="stretch">
                    {/* Récemment ajoutés */}
                    {recentExercises.length > 0 && (
                      <VStack gap={2} align="stretch">
                        <Text
                          fontSize="xs"
                          fontWeight="bold"
                          color="fg.muted"
                          letterSpacing="wider"
                          textTransform="uppercase"
                          px={1}
                        >
                          Récemment ajoutés
                        </Text>
                        {recentExercises.map((exercise) => (
                          <ExerciseLibraryCard
                            key={exercise._id}
                            exercise={exercise}
                            horizontal
                            onClick={() => onSelect(exercise)}
                          />
                        ))}
                      </VStack>
                    )}

                    {/* Tous les exercices */}
                    <VStack gap={2} align="stretch">
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        color="fg.muted"
                        letterSpacing="wider"
                        textTransform="uppercase"
                        px={1}
                      >
                        Tous les exercices ({exercises.length})
                      </Text>
                      {exercises.length === 0 ? (
                        <Box
                          py={8}
                          textAlign="center"
                          color="fg.muted"
                          fontSize="sm"
                        >
                          Aucun exercice — créez votre premier exercice
                        </Box>
                      ) : (
                        [...exercises]
                          .sort((a, b) =>
                            a.name.localeCompare(b.name, 'fr', {
                              sensitivity: 'base',
                            })
                          )
                          .map((exercise) => (
                            <ExerciseLibraryCard
                              key={exercise._id}
                              exercise={exercise}
                              horizontal
                              onClick={() => onSelect(exercise)}
                            />
                          ))
                      )}
                    </VStack>
                  </VStack>
                )}
              </VStack>
            )}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
