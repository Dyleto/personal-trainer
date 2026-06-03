import {
  Box,
  Drawer,
  HStack,
  IconButton,
  Portal,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CompletedSession, BlockExercise, SessionBlock, Exercise, BlockType } from "@/types";
import { useThemeColors } from "@/hooks/useThemeColors";
import { METRICS_CONFIG } from "@/constants/metricsConfig";
import { MetricStars } from "./MetricStars";
import { BlockCard } from "@/features/program/components/BlockCard";
import { LuX } from "react-icons/lu";

// Cast les snapshots en types vifs pour réutiliser BlockCard (view mode)
const toSessionBlock = (block: CompletedSession["blocks"][number], index: number): SessionBlock => ({
  _id: `snap-${index}`,
  type: block.type as BlockType,
  label: block.label,
  order: block.order,
  notes: block.notes,
  durationMinutes: block.durationMinutes,
  intervalMinutes: block.intervalMinutes,
  rounds: block.rounds,
  restBetweenRounds: block.restBetweenRounds,
  workDuration: block.workDuration,
  restDuration: block.restDuration,
  repsScheme: block.repsScheme,
  exercises: block.exercises.map((ex) => ({
    exercise: ex.exercise as unknown as Exercise,
    order: ex.order,
    sets: ex.sets,
    restBetweenSets: ex.restBetweenSets,
    reps: ex.reps,
    duration: ex.duration,
    customMetric: ex.customMetric,
  }) satisfies BlockExercise),
});

interface CompletedSessionDrawerProps {
  completed: CompletedSession;
  isOpen: boolean;
  onClose: () => void;
}

export const CompletedSessionDrawer = ({
  completed,
  isOpen,
  onClose,
}: CompletedSessionDrawerProps) => {
  const colors = useThemeColors();

  const completedDate = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(completed.completedAt));

  const blocks = completed.blocks.map(toSessionBlock);

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      size={{ base: "full", md: "md", lg: "lg" }}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg="gray.900">
            {/* Header */}
            <Drawer.Header borderBottomWidth="1px" borderColor="whiteAlpha.100">
              <HStack justify="space-between" align="center" flex="1">
                <VStack align="start" gap={0}>
                  <Text fontWeight="bold" fontSize="lg">
                    Séance {completed.sessionOrder}
                  </Text>
                  <Text fontSize="xs" color="gray.500" textTransform="capitalize">
                    {completedDate}
                  </Text>
                </VStack>
                <IconButton
                  aria-label="Fermer"
                  size="sm"
                  variant="ghost"
                  color="gray.500"
                  _hover={{ color: "white", bg: "whiteAlpha.100" }}
                  borderRadius="full"
                  onClick={onClose}
                >
                  <LuX size={16} />
                </IconButton>
              </HStack>
            </Drawer.Header>

            <Drawer.Body p={4}>
              <VStack align="stretch" gap={5}>

                {/* Métriques */}
                <VStack align="stretch" gap={3}>
                  <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider">
                    Ressenti
                  </Text>
                  {METRICS_CONFIG.map(({ key, Icon, label }) => (
                    <MetricStars
                      key={key}
                      icon={<Icon size={16} color={colors.primaryHex} />}
                      label={label}
                      value={completed.metrics[key]}
                      readonly
                    />
                  ))}
                </VStack>

                {/* Notes */}
                {(completed.clientNotes || completed.coachNotes) && (
                  <>
                    <Separator borderColor="whiteAlpha.100" />
                    <VStack align="stretch" gap={3}>
                      {completed.clientNotes && (
                        <Box>
                          <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={1.5}>
                            Ton commentaire
                          </Text>
                          <Text fontSize="sm" color="gray.300" fontStyle="italic">
                            "{completed.clientNotes}"
                          </Text>
                        </Box>
                      )}
                      {completed.coachNotes && (
                        <Box
                          p={3}
                          bg="whiteAlpha.50"
                          borderRadius="md"
                          borderLeft="2px solid"
                          borderLeftColor={colors.primaryBorder}
                        >
                          <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={1}>
                            Note du coach
                          </Text>
                          <Text fontSize="sm" color="gray.400" whiteSpace="pre-wrap">
                            {completed.coachNotes}
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  </>
                )}

                {/* Blocs */}
                {blocks.length > 0 && (
                  <>
                    <Separator borderColor="whiteAlpha.100" />
                    <VStack align="stretch" gap={3}>
                      <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider">
                        Contenu de la séance
                      </Text>
                      {blocks.map((block) => (
                        <BlockCard key={block._id} block={block} />
                      ))}
                    </VStack>
                  </>
                )}

              </VStack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};
