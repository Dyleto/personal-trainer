import { ReactNode } from "react";
import {
  Box,
  HStack,
  IconButton,
  Input,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { Button } from "@chakra-ui/react";
import {
  getBlockColor,
  getBlockConfigSummary,
  getBlockDescription,
  getBlockLabel,
} from "@/constants/blockTypes";
import { AutoResizeTextarea } from "@/components/AutoResizeTextarea";
import {
  BlockExerciseEdit,
  BlockExerciseView,
} from "@/features/program/components/BlockExerciseCard";
import { BlockProps } from "./types";

interface BlockShellProps extends BlockProps {
  /** Config inputs affichés en mode édition (sous le header) */
  configNode?: ReactNode;
  /** Contenu affiché en bas de la card en mode lecture (ex: badges repsScheme) */
  footerNode?: ReactNode;
}

export const BlockShell = ({
  block,
  isEditing = false,
  configNode,
  footerNode,
  onUpdate,
  onRemove,
  onAddExercise,
  onRemoveExercise,
  onUpdateExercise,
}: BlockShellProps) => {
  const color = getBlockColor(block.type);
  const description = getBlockDescription(block.type);

  return (
    <Box
      borderRadius={isEditing ? "xl" : "lg"}
      overflow="hidden"
      borderWidth="1px"
      borderColor={isEditing ? `${color}30` : "whiteAlpha.100"}
    >
      {/* ── Header ── */}
      <Box px={4} py={isEditing ? 3 : 2.5} bg={isEditing ? `${color}18` : `${color}15`}>
        {isEditing ? (
          <VStack align="stretch" gap={1}>
            <HStack justify="space-between" gap={2}>
              <HStack gap={2} flex={1} minW={0}>
                <Box w="8px" h="8px" borderRadius="full" bg={color} flexShrink={0} />
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color={color}
                  textTransform="uppercase"
                  letterSpacing="wider"
                  flexShrink={0}
                >
                  {getBlockLabel(block.type)}
                </Text>
                <Input
                  size="xs"
                  value={block.label || ""}
                  onChange={(e) => onUpdate?.({ label: e.target.value || undefined })}
                  placeholder="Nom personnalisé (optionnel)"
                  bg="blackAlpha.300"
                  borderColor="whiteAlpha.100"
                  _focus={{ borderColor: `${color}50` }}
                  borderRadius="md"
                  fontSize="xs"
                  color="gray.300"
                />
              </HStack>
              <IconButton
                aria-label="Supprimer le bloc"
                size="xs"
                variant="ghost"
                color="gray.500"
                _hover={{ color: "red.400" }}
                onClick={onRemove}
              >
                <LuTrash2 size={14} />
              </IconButton>
            </HStack>
            <Text fontSize="2xs" color="gray.500" lineHeight="shorter">
              {description}
            </Text>
          </VStack>
        ) : (
          <HStack justify="space-between" gap={2} align="start">
            <HStack gap={2} align="start">
              <Box w="8px" h="8px" borderRadius="full" bg={color} flexShrink={0} mt="3px" />
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color={color}
                  textTransform="uppercase"
                  letterSpacing="wider"
                  lineHeight="shorter"
                >
                  {block.label || getBlockLabel(block.type)}
                </Text>
                <Text fontSize="2xs" color="gray.500" lineHeight="shorter" mt="2px">
                  {description}
                </Text>
              </Box>
            </HStack>
            {getBlockConfigSummary(block) && (
              <Text fontSize="xs" color="gray.500" flexShrink={0}>
                {getBlockConfigSummary(block)}
              </Text>
            )}
          </HStack>
        )}
      </Box>

      {/* ── Body ── */}
      {isEditing ? (
        <VStack align="stretch" gap={0} p={3}>
          {configNode}

          {block.exercises.length > 0 && (
            <VStack align="stretch" gap={2} mt={configNode ? 3 : 0}>
              {block.exercises.map((ex, i) => (
                <BlockExerciseEdit
                  key={i}
                  exercise={ex}
                  blockType={block.type}
                  onUpdate={(updates) => onUpdateExercise?.(i, updates)}
                  onRemove={() => onRemoveExercise?.(i)}
                />
              ))}
            </VStack>
          )}

          <Button
            size="sm"
            variant="ghost"
            color={color}
            borderWidth="1px"
            borderColor={`${color}30`}
            borderStyle="dashed"
            borderRadius="lg"
            mt={3}
            onClick={onAddExercise}
            _hover={{ bg: `${color}10` }}
            w="full"
          >
            <LuPlus size={14} />
            Ajouter un exercice
          </Button>

          <AutoResizeTextarea
            mt={3}
            value={block.notes || ""}
            onChange={(e) => onUpdate?.({ notes: e.target.value || undefined })}
            placeholder="Notes pour ce bloc (consignes, tempo, intensité...)"
            size="sm"
            fontSize="xs"
            bg="whiteAlpha.50"
            borderColor="whiteAlpha.100"
            _focus={{ borderColor: `${color}50` }}
            borderRadius="md"
            color="gray.300"
          />
        </VStack>
      ) : (
        <>
          {block.exercises.length > 0 ? (
            <VStack align="stretch" gap={0} px={4} divideY="1px">
              {block.exercises.map((ex, i) => (
                <BlockExerciseView key={i} exercise={ex} blockType={block.type} />
              ))}
            </VStack>
          ) : (
            <Box px={4} py={3}>
              <Text fontSize="sm" color="gray.600">Aucun exercice</Text>
            </Box>
          )}

          {block.notes && (
            <Box px={4} py={2.5} borderTopWidth="1px" borderColor="whiteAlpha.100">
              <Text fontSize="xs" color="gray.500" whiteSpace="pre-wrap">
                {block.notes}
              </Text>
            </Box>
          )}

          {footerNode && (
            <>
              <Separator borderColor="whiteAlpha.100" />
              {footerNode}
            </>
          )}
        </>
      )}
    </Box>
  );
};
