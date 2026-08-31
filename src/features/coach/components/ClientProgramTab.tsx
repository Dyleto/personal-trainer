import { useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  HStack,
  IconButton,
  Text,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { AutoResizeTextarea } from '@/components/AutoResizeTextarea';
import { LuMenu, LuPencil, LuPlus, LuTrash2, LuX } from 'react-icons/lu';
import {
  BlockExercise,
  BlockType,
  Exercise,
  Session,
  SessionBlock,
} from '@/types';
import {
  BlockCard,
  BlockEditor,
  BlockTypeSelector,
  ExerciseSelectorPanel,
} from '@/features/program';
import { getBlockLabel } from '@/features/program/constants';
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

interface Props {
  session: Session;
  onRemoveSession: () => void;
  onUpdateSessionNotes: (notes: string) => void;
  onAddBlock: (type: BlockType) => void;
  onRemoveBlock: (blockId: string) => void;
  onUpdateBlock: (blockId: string, updates: Partial<SessionBlock>) => void;
  onReorderBlocks: (orderedBlockIds: string[]) => void;
  onAddExercise: (blockId: string, exercise: Exercise) => void;
  onRemoveExercise: (blockId: string, index: number) => void;
  onUpdateExercise: (
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

// État compact d'un bloc : c'est exactement le rendu lecture (BlockCard),
// celui que voit le client — la DA ne veut pas deux vocabulaires visuels.
// Les commandes vivent dans une gouttière à droite pour ne pas recouvrir
// le résumé de config, qui est déjà aligné à droite dans l'en-tête.
const CompactBlock = ({
  block,
  dragHandleProps,
  onOpen,
}: {
  block: SessionBlock;
  dragHandleProps: Record<string, unknown>;
  onOpen: () => void;
}) => (
  <HStack align="stretch" gap={1}>
    <Box
      flex={1}
      minW={0}
      role="button"
      tabIndex={0}
      cursor="pointer"
      borderRadius="lg"
      transition="opacity 0.15s"
      _hover={{ opacity: 0.85 }}
      _focusVisible={{
        outline: '2px solid',
        outlineColor: 'app.primary',
        outlineOffset: '2px',
      }}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <BlockCard block={block} />
    </Box>
    <VStack gap={0} pt={1} flexShrink={0}>
      <IconButton
        aria-label={`Modifier le bloc ${getBlockLabel(block.type)}`}
        size="xs"
        variant="ghost"
        color="fg.muted"
        onClick={onOpen}
      >
        <LuPencil size={13} />
      </IconButton>
      <IconButton
        aria-label={`Réorganiser le bloc ${getBlockLabel(block.type)}`}
        size="xs"
        variant="ghost"
        color="fg.muted"
        cursor="grab"
        touchAction="none"
        {...dragHandleProps}
      >
        <LuMenu size={13} />
      </IconButton>
    </VStack>
  </HStack>
);

export const ClientProgramTab = ({
  session,
  onRemoveSession,
  onUpdateSessionNotes,
  onAddBlock,
  onRemoveBlock,
  onUpdateBlock,
  onReorderBlocks,
  onAddExercise,
  onRemoveExercise,
  onUpdateExercise,
}: Props) => {
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);
  const [drawerBlockId, setDrawerBlockId] = useState<string | null>(null);
  const [selectorBlockId, setSelectorBlockId] = useState<string | null>(null);
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [prevBlockCount, setPrevBlockCount] = useState(session.blocks.length);

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Un bloc qu'on vient d'ajouter s'ouvre tout de suite : on l'ajoute pour le
  // régler. Ajustement d'état pendant le rendu — même schéma que ExerciseEditor.
  // Le remontage par `key={session._id}` côté page couvre le changement de séance.
  if (session.blocks.length > prevBlockCount) {
    const added = session.blocks[session.blocks.length - 1];
    setPrevBlockCount(session.blocks.length);
    setExpandedBlockId(added._id);
    setDrawerBlockId(added._id);
  } else if (session.blocks.length < prevBlockCount) {
    setPrevBlockCount(session.blocks.length);
  }

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
    onReorderBlocks(newOrder);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = session.blocks.findIndex((b) => b._id === active.id);
    const toIndex = session.blocks.findIndex((b) => b._id === over.id);
    moveBlock(fromIndex, toIndex);
  };

  const openBlock = (blockId: string) => {
    if (isMobile) {
      setDrawerBlockId(blockId);
    } else {
      setExpandedBlockId((current) => (current === blockId ? null : blockId));
    }
  };

  const handleSelectExercise = (exercise: Exercise) => {
    if (selectorBlockId) onAddExercise(selectorBlockId, exercise);
    setSelectorBlockId(null);
  };

  const drawerIndex = session.blocks.findIndex((b) => b._id === drawerBlockId);
  const drawerBlock = drawerIndex >= 0 ? session.blocks[drawerIndex] : null;

  const editorProps = (block: SessionBlock, index: number) => ({
    block,
    canMoveUp: index > 0,
    canMoveDown: index < session.blocks.length - 1,
    onMoveUp: () => moveBlock(index, index - 1),
    onMoveDown: () => moveBlock(index, index + 1),
    onUpdate: (updates: Partial<SessionBlock>) =>
      onUpdateBlock(block._id, updates),
    onAddExercise: () => setSelectorBlockId(block._id),
    onRemoveExercise: (i: number) => onRemoveExercise(block._id, i),
    onUpdateExercise: (
      i: number,
      updates: Partial<Omit<BlockExercise, 'exercise'>>
    ) => onUpdateExercise(block._id, i, updates),
  });

  return (
    <>
      <VStack align="stretch" gap={3}>
        <AutoResizeTextarea
          value={session.notes || ''}
          onChange={(e) => onUpdateSessionNotes(e.target.value)}
          placeholder="Notes pour cette séance..."
          size="sm"
          fontSize="sm"
          bg="whiteAlpha.50"
          borderColor="whiteAlpha.100"
          _focus={{ borderColor: 'app.primary' }}
          borderRadius="md"
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={session.blocks.map((b) => b._id)}
            strategy={verticalListSortingStrategy}
          >
            <VStack align="stretch" gap={2}>
              {session.blocks.map((block, index) => (
                <SortableBlock key={block._id} id={block._id}>
                  {(dragHandleProps) =>
                    !isMobile && expandedBlockId === block._id ? (
                      <Box>
                        <BlockEditor
                          {...editorProps(block, index)}
                          dragHandleProps={dragHandleProps}
                          onRemove={() => {
                            onRemoveBlock(block._id);
                            setExpandedBlockId(null);
                          }}
                        />
                        <HStack justify="flex-end" mt={1}>
                          <Button
                            size="xs"
                            variant="ghost"
                            color="fg.muted"
                            onClick={() => setExpandedBlockId(null)}
                          >
                            Replier
                          </Button>
                        </HStack>
                      </Box>
                    ) : (
                      <CompactBlock
                        block={block}
                        dragHandleProps={dragHandleProps}
                        onOpen={() => openBlock(block._id)}
                      />
                    )
                  }
                </SortableBlock>
              ))}
            </VStack>
          </SortableContext>
        </DndContext>

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
                onAddBlock(type);
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

        {session.blocks.length === 0 && !showBlockSelector && (
          <Box
            py={6}
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

        <HStack justify="flex-end">
          <Button
            size="xs"
            variant="ghost"
            color="fg.muted"
            _hover={{ color: 'app.error', bg: 'app.error/8' }}
            onClick={onRemoveSession}
          >
            <LuTrash2 size={13} />
            Supprimer la séance
          </Button>
        </HStack>
      </VStack>

      {isMobile && drawerBlock && (
        <Drawer.Root
          open={!!drawerBlock}
          onOpenChange={(e) => !e.open && setDrawerBlockId(null)}
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
                    {getBlockLabel(drawerBlock.type)}
                  </Text>
                  <IconButton
                    aria-label="Fermer"
                    size="sm"
                    variant="ghost"
                    onClick={() => setDrawerBlockId(null)}
                  >
                    <LuX />
                  </IconButton>
                </HStack>
              </Drawer.Header>
              <Drawer.Body p={4}>
                <BlockEditor
                  {...editorProps(drawerBlock, drawerIndex)}
                  onRemove={() => {
                    onRemoveBlock(drawerBlock._id);
                    setDrawerBlockId(null);
                  }}
                />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Drawer.Root>
      )}

      {selectorBlockId && (
        <ExerciseSelectorPanel
          isOpen={!!selectorBlockId}
          onClose={() => setSelectorBlockId(null)}
          onSelect={handleSelectExercise}
        />
      )}
    </>
  );
};
