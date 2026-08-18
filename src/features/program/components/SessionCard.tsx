import { BlockExercise, BlockType, Session, SessionBlock } from '@/types';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Box, Button, HStack, Separator, Text, VStack } from '@chakra-ui/react';
import { AutoResizeTextarea } from '@/components/AutoResizeTextarea';
import { LuArrowRight, LuPlus, LuTrash2 } from 'react-icons/lu';
import { Card } from '@/components/Card';
import { SessionHeader } from './SessionHeader';
import { BlockCard } from './BlockCard';
import { BlockEditor } from './BlockEditor';
import { BlockTypeSelector } from './BlockTypeSelector';
import { useState } from 'react';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

interface SessionCardProps {
  session: Session;
  interactive?: boolean;
  isEditing?: boolean;
  onComplete?: () => void;
  onRemoveSession?: () => void;
  onUpdateSessionNotes?: (notes: string) => void;
  onAddBlock?: (type: BlockType) => void;
  onRemoveBlock?: (blockId: string) => void;
  onUpdateBlock?: (blockId: string, updates: Partial<SessionBlock>) => void;
  onReorderBlocks?: (orderedBlockIds: string[]) => void;
  onAddExercise?: (blockId: string) => void;
  onRemoveExercise?: (blockId: string, index: number) => void;
  onUpdateExercise?: (
    blockId: string,
    index: number,
    updates: Partial<Omit<BlockExercise, 'exercise'>>
  ) => void;
}

const SortableBlock = ({
  id,
  children,
}: {
  id: string;
  children: (dragHandleProps: Record<string, unknown>) => React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {children({ ...attributes, ...listeners })}
    </Box>
  );
};

export const SessionCard = ({
  session,
  interactive = true,
  isEditing,
  onComplete,
  onRemoveSession,
  onUpdateSessionNotes,
  onAddBlock,
  onRemoveBlock,
  onUpdateBlock,
  onReorderBlocks,
  onAddExercise,
  onRemoveExercise,
  onUpdateExercise,
}: SessionCardProps) => {
  const colors = useThemeColors();
  const [showBlockSelector, setShowBlockSelector] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= session.blocks.length) return;
    const newOrder = arrayMove(session.blocks, fromIndex, toIndex).map(
      (b) => b._id
    );
    onReorderBlocks?.(newOrder);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = session.blocks.findIndex((b) => b._id === active.id);
    const toIndex = session.blocks.findIndex((b) => b._id === over.id);
    moveBlock(fromIndex, toIndex);
  };

  return (
    <Card
      p={0}
      accentColor={colors.primary}
      hoverEffect={interactive ? 'both' : 'none'}
    >
      <VStack align="stretch" gap={0}>
        {/* Header */}
        <SessionHeader order={session.order} />

        {/* Notes */}
        {(isEditing || session.notes) && (
          <Box mx={4} mb={3}>
            {isEditing ? (
              <AutoResizeTextarea
                value={session.notes || ''}
                onChange={(e) => onUpdateSessionNotes?.(e.target.value)}
                placeholder="Notes pour cette séance..."
                size="sm"
                border="1px solid"
                borderColor={colors.primaryBorder}
                _focus={{ borderColor: colors.primary }}
                borderRadius="md"
                fontSize="sm"
              />
            ) : (
              session.notes && (
                <Box
                  p={3}
                  bg="whiteAlpha.50"
                  borderRadius="md"
                  borderLeft="3px solid"
                  borderLeftColor={colors.primaryBorder}
                >
                  <Text fontSize="xs" color="gray.400" mb={1} fontWeight="bold">
                    Note du coach
                  </Text>
                  <Text fontSize="sm" color="gray.300" whiteSpace="pre-wrap">
                    {session.notes}
                  </Text>
                </Box>
              )
            )}
          </Box>
        )}

        {/* Blocks */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={session.blocks.map((b) => b._id)}
            strategy={verticalListSortingStrategy}
          >
            <VStack align="stretch" gap={4} px={4} pb={4}>
              {session.blocks.map((block, index) =>
                isEditing ? (
                  <SortableBlock key={block._id} id={block._id}>
                    {(dragHandleProps) => (
                      <BlockEditor
                        block={block}
                        dragHandleProps={dragHandleProps}
                        canMoveUp={index > 0}
                        canMoveDown={index < session.blocks.length - 1}
                        onMoveUp={() => moveBlock(index, index - 1)}
                        onMoveDown={() => moveBlock(index, index + 1)}
                        onUpdate={(updates) =>
                          onUpdateBlock?.(block._id, updates)
                        }
                        onRemove={() => onRemoveBlock?.(block._id)}
                        onAddExercise={() => onAddExercise?.(block._id)}
                        onRemoveExercise={(i) =>
                          onRemoveExercise?.(block._id, i)
                        }
                        onUpdateExercise={(i, updates) =>
                          onUpdateExercise?.(block._id, i, updates)
                        }
                      />
                    )}
                  </SortableBlock>
                ) : (
                  <BlockCard key={block._id} block={block} />
                )
              )}

              {/* Add block (edit mode) */}
              {isEditing && (
                <>
                  {showBlockSelector ? (
                    <Box
                      p={3}
                      borderRadius="xl"
                      borderWidth="1px"
                      borderColor="whiteAlpha.200"
                      bg="whiteAlpha.50"
                    >
                      <HStack justify="space-between" mb={3}>
                        <Text fontSize="sm" fontWeight="bold" color="gray.300">
                          Choisir un type de bloc
                        </Text>
                        <Button
                          size="xs"
                          variant="ghost"
                          color="fg.muted"
                          onClick={() => setShowBlockSelector(false)}
                        >
                          Annuler
                        </Button>
                      </HStack>
                      <BlockTypeSelector
                        onSelect={(type) => {
                          onAddBlock?.(type);
                          setShowBlockSelector(false);
                        }}
                      />
                    </Box>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      color="gray.400"
                      borderWidth="1px"
                      borderColor="whiteAlpha.200"
                      borderStyle="dashed"
                      borderRadius="lg"
                      onClick={() => setShowBlockSelector(true)}
                      _hover={{ bg: 'whiteAlpha.100', color: 'gray.200' }}
                      w="full"
                    >
                      <LuPlus size={14} />
                      Ajouter un bloc
                    </Button>
                  )}
                </>
              )}

              {/* Empty state */}
              {!isEditing && session.blocks.length === 0 && (
                <Box
                  p={6}
                  textAlign="center"
                  bg="whiteAlpha.50"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="whiteAlpha.100"
                >
                  <Text color="fg.muted" fontSize="sm">
                    Cette séance ne contient aucun bloc.
                  </Text>
                </Box>
              )}
            </VStack>
          </SortableContext>
        </DndContext>

        {/* Delete session (edit mode) */}
        {isEditing && (
          <>
            <Separator borderColor="whiteAlpha.100" />
            <Button
              variant="ghost"
              size="sm"
              color="fg.muted"
              _hover={{ color: 'red.400', bg: 'red.400/8' }}
              onClick={onRemoveSession}
              w="full"
              borderRadius={0}
              py={4}
              gap={2}
            >
              <LuTrash2 size={14} />
              Supprimer la séance
            </Button>
          </>
        )}

        {/* Complete button (client view) */}
        {onComplete && (
          <Box px={4} pb={4} pt={2}>
            <Button
              w="full"
              bg={colors.primary}
              color="bg.canvas"
              fontWeight="bold"
              size="lg"
              onClick={onComplete}
              _hover={{ bg: colors.primaryHover }}
            >
              J'ai terminé cette séance <LuArrowRight />
            </Button>
          </Box>
        )}
      </VStack>
    </Card>
  );
};
