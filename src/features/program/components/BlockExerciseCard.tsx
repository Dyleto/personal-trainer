import { BlockExercise, BlockType } from "@/types";
import {
  blockDefinesOwnMetrics,
  blockSupportsRepsOnly,
  blockSupportsSets,
  getBlockColor,
} from "@/constants/blockTypes";
import { formatDuration } from "@/utils/formatters";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  NumberInput,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuChevronDown, LuChevronUp, LuTrash2, LuVideo } from "react-icons/lu";
import VideoPlayer from "@/components/VideoPlayer";
import { useState, useEffect } from "react";

// ─── Metric display helper ────────────────────────────────────────────────────

export const formatExerciseMetric = (
  ex: BlockExercise,
  blockType: BlockType,
): string => {
  const effort = ex.reps
    ? `${ex.reps} reps`
    : ex.duration
      ? formatDuration(ex.duration)
      : ex.customMetric
        ? `${ex.customMetric.value} ${ex.customMetric.unit}`
        : "";

  if (!effort) return "";
  if (blockSupportsSets(blockType) && ex.sets && ex.sets > 1) {
    return `${ex.sets} × ${effort}`;
  }
  return effort;
};

// ─── View mode ────────────────────────────────────────────────────────────────

interface ViewProps {
  exercise: BlockExercise;
  blockType: BlockType;
}

export const BlockExerciseView = ({ exercise, blockType }: ViewProps) => {
  const metric = formatExerciseMetric(exercise, blockType);
  const color = getBlockColor(blockType);
  const rest =
    blockSupportsSets(blockType) &&
    (exercise.sets ?? 1) > 1 &&
    exercise.restBetweenSets
      ? `${exercise.restBetweenSets}s repos`
      : null;

  const ex = exercise.exercise;
  const hasDescription = !!ex.description?.trim();
  const hasVideo = !!ex.videoUrl?.trim();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box>
      {/* Ligne principale — toujours cliquable */}
      <HStack
        justify="space-between"
        py={2.5}
        gap={3}
        align="center"
        onClick={() => setIsOpen((v) => !v)}
        cursor="pointer"
        _hover={{ opacity: 0.85 }}
        transition="opacity 0.1s"
      >
        <HStack gap={2} flex={1} minW={0}>
          <Box w="5px" h="5px" borderRadius="full" bg={color} flexShrink={0} opacity={0.7} />
          <Text fontSize="sm" color="gray.300" lineClamp={1} flex={1} minW={0}>
            {ex.name}
          </Text>
          {hasVideo && (
            <Box color="blue.400" flexShrink={0} opacity={0.6}>
              <LuVideo size={11} />
            </Box>
          )}
        </HStack>

        <HStack gap={2} flexShrink={0}>
          {(metric || rest) && (
            <VStack gap={0.5} align="end">
              {metric && <Text fontSize="sm" color="gray.500">{metric}</Text>}
              {rest  && <Text fontSize="xs" color="gray.600">{rest}</Text>}
            </VStack>
          )}
          <Box
            color="gray.600"
            transition="transform 0.2s"
            transform={isOpen ? "rotate(180deg)" : "none"}
          >
            <LuChevronDown size={14} />
          </Box>
        </HStack>
      </HStack>

      {/* Détail dépliable */}
      {isOpen && (
        <Box pt={2} pb={3} borderTopWidth="1px" borderColor="whiteAlpha.100">
          <VStack align="stretch" gap={3}>
            {hasDescription ? (
              <Text fontSize="xs" color="gray.400" lineHeight="tall" whiteSpace="pre-wrap">
                {ex.description}
              </Text>
            ) : (
              !hasVideo && (
                <Text fontSize="xs" color="gray.600" fontStyle="italic">
                  Aucune description pour cet exercice.
                </Text>
              )
            )}
            {hasVideo && <VideoPlayer url={ex.videoUrl!} />}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

// ─── Edit mode ────────────────────────────────────────────────────────────────

type MetricMode = "reps" | "duration" | "custom";

interface EditProps {
  exercise: BlockExercise;
  blockType: BlockType;
  onUpdate: (updates: Partial<Omit<BlockExercise, "exercise">>) => void;
  onRemove: () => void;
}

const NumInput = ({
  value,
  min = 0,
  onChange,
  w = "68px",
  label,
}: {
  value?: number;
  min?: number;
  onChange: (v: number) => void;
  w?: string;
  label?: string;
}) => {
  const [local, setLocal] = useState(value != null ? String(value) : "");

  useEffect(() => {
    setLocal(value != null ? String(value) : "");
  }, [value]);

  return (
    <VStack gap={0} align="center">
      <NumberInput.Root
        size="xs"
        width={w}
        value={local}
        min={min}
        variant="subtle"
        onValueChange={(e) => {
          setLocal(e.value);
          const n = parseInt(e.value);
          if (!isNaN(n)) onChange(n);
        }}
        onBlur={() => {
          if (local === "" || isNaN(parseInt(local))) {
            setLocal("0");
            onChange(0);
          }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <NumberInput.Input
          textAlign="center"
          bg="whiteAlpha.100"
          _focus={{ bg: "whiteAlpha.200" }}
          px={1}
          h="30px"
          borderRadius="md"
        />
        <NumberInput.Control>
          <NumberInput.IncrementTrigger />
          <NumberInput.DecrementTrigger />
        </NumberInput.Control>
      </NumberInput.Root>
      {label && (
        <Text fontSize="2xs" color="gray.600" mt={0.5}>
          {label}
        </Text>
      )}
    </VStack>
  );
};

export const BlockExerciseEdit = ({
  exercise,
  blockType,
  onUpdate,
  onRemove,
}: EditProps) => {
  const supportsSets = blockSupportsSets(blockType);
  const metricsDefinedByBlock = blockDefinesOwnMetrics(blockType);
  const repsOnly = blockSupportsRepsOnly(blockType);
  const color = getBlockColor(blockType);

  const [mode, setModeState] = useState<MetricMode>(() =>
    exercise.duration ? "duration" : exercise.customMetric ? "custom" : "reps",
  );

  const setMode = (newMode: MetricMode) => {
    setModeState(newMode);
    if (newMode === "reps")
      onUpdate({ reps: 10, duration: undefined, customMetric: undefined });
    if (newMode === "duration")
      onUpdate({ duration: 30, reps: undefined, customMetric: undefined });
    if (newMode === "custom")
      onUpdate({
        customMetric: { value: 100, unit: "m" },
        reps: undefined,
        duration: undefined,
      });
  };

  return (
    <Box
      p={3}
      bg="whiteAlpha.50"
      borderRadius="md"
      borderWidth="1px"
      borderColor="whiteAlpha.100"
    >
      <VStack align="stretch" gap={2}>
        {/* Exercise name + delete */}
        <HStack justify="space-between">
          <Text
            fontSize="sm"
            color="gray.300"
            fontWeight="medium"
            lineClamp={1}
            flex={1}
          >
            {exercise.exercise.name}
          </Text>
          <IconButton
            aria-label="Supprimer"
            size="xs"
            variant="ghost"
            color="gray.500"
            _hover={{ color: "red.400" }}
            onClick={onRemove}
          >
            <LuTrash2 size={13} />
          </IconButton>
        </HStack>

        {/* Reps cibles uniquement (tabata / onoff) */}
        {repsOnly && (
          <HStack gap={2} align="center">
            <NumInput
              value={exercise.reps}
              label="reps"
              onChange={(v) => onUpdate({ reps: v })}
            />
            <Text fontSize="xs" color="gray.500" pb={4}>
              reps cibles
            </Text>
          </HStack>
        )}

        {/* Métriques complètes */}
        {!metricsDefinedByBlock && !repsOnly && (
          <>
            <HStack
              bg="blackAlpha.400"
              p="2px"
              borderRadius="md"
              w="fit-content"
              borderWidth="1px"
              borderColor="whiteAlpha.100"
              gap={0}
            >
              {(["reps", "duration", "custom"] as MetricMode[]).map((m) => (
                <Box
                  key={m}
                  as="button"
                  px={2.5}
                  py={1}
                  borderRadius="sm"
                  bg={mode === m ? "whiteAlpha.200" : "transparent"}
                  color={mode === m ? "white" : "gray.500"}
                  fontSize="xs"
                  fontWeight="medium"
                  onClick={() => setMode(m)}
                  _hover={{
                    bg: mode === m ? "whiteAlpha.300" : "whiteAlpha.50",
                  }}
                  transition="all 0.15s"
                >
                  {m === "reps" ? "Reps" : m === "duration" ? "Durée" : "Mesure"}
                </Box>
              ))}
            </HStack>

            <Flex gap={2} align="flex-end" flexWrap="wrap">
              {supportsSets && (
                <>
                  <NumInput
                    value={exercise.sets}
                    min={1}
                    label="séries"
                    onChange={(v) => onUpdate({ sets: v })}
                  />
                  <Text pb={4} color="gray.500" fontSize="sm">
                    ×
                  </Text>
                </>
              )}

              {mode === "reps" && (
                <NumInput
                  value={exercise.reps}
                  label="reps"
                  onChange={(v) => onUpdate({ reps: v })}
                />
              )}

              {mode === "duration" && (
                <NumInput
                  value={exercise.duration}
                  label="secondes"
                  w="72px"
                  onChange={(v) => onUpdate({ duration: v })}
                />
              )}

              {mode === "custom" && (
                <HStack gap={2} align="flex-end">
                  <NumInput
                    value={exercise.customMetric?.value}
                    label="valeur"
                    w="72px"
                    onChange={(v) =>
                      onUpdate({
                        customMetric: {
                          value: v,
                          unit: exercise.customMetric?.unit || "m",
                        },
                      })
                    }
                  />
                  <Box pb={4}>
                    <input
                      value={exercise.customMetric?.unit || ""}
                      onChange={(e) =>
                        onUpdate({
                          customMetric: {
                            value: exercise.customMetric?.value || 0,
                            unit: e.target.value,
                          },
                        })
                      }
                      placeholder="unité"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "6px",
                        color: "white",
                        fontSize: "12px",
                        padding: "4px 8px",
                        width: "60px",
                        height: "30px",
                      }}
                    />
                  </Box>
                </HStack>
              )}
            </Flex>

            {supportsSets && (exercise.sets || 1) > 1 && (
              <HStack
                gap={2}
                align="center"
                borderTopWidth="1px"
                borderColor="whiteAlpha.100"
                pt={2}
              >
                <Text fontSize="xs" color="gray.500">
                  Repos entre séries :
                </Text>
                <NumInput
                  value={exercise.restBetweenSets}
                  label="sec"
                  w="60px"
                  onChange={(v) => onUpdate({ restBetweenSets: v })}
                />
              </HStack>
            )}
          </>
        )}

        {/* Color accent line */}
        <Box h="2px" borderRadius="full" bg={`${color}40`} mt={1} />
      </VStack>
    </Box>
  );
};
