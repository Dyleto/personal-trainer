import { Card } from '@/components/Card';
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
  if (horizontal) {
    return (
      <Box
        bg={selected ? 'app.primary.bg' : 'surface.card'}
        borderRadius="xl"
        px={4}
        py={3}
        cursor={onClick ? 'pointer' : 'default'}
        transition="all 0.15s ease"
        borderWidth="1px"
        borderColor={selected ? 'app.primary' : 'surface.card'}
        _hover={onClick ? { borderColor: 'app.primary' } : undefined}
        onClick={() => onClick?.()}
      >
        <HStack gap={3} align="center">
          <Box
            p={2}
            bg={selected ? 'app.primary.bg' : 'surface.card'}
            borderRadius="md"
            borderWidth="1px"
            borderColor={selected ? 'app.primary' : 'transparent'}
            flexShrink={0}
          >
            <LuDumbbell size={16} color="var(--chakra-colors-app-primary)" />
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
              bg="app.primary/15"
              borderRadius="md"
              color="app.primary"
              flexShrink={0}
            >
              <LuVideo size={13} />
            </Box>
          )}
          <Box color={selected ? 'app.primary' : 'fg.muted'} flexShrink={0}>
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
      accentColor="app.primary"
      cursor={onClick ? 'pointer' : 'default'}
    >
      <VStack gap={3} align="stretch">
        <Box
          p={3}
          bg="app.primary.bg"
          borderRadius="md"
          borderWidth="1px"
          borderColor="app.primary.border"
          alignSelf="center"
        >
          <LuDumbbell size={28} color="var(--chakra-colors-app-primary)" />
        </Box>
        <Box fontWeight="bold" fontSize="lg" textAlign="center" color="white">
          {exercise.name}
        </Box>
        {exercise.description && (
          <Box fontSize="sm" color="fg.muted" lineClamp={2} textAlign="center">
            {exercise.description}
          </Box>
        )}
      </VStack>
    </Card>
  );
};
