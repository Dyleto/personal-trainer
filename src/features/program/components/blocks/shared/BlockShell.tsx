import { ReactNode } from 'react';
import {
  Box,
  Grid,
  HStack,
  IconButton,
  Input,
  Separator,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  LuPlus,
  LuTrash2,
  LuChevronUp,
  LuChevronDown,
  LuMenu,
} from 'react-icons/lu';
import { Button } from '@chakra-ui/react';
import {
  getBlockAccent,
  getBlockConfigSummary,
  getBlockDescription,
  getBlockLabel,
} from '@/features/program/constants';
import { AutoResizeTextarea } from '@/components/AutoResizeTextarea';
import {
  BlockExerciseEdit,
  BlockExerciseView,
} from '@/features/program/components/BlockExerciseCard';
import { BlockProps } from './types';

const ACCENT_COLOR = {
  work: 'session.work',
  rest: 'session.rest',
  neutral: 'whiteAlpha.100',
} as const;

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
  dragHandleProps,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: BlockShellProps) => {
  const description = getBlockDescription(block.type);
  const accentColor = ACCENT_COLOR[getBlockAccent(block.type)];

  return (
    <Box
      borderRadius={isEditing ? 'xl' : 'lg'}
      overflow="hidden"
      borderWidth="1px"
      borderColor={isEditing ? `${accentColor}/30` : 'whiteAlpha.100'}
      borderLeftWidth="3px"
      borderLeftColor={accentColor}
      bg="blackAlpha.200"
    >
      {/* ── Header ── */}
      <Box px={4} py={isEditing ? 3 : 2.5} bg="whiteAlpha.50">
        {isEditing ? (
          <VStack align="stretch" gap={1}>
            {/* Ligne d'action : réorganisation */}
            <Grid templateColumns="1fr auto 1fr" alignItems="center">
              <HStack gap={0}>
                <IconButton
                  aria-label="Monter le bloc"
                  size="xs"
                  variant="ghost"
                  color="fg.muted"
                  onClick={onMoveUp}
                  disabled={!canMoveUp}
                >
                  <LuChevronUp size={14} />
                </IconButton>
                <IconButton
                  aria-label="Descendre le bloc"
                  size="xs"
                  variant="ghost"
                  color="fg.muted"
                  onClick={onMoveDown}
                  disabled={!canMoveDown}
                >
                  <LuChevronDown size={14} />
                </IconButton>
              </HStack>

              <IconButton
                aria-label="Réorganiser le bloc"
                size="xs"
                variant="ghost"
                color="fg.muted"
                cursor="grab"
                touchAction="none"
                {...dragHandleProps}
              >
                <LuMenu size={14} />
              </IconButton>

              <Box />
            </Grid>

            <HStack justify="space-between" gap={2}>
              <HStack gap={2} flex={1} minW={0}>
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="fg.muted"
                  flexShrink={0}
                />
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="fg"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  flexShrink={0}
                >
                  {getBlockLabel(block.type)}
                </Text>
                <Input
                  size="xs"
                  value={block.label || ''}
                  onChange={(e) =>
                    onUpdate?.({ label: e.target.value || undefined })
                  }
                  placeholder="Nom personnalisé (optionnel)"
                  bg="blackAlpha.300"
                  borderColor="whiteAlpha.100"
                  _focus={{ borderColor: `app.primary/50` }}
                  borderRadius="md"
                  fontSize="xs"
                  color="fg.muted"
                />
              </HStack>

              <IconButton
                aria-label="Supprimer le bloc"
                size="xs"
                variant="ghost"
                color="fg.muted"
                _hover={{ color: 'app.error' }}
                onClick={onRemove}
              >
                <LuTrash2 size={14} />
              </IconButton>
            </HStack>

            <Text fontSize="2xs" color="fg.muted" lineHeight="shorter">
              {description}
            </Text>
          </VStack>
        ) : (
          <HStack justify="space-between" gap={2} align="start">
            <Box>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="fg"
                lineHeight="shorter"
              >
                {getBlockLabel(block.type)} {block.label && '·'} {block.label}
              </Text>
              <Text
                fontSize="2xs"
                color="fg.muted"
                lineHeight="shorter"
                mt="2px"
              >
                {description}
              </Text>
            </Box>
            {getBlockConfigSummary(block) && (
              <Text fontSize="xs" color="fg.muted" flexShrink={0}>
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
                  index={i}
                  onUpdate={(updates) => onUpdateExercise?.(i, updates)}
                  onRemove={() => onRemoveExercise?.(i)}
                />
              ))}
            </VStack>
          )}

          <Button
            size="sm"
            variant="ghost"
            color="app.primary"
            borderWidth="1px"
            borderColor={`app.primary/30`}
            borderStyle="dashed"
            borderRadius="lg"
            mt={3}
            onClick={onAddExercise}
            _hover={{ bg: `app.primary/10` }}
            w="full"
          >
            <LuPlus size={14} />
            Ajouter un exercice
          </Button>

          <AutoResizeTextarea
            mt={3}
            value={block.notes || ''}
            onChange={(e) => onUpdate?.({ notes: e.target.value || undefined })}
            placeholder="Notes pour ce bloc (consignes, tempo, intensité...)"
            size="sm"
            fontSize="xs"
            bg="whiteAlpha.50"
            borderColor="whiteAlpha.100"
            _focus={{ borderColor: `app.primary/50` }}
            borderRadius="md"
            color="fg.muted"
          />
        </VStack>
      ) : (
        <>
          {block.exercises.length > 0 ? (
            <VStack align="stretch" gap={0} px={4} divideY="1px">
              {block.exercises.map((ex, i) => (
                <BlockExerciseView
                  key={i}
                  exercise={ex}
                  blockType={block.type}
                  index={i}
                />
              ))}
            </VStack>
          ) : (
            <Box px={4} py={3}>
              <Text fontSize="sm" color="fg.muted">
                Aucun exercice
              </Text>
            </Box>
          )}

          {block.notes && (
            <Box
              px={4}
              py={2.5}
              borderTopWidth="1px"
              borderColor="whiteAlpha.100"
            >
              <Text fontSize="xs" color="fg.muted" whiteSpace="pre-wrap">
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
