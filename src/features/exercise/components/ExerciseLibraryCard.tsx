import { Card } from '@/components/Card';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Exercise } from '@/types';
import { Box, HStack, VStack } from '@chakra-ui/react';
import { LuChevronRight, LuDumbbell, LuVideo } from 'react-icons/lu';

interface ExerciseLibraryCardProps {
  exercise: Exercise;
  onClick?: () => void;
  horizontal?: boolean;
  selected?: boolean;
}

export const ExerciseLibraryCard = ({
  exercise,
  onClick,
  horizontal,
  selected,
}: ExerciseLibraryCardProps) => {
  const colors = useThemeColors();

  if (horizontal) {
    return (
      <Box
        bg={selected ? colors.primaryBg : 'gray.800'}
        borderRadius="xl"
        px={4}
        py={3}
        cursor={onClick ? 'pointer' : 'default'}
        transition="all 0.15s ease"
        borderWidth="1px"
        borderColor={selected ? colors.primary : 'gray.700'}
        _hover={onClick ? { borderColor: colors.primary } : undefined}
        onClick={() => onClick?.()}
      >
        <HStack gap={3} align="center">
          <Box
            p={2}
            bg={selected ? colors.primaryBg : 'gray.700'}
            borderRadius="md"
            borderWidth="1px"
            borderColor={selected ? colors.primary : 'transparent'}
            flexShrink={0}
          >
            <LuDumbbell size={16} color={colors.primaryHex} />
          </Box>
          <VStack gap={0} align="start" flex={1} minW={0}>
            <Box
              fontWeight="semibold"
              fontSize="sm"
              color="white"
              truncate
              w="full"
            >
              {exercise.name}
            </Box>
            {exercise.description && (
              <Box fontSize="xs" color="fg.muted" lineClamp={1} w="full">
                {exercise.description}
              </Box>
            )}
          </VStack>
          {exercise.videoUrl && (
            <Box
              px={1.5}
              py={1}
              bg="blue.400/15"
              borderRadius="md"
              color="blue.400"
              flexShrink={0}
            >
              <LuVideo size={13} />
            </Box>
          )}
          <Box color={selected ? colors.primary : 'fg.muted'} flexShrink={0}>
            <LuChevronRight size={13} />
          </Box>
        </HStack>
      </Box>
    );
  }

  return (
    <Card
      onClick={() => onClick?.()}
      contentPadding={6}
      accentColor={colors.primary}
      cursor={onClick ? 'pointer' : 'default'}
    >
      <VStack gap={3} align="stretch">
        <Box
          p={3}
          bg={colors.primaryBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={colors.primaryBorder}
          alignSelf="center"
        >
          <LuDumbbell size={28} color={colors.primaryHex} />
        </Box>
        <Box fontWeight="bold" fontSize="lg" textAlign="center" color="white">
          {exercise.name}
        </Box>
        {exercise.description && (
          <Box fontSize="sm" color="gray.400" lineClamp={2} textAlign="center">
            {exercise.description}
          </Box>
        )}
      </VStack>
    </Card>
  );
};
