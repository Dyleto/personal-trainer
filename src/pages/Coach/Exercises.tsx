import { ExerciseSectionSkeleton } from "@/components/skeletons";
import { SlidePanel } from "@/components/SlidePanel";
import { useExerciseFilter } from "@/features/exercise/hooks/useExerciseFilter";
import { useExercises } from "@/features/exercise/hooks/useExercises";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useToastError } from "@/hooks/useToastError";
import { Exercise } from "@/types";
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Input,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import {
  LuArrowLeft,
  LuExternalLink,
  LuLibrary,
  LuPencil,
  LuPlus,
  LuSearch,
  LuVideo,
  LuX,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { ExerciseLibraryCard } from "@/features/exercise";
import { getVideoEmbedUrl } from "@/utils/videoUtils";
import { stripAccents } from "@/utils/formatters";

// ─── Panneau détail (desktop) ────────────────────────────────────────────────

interface DetailPanelProps {
  exercise: Exercise;
  onClose: () => void;
  onEdit: () => void;
}

const DetailPanel = ({ exercise, onClose, onEdit }: DetailPanelProps) => {
  const colors = useThemeColors();
  const embedUrl = exercise.videoUrl ? getVideoEmbedUrl(exercise.videoUrl) : null;

  return (
    <Box
      bg="gray.800"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="gray.700"
      overflow="hidden"
    >
      {/* Bande accent */}
      <Box h="3px" bg={colors.primary} />

      <VStack gap={5} align="stretch" p={6}>
        <HStack justify="space-between" align="start">
          <Box fontSize="xl" fontWeight="bold" color="white" flex={1} mr={2}>
            {exercise.name}
          </Box>
          <Box
            cursor="pointer"
            color="gray.500"
            _hover={{ color: "white" }}
            onClick={onClose}
            flexShrink={0}
          >
            <LuX size={16} />
          </Box>
        </HStack>

        {exercise.description ? (
          <Box fontSize="sm" color="gray.400" lineHeight="tall">
            {exercise.description}
          </Box>
        ) : (
          <Box fontSize="sm" color="gray.600" fontStyle="italic">
            Aucune description
          </Box>
        )}

        {/* Vidéo intégrée ou lien de fallback */}
        {exercise.videoUrl && (
          embedUrl ? (
            <VStack gap={2} align="stretch">
              <Box
                borderRadius="lg"
                overflow="hidden"
                bg="black"
                style={{ position: "relative", paddingBottom: "56.25%" }}
              >
                <iframe
                  src={embedUrl}
                  title={`Vidéo — ${exercise.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                />
              </Box>
              <HStack
                gap={1.5}
                fontSize="xs"
                color="gray.500"
                cursor="pointer"
                _hover={{ color: "gray.300" }}
                onClick={() =>
                  window.open(exercise.videoUrl, "_blank", "noopener,noreferrer")
                }
              >
                <LuExternalLink size={11} />
                <Box>Ouvrir dans un nouvel onglet</Box>
              </HStack>
            </VStack>
          ) : (
            <HStack
              gap={2}
              color="blue.400"
              fontSize="sm"
              cursor="pointer"
              _hover={{ color: "blue.300" }}
              onClick={() =>
                window.open(exercise.videoUrl, "_blank", "noopener,noreferrer")
              }
            >
              <LuVideo size={14} />
              <Box>Voir la vidéo</Box>
            </HStack>
          )
        )}

        <Button
          size="sm"
          bg={colors.primary}
          color="black"
          fontWeight="semibold"
          _hover={{ bg: colors.primaryHover }}
          onClick={onEdit}
        >
          <LuPencil size={13} />
          Modifier
        </Button>
      </VStack>
    </Box>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────

const Exercises = () => {
  const navigate = useNavigate();
  const colors = useThemeColors();

  const { data: exercises = [], isLoading, error } = useExercises();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useToastError(error, "Impossible de charger vos exercices");

  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const filtered = useExerciseFilter(exercises, searchQuery);

  // Groupement alphabétique (les accents rejoignent leur lettre de base : É→E)
  const grouped = useMemo(() => {
    const sorted = [...filtered].sort((a, b) =>
      a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
    );
    const groups: { letter: string; exercises: Exercise[] }[] = [];
    sorted.forEach((ex) => {
      const letter = stripAccents(ex.name[0] ?? "").toUpperCase() || "#";
      const last = groups[groups.length - 1];
      if (last?.letter === letter) {
        last.exercises.push(ex);
      } else {
        groups.push({ letter, exercises: [ex] });
      }
    });
    return groups;
  }, [filtered]);

  const letters = grouped.map((g) => g.letter);

  // Refs pour le scroll vers une lettre
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollToLetter = (letter: string) => {
    sectionRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleExerciseClick = (exercise: Exercise) => {
    if (isDesktop) {
      setSelectedExercise(exercise);
    } else {
      navigate(`/coach/exercises/${exercise._id}`);
    }
  };

  // Liste alphabétique (partagée mobile/desktop)
  const alphabetList = (
    <VStack gap={0} align="stretch" pr={{ base: 9, lg: 0 }}>
      <Box fontSize="sm" color="gray.500" mb={3} px={1}>
        {filtered.length} exercice{filtered.length !== 1 ? "s" : ""}
        {searchQuery && (
          <Box as="span" color="gray.600"> · « {searchQuery} »</Box>
        )}
      </Box>

      {grouped.map(({ letter, exercises: groupExercises }) => (
        <Box
          key={letter}
          ref={(el: HTMLDivElement | null) => {
            sectionRefs.current[letter] = el;
          }}
        >
          <Box
            position="sticky"
            top={0}
            zIndex={1}
            bg="bg.canvas"
            py={2}
            px={1}
          >
            <Text
              fontSize="xs"
              fontWeight="bold"
              color={colors.primary}
              letterSpacing="wider"
              textTransform="uppercase"
            >
              {letter}
            </Text>
          </Box>
          <VStack gap={1.5} align="stretch" mb={4}>
            {groupExercises.map((exercise) => (
              <ExerciseLibraryCard
                key={exercise._id}
                exercise={exercise}
                horizontal
                selected={selectedExercise?._id === exercise._id}
                onClick={() => handleExerciseClick(exercise)}
              />
            ))}
          </VStack>
        </Box>
      ))}
    </VStack>
  );

  return (
    <SlidePanel onClose={() => navigate("/coach")}>
      {(handleClose) => (
        <Container maxW="container.xl" py={6}>
          <VStack gap={6} align="stretch">
            {/* Header */}
            <HStack justify="space-between" align="center">
              <HStack gap={3}>
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  <LuArrowLeft />
                  Retour
                </Button>
                <HStack gap={2}>
                  <LuLibrary size={20} color={colors.primaryHex} />
                  <Heading size="lg">Mes exercices</Heading>
                </HStack>
              </HStack>
              <Button
                size="sm"
                bg={colors.primary}
                color="black"
                fontWeight="semibold"
                _hover={{ bg: colors.primaryHover }}
                onClick={() => navigate("/coach/exercises/new")}
              >
                <LuPlus />
                Créer
              </Button>
            </HStack>

            {/* Barre de recherche */}
            <HStack
              bg="gray.800"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="gray.700"
              px={4}
              _focusWithin={{ borderColor: colors.primary }}
              transition="border-color 0.2s ease"
            >
              <LuSearch size={16} color="gray" />
              <Input
                placeholder="Rechercher un exercice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                border="none"
                _focus={{ boxShadow: "none" }}
              />
              {searchQuery && (
                <Box
                  cursor="pointer"
                  color="gray.500"
                  _hover={{ color: "gray.300" }}
                  onClick={() => setSearchQuery("")}
                  flexShrink={0}
                >
                  <LuX size={14} />
                </Box>
              )}
            </HStack>

            {/* Contenu */}
            {isLoading ? (
              <ExerciseSectionSkeleton titleWidth="250px" count={8} />
            ) : filtered.length === 0 ? (
              <Box
                py={16}
                textAlign="center"
                color="gray.600"
                fontSize="sm"
                borderRadius="xl"
                borderWidth="1px"
                borderStyle="dashed"
                borderColor="gray.700"
              >
                {searchQuery
                  ? `Aucun exercice pour « ${searchQuery} »`
                  : "Aucun exercice — créez votre premier exercice"}
              </Box>
            ) : (
              <>
                <Grid
                  templateColumns={{ base: "1fr", lg: "1fr 320px" }}
                  gap={{ base: 0, lg: 8 }}
                  alignItems="start"
                >
                  {/* Liste alphabétique */}
                  {alphabetList}

                  {/* Panneau détail (desktop uniquement) */}
                  {isDesktop && (
                    <Box position="sticky" top="80px" alignSelf="start">
                      {selectedExercise ? (
                        <DetailPanel
                          exercise={selectedExercise}
                          onClose={() => setSelectedExercise(null)}
                          onEdit={() => navigate(`/coach/exercises/${selectedExercise._id}`)}
                        />
                      ) : (
                        <Box
                          bg="gray.800"
                          borderRadius="xl"
                          borderWidth="1px"
                          borderStyle="dashed"
                          borderColor="gray.700"
                          p={8}
                          textAlign="center"
                          color="gray.600"
                          fontSize="sm"
                        >
                          Sélectionnez un exercice pour voir ses détails
                        </Box>
                      )}
                    </Box>
                  )}
                </Grid>

                {/* Index alphabétique mobile — portail fixe, toujours visible */}
                {!isDesktop && letters.length > 1 && createPortal(
                  <Box
                    position="fixed"
                    right={3}
                    top="50%"
                    style={{ transform: "translateY(-50%)" }}
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
                          onClick={() => scrollToLetter(letter)}
                          fontSize="9px"
                          fontWeight="bold"
                          color="whiteAlpha.800"
                          cursor="pointer"
                          px={1}
                          lineHeight="1.6"
                          _hover={{ color: colors.primary }}
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
        </Container>
      )}
    </SlidePanel>
  );
};

export default Exercises;
