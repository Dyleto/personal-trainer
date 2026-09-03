import {
  Box,
  HStack,
  Text,
  VStack,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import { NumField } from './shared/NumField';
import { BlockShell } from './shared/BlockShell';
import { BlockProps } from './shared/types';
import { LuMinus, LuPlus } from 'react-icons/lu';

export const LadderBlock = (props: BlockProps) => {
  const { block, isEditing, onUpdate } = props;

  return (
    <BlockShell
      {...props}
      configNode={
        isEditing && (
          <VStack align="stretch" gap={2}>
            <VStack align="start" gap={1}>
              <Text
                fontSize="xs"
                color="fg.muted"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Paliers (ex: 5, 10, 15, 20)
              </Text>
              <HStack gap={2} align="start">
                <Box flex={1}>
                  <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} gap={2}>
                    {(block.repsScheme || []).map((reps, i) => (
                      <NumField
                        key={i}
                        value={reps}
                        label=""
                        onChange={(v) => {
                          const newScheme = [...(block.repsScheme || [])];
                          newScheme[i] = v;
                          onUpdate?.({ repsScheme: newScheme });
                        }}
                      />
                    ))}
                  </SimpleGrid>
                </Box>
                <VStack>
                  <Button
                    bg="whiteAlpha.100"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    onClick={() => {
                      const newScheme = [...(block.repsScheme || []), 1];
                      onUpdate?.({ repsScheme: newScheme });
                    }}
                    color="app.primary"
                    size="xs"
                  >
                    <LuPlus />
                  </Button>
                  <Button
                    bg="whiteAlpha.100"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    onClick={() => {
                      const newScheme = [...(block.repsScheme || [])];
                      newScheme.pop();
                      onUpdate?.({ repsScheme: newScheme });
                    }}
                    color="app.primary"
                    size="xs"
                  >
                    <LuMinus />
                  </Button>
                </VStack>
              </HStack>
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
                  bg="app.primary/20"
                  borderWidth="1px"
                  borderColor="app.primary/40"
                >
                  <Text fontSize="xs" fontWeight="bold" color="app.primary">
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
