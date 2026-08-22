import { BlockExercise, BlockType, Session, SessionBlock } from '@/types';
import {
  Box,
  Button,
  Drawer,
  HStack,
  IconButton,
  Separator,
  Text,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { AutoResizeTextarea } from '@/components/AutoResizeTextarea';
import {
  LuArrowRight,
  LuMenu,
  LuPencil,
  LuPlus,
  LuTrash2,
  LuX,
} from 'react-icons/lu';
import { Card } from '@/components/Card';
import { SessionHeader } from './SessionHeader';
import { BlockCard } from './BlockCard';
import { BlockEditor } from './BlockEditor';
import { BlockTypeSelector } from './BlockTypeSelector';
import { getBlockLabel } from '@/features/program/constants';
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

// Ligne compacte utilisée en mobile pendant l'édition : le détail complet
// (avec tous les champs) s'ouvre en plein écran au tap, pour ne pas avoir
// à faire défiler un formulaire entier par bloc dans la liste.
const MobileBlockRow = ({
  block,
  dragHandleProps,
  onOpen,
}: {
  block: SessionBlock;
  dragHandleProps: Record<string, unknown>;
  onOpen: () => void;
}) => (
  <HStack
    p={3}
    borderRadius="lg"
    borderWidth="1px"
    borderColor="whiteAlpha.200"
    bg="whiteAlpha.50"
    justify="space-between"
    cursor="pointer"
    onClick={onOpen}
  >
    <VStack align="start" gap={0} minW={0}>
      <Text fontSize="sm" fontWeight="bold" truncate>
        {getBlockLabel(block.type)}
      </Text>
      <Text fontSize="xs" color="fg.muted">
        {block.exercises.length} exercice
        {block.exercises.length > 1 ? 's' : ''}
      </Text>
    </VStack>
    <HStack gap={1} flexShrink={0}>
      <LuPencil size={14} color="var(--chakra-colors-fg-muted)" />
      <IconButton
        aria-label="Réorganiser le bloc"
        size="xs"
        variant="ghost"
        color="fg.muted"
        cursor="grab"
        touchAction="none"
        onClick={(e) => e.stopPropagation()}
        {...dragHandleProps}
      >
        <LuMenu size={14} />
      </IconButton>
    </HStack>
  </HStack>
);

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
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

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

  const editingBlockIndex = session.blocks.findIndex(
    (b) => b._id === editingBlockId
  );
  const editingBlock =
    editingBlockIndex >= 0 ? session.blocks[editingBlockIndex] : null;

  return (
    <Card
      p={0}
      accentColor="app.primary"
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
                borderColor="app.primaryBorder"
                _focus={{ borderColor: 'app.primary' }}
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
                  borderLeftColor="app.primary.border"
                >
                  <Text fontSize="xs" color="fg.muted" mb={1} fontWeight="bold">
                    Note du coach
                  </Text>
                  <Text fontSize="sm" color="fg.muted" whiteSpace="pre-wrap">
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
                    {(dragHandleProps) =>
                      isMobile ? (
                        <MobileBlockRow
                          block={block}
                          dragHandleProps={dragHandleProps}
                          onOpen={() => setEditingBlockId(block._id)}
                        />
                      ) : (
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
                      )
                    }
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
                        <Text fontSize="sm" fontWeight="bold" color="fg.muted">
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
                      color="fg.muted"
                      borderWidth="1px"
                      borderColor="whiteAlpha.200"
                      borderStyle="dashed"
                      borderRadius="lg"
                      onClick={() => setShowBlockSelector(true)}
                      _hover={{ bg: 'whiteAlpha.100', color: 'fg.muted' }}
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
              _hover={{ color: 'app.error', bg: 'app.error/8' }}
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
              bg="app.primary"
              color="bg.canvas"
              fontWeight="bold"
              size="lg"
              onClick={onComplete}
              _hover={{ bg: 'app.primary.hover' }}
            >
              J'ai terminé cette séance <LuArrowRight />
            </Button>
          </Box>
        )}
      </VStack>

      {isMobile && editingBlock && (
        <Drawer.Root
          open={!!editingBlock}
          onOpenChange={(e) => !e.open && setEditingBlockId(null)}
          size="full"
        >
          <Drawer.Positioner>
            <Drawer.Content bg="bg.canvas">
              <Drawer.Header
                borderBottomWidth="1px"
                borderColor="whiteAlpha.100"
              >
                <HStack justify="space-between" flex={1}>
                  <Text fontWeight="bold">
                    {getBlockLabel(editingBlock.type)}
                  </Text>
                  <IconButton
                    aria-label="Fermer"
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingBlockId(null)}
                  >
                    <LuX />
                  </IconButton>
                </HStack>
              </Drawer.Header>
              <Drawer.Body p={4}>
                <BlockEditor
                  block={editingBlock}
                  canMoveUp={editingBlockIndex > 0}
                  canMoveDown={editingBlockIndex < session.blocks.length - 1}
                  onMoveUp={() =>
                    moveBlock(editingBlockIndex, editingBlockIndex - 1)
                  }
                  onMoveDown={() =>
                    moveBlock(editingBlockIndex, editingBlockIndex + 1)
                  }
                  onUpdate={(updates) =>
                    onUpdateBlock?.(editingBlock._id, updates)
                  }
                  onRemove={() => {
                    onRemoveBlock?.(editingBlock._id);
                    setEditingBlockId(null);
                  }}
                  onAddExercise={() => onAddExercise?.(editingBlock._id)}
                  onRemoveExercise={(i) =>
                    onRemoveExercise?.(editingBlock._id, i)
                  }
                  onUpdateExercise={(i, updates) =>
                    onUpdateExercise?.(editingBlock._id, i, updates)
                  }
                />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Drawer.Root>
      )}
    </Card>
  );
};
