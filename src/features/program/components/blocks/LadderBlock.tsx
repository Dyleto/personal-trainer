import { Box, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { NumField } from "./shared/NumField";
import { BlockShell } from "./shared/BlockShell";
import { BlockProps } from "./shared/types";
import { getBlockColor } from "@/constants/blockTypes";

export const LadderBlock = (props: BlockProps) => {
  const { block, isEditing, onUpdate } = props;
  const color = getBlockColor(block.type);

  return (
    <BlockShell
      {...props}
      configNode={
        isEditing && (
          <VStack align="stretch" gap={2}>
            <VStack align="start" gap={1}>
              <Text
                fontSize="2xs"
                color="gray.500"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Paliers (ex: 5, 10, 15, 20)
              </Text>
              <Input
                size="sm"
                value={(block.repsScheme || []).join(", ")}
                bg="whiteAlpha.100"
                borderColor="whiteAlpha.200"
                _focus={{ borderColor: `${color}60` }}
                borderRadius="md"
                onChange={(e) => {
                  const vals = e.target.value
                    .split(/[,\s]+/)
                    .map((v) => parseInt(v.trim()))
                    .filter((v) => !isNaN(v) && v > 0);
                  onUpdate?.({ repsScheme: vals });
                }}
              />
            </VStack>
            <NumField
              label="Repos entre paliers (sec)"
              value={block.restBetweenRounds}
              onChange={(v) => onUpdate?.({ restBetweenRounds: v })}
            />
          </VStack>
        )
      }
      footerNode={
        !isEditing &&
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
        )
      }
    />
  );
};
