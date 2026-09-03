import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { ReactNode, useState } from 'react';
import { LuChevronDown, LuVideo } from 'react-icons/lu';
import { BlockExercise, BlockType } from '@/types';
import {
  blockIndexPrefix,
  blockSupportsSets,
} from '@/features/program/constants';
import { formatExerciseMetric } from '@/utils/formatters';
import VideoPlayer from '@/components/VideoPlayer';
import { hitArea } from '@/components/hitArea';

interface BlockExerciseRowProps {
  exercise: BlockExercise;
  blockType: BlockType;
  index: number;
  /** Glissé sous la ligne : le réalisé, ou le rappel de la dernière fois. */
  extra?: ReactNode;
}

/**
 * Une ligne d'exercice en lecture — la jumelle exacte de celle de l'atelier.
 *
 * Même colonne de gauche pour le nom, même colonne de droite en chiffres
 * tabulaires pour la prescription, même filet de séparation. La seule chose
 * qu'elle a en plus : la consigne et la vidéo de l'exercice se déplient au
 * clic, ce qui n'a de sens que quand on exécute la séance.
 */
export const BlockExerciseRow = ({
  exercise,
  blockType,
  index,
  extra,
}: BlockExerciseRowProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const metric = formatExerciseMetric(exercise, blockType);
  const rest =
    blockSupportsSets(blockType) &&
    (exercise.sets ?? 1) > 1 &&
    exercise.restBetweenSets
      ? `${exercise.restBetweenSets}s repos`
      : null;

  const ex = exercise.exercise;
  const hasDescription = !!ex.description?.trim();
  const hasVideo = !!ex.videoUrl?.trim();
  const hasDetail = hasDescription || hasVideo;

  return (
    <Box borderTopWidth="1px" borderColor="whiteAlpha.100">
      <HStack
        as={hasDetail ? 'button' : undefined}
        w="full"
        textAlign="left"
        aria-expanded={hasDetail ? isOpen : undefined}
        aria-label={hasDetail ? `${ex.name} — voir la consigne` : undefined}
        onClick={hasDetail ? () => setIsOpen((v) => !v) : undefined}
        py={1.5}
        minH={hasDetail ? '44px' : undefined}
        gap={3}
        align="center"
        css={hasDetail ? hitArea(44) : undefined}
        _hover={hasDetail ? { color: 'fg' } : undefined}
        transition="color 0.12s"
      >
        <HStack gap={1} flex={1} minW={0}>
          {blockIndexPrefix(blockType) && (
            <Text fontSize="sm" color="fg.muted" flexShrink={0}>
              {index + 1} ·
            </Text>
          )}
          <Text fontSize="sm" color="fg.muted" lineClamp={1}>
            {ex.name}
          </Text>
          {hasVideo && (
            <Box color="fg.muted" flexShrink={0} opacity={0.7}>
              <LuVideo size={11} />
            </Box>
          )}
        </HStack>

        {/* La prescription, alignée à droite en chiffres tabulaires : c'est ce
            qu'on parcourt verticalement quand on relit une séance. */}
        {(metric || rest) && (
          <VStack gap={0} align="end" flexShrink={0}>
            {metric && (
              <Text
                fontSize="sm"
                color="fg"
                fontWeight="semibold"
                fontFamily="mono"
              >
                {metric}
              </Text>
            )}
            {rest && (
              <Text fontSize="xs" color="fg.muted">
                {rest}
              </Text>
            )}
          </VStack>
        )}

        {hasDetail && (
          <Box
            color="fg.muted"
            flexShrink={0}
            transition="transform 0.2s"
            transform={isOpen ? 'rotate(180deg)' : 'none'}
          >
            <LuChevronDown size={13} />
          </Box>
        )}
      </HStack>

      {extra && <Box pb={1.5}>{extra}</Box>}

      {isOpen && hasDetail && (
        <VStack align="stretch" gap={3} pb={3}>
          {hasDescription && (
            <Text
              fontSize="xs"
              color="fg.muted"
              lineHeight="tall"
              whiteSpace="pre-wrap"
            >
              {ex.description}
            </Text>
          )}
          {hasVideo && <VideoPlayer url={ex.videoUrl!} />}
        </VStack>
      )}
    </Box>
  );
};
