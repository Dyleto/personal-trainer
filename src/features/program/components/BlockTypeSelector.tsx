import { BlockType } from "@/types";
import {
  BLOCK_TYPE_CONFIG,
  BLOCK_TYPES_ORDERED,
  getBlockDescription,
} from "@/constants/blockTypes";
import { Box, Grid, HStack, Text, VStack } from "@chakra-ui/react";

interface BlockTypeSelectorProps {
  onSelect: (type: BlockType) => void;
}

export const BlockTypeSelector = ({ onSelect }: BlockTypeSelectorProps) => (
  <Grid
    templateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" }}
    gap={2}
  >
    {BLOCK_TYPES_ORDERED.map((type) => {
      const { label, color } = BLOCK_TYPE_CONFIG[type];
      return (
        <Box
          key={type}
          as="button"
          p={3}
          borderRadius="lg"
          bg={`${color}12`}
          borderWidth="1px"
          borderColor={`${color}30`}
          onClick={() => onSelect(type)}
          _hover={{ bg: `${color}25`, borderColor: `${color}60` }}
          transition="all 0.15s"
          textAlign="left"
          minH="72px"
        >
          <VStack align="start" gap={1}>
            <HStack gap={2}>
              <Box w="8px" h="8px" borderRadius="full" bg={color} flexShrink={0} />
              <Text fontSize="sm" fontWeight="bold" color={color} lineHeight="shorter">
                {label}
              </Text>
            </HStack>
            <Text fontSize="2xs" color="gray.500" lineHeight="shorter">
              {getBlockDescription(type)}
            </Text>
          </VStack>
        </Box>
      );
    })}
  </Grid>
);
