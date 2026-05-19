import { BlockExercise, BlockType, SessionBlock } from "@/types";
import {
  getBlockColor,
  getBlockConfigSummary,
  getBlockDescription,
  getBlockLabel,
} from "@/constants/blockTypes";
import { Box, HStack, Separator, Text, VStack } from "@chakra-ui/react";
import { BlockExerciseView, formatExerciseMetric } from "./BlockExerciseCard";

interface BlockCardProps {
  block: SessionBlock;
}

export const BlockCard = ({ block }: BlockCardProps) => {
  const color = getBlockColor(block.type);
  const label = block.label || getBlockLabel(block.type);
  const description = getBlockDescription(block.type);
  const summary = getBlockConfigSummary(block);

  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      borderWidth="1px"
      borderColor="whiteAlpha.100"
    >
      {/* Header */}
      <Box px={4} py={2.5} bg={`${color}15`}>
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
                {label}
              </Text>
              <Text fontSize="2xs" color="gray.500" lineHeight="shorter" mt="2px">
                {description}
              </Text>
            </Box>
          </HStack>
          {summary && (
            <Text fontSize="xs" color="gray.500" flexShrink={0}>
              {summary}
            </Text>
          )}
        </HStack>
      </Box>

      {/* Exercises */}
      {block.exercises.length > 0 ? (
        <VStack align="stretch" gap={0} px={4} divideY="1px">
          {block.exercises.map((ex, i) => (
            <BlockExerciseView key={i} exercise={ex} blockType={block.type} />
          ))}
        </VStack>
      ) : (
        <Box px={4} py={3}>
          <Text fontSize="sm" color="gray.600">
            Aucun exercice
          </Text>
        </Box>
      )}

      {/* Notes du bloc */}
      {block.notes && (
        <Box px={4} py={2.5} borderTopWidth="1px" borderColor="whiteAlpha.100">
          <Text fontSize="xs" color="gray.500" whiteSpace="pre-wrap">
            {block.notes}
          </Text>
        </Box>
      )}

      {/* Reps scheme for pyramid/ladder */}
      {(block.type === "pyramid" || block.type === "ladder") &&
        block.repsScheme &&
        block.repsScheme.length > 0 && (
          <Box px={4} py={2} bg="whiteAlpha.50">
            <HStack gap={1} flexWrap="wrap">
              {block.repsScheme.map((reps, i) => (
                <Box
                  key={i}
                  px={2}
                  py={0.5}
                  borderRadius="md"
                  bg={`${color}20`}
                  borderWidth="1px"
                  borderColor={`${color}40`}
                >
                  <Text fontSize="xs" fontWeight="bold" color={color}>
                    {reps}
                  </Text>
                </Box>
              ))}
            </HStack>
          </Box>
        )}
    </Box>
  );
};
