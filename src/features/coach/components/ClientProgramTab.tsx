import { useState } from 'react';
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { LuCopy, LuPlus, LuTrash2 } from 'react-icons/lu';
import {
  BlockExercise,
  BlockType,
  Exercise,
  Session,
  SessionBlock,
} from '@/types';
import {
  AtelierBlock,
  BlockTypeSelector,
  ExerciseSelectorPanel,
  InlineText,
} from '@/features/program';
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
  /** Exercices déjà posés ailleurs dans le programme, pour le sélecteur. */
  inProgram: Exercise[];
  onRemoveSession: () => void;
  onDuplicateSession: () => void;
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

export const ClientProgramTab = ({
  session,
  inProgram,
  onRemoveSession,
  onDuplicateSession,
  onUpdateSessionNotes,
  onAddBlock,
  onRemoveBlock,
  onUpdateBlock,
  onReorderBlocks,
  onAddExercise,
  onRemoveExercise,
  onUpdateExercise,
}: Props) => {
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [selectorBlockId, setSelectorBlockId] = useState<string | null>(null);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = session.blocks.findIndex((b) => b._id === active.id);
    const to = session.blocks.findIndex((b) => b._id === over.id);
    if (from < 0 || to < 0) return;
    onReorderBlocks(arrayMove(session.blocks, from, to).map((b) => b._id));
  };

  return (
    <>
      <VStack align="stretch" gap={4} role="group">
        <InlineText
          value={session.notes}
          onChange={(notes) => onUpdateSessionNotes(notes ?? '')}
          addLabel="+ note de séance"
          ariaLabel="Note de la séance"
          fontSize="sm"
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
            <VStack align="stretch" gap={5}>
              {session.blocks.map((block) => (
                <SortableBlock key={block._id} id={block._id}>
                  {(dragHandleProps) => (
                    <AtelierBlock
                      block={block}
                      inProgram={inProgram}
                      dragHandleProps={dragHandleProps}
                      onUpdate={(updates) => onUpdateBlock(block._id, updates)}
                      onRemove={() => onRemoveBlock(block._id)}
                      onAddExercise={(exercise) =>
                        onAddExercise(block._id, exercise)
                      }
                      onRemoveExercise={(i) => onRemoveExercise(block._id, i)}
                      onUpdateExercise={(i, updates) =>
                        onUpdateExercise(block._id, i, updates)
                      }
                      onRequestExercisePicker={
                        isMobile
                          ? () => setSelectorBlockId(block._id)
                          : undefined
                      }
                    />
                  )}
                </SortableBlock>
              ))}
            </VStack>
          </SortableContext>
        </DndContext>

        {showBlockSelector ? (
          <Box
            p={3}
            borderRadius="lg"
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
          <Box
            as="button"
            onClick={() => setShowBlockSelector(true)}
            alignSelf="flex-start"
            fontSize="sm"
            color="fg.muted"
            _hover={{ color: 'app.primary' }}
            _focusVisible={{
              outline: '2px solid',
              outlineColor: 'app.primary',
              outlineOffset: '2px',
            }}
            transition="color 0.15s"
          >
            <HStack gap={1.5}>
              <LuPlus size={14} />
              <Text as="span">Ajouter un bloc</Text>
            </HStack>
          </Box>
        )}

        {session.blocks.length === 0 && !showBlockSelector && (
          <Text color="fg.muted" fontSize="sm">
            Cette séance ne contient aucun bloc.
          </Text>
        )}

        {/* Le chrome de séance, révélé à la demande comme le reste. */}
        <HStack justify="flex-end" gap={1} pt={2}>
          <Button
            size="xs"
            variant="ghost"
            color="fg.muted"
            onClick={onDuplicateSession}
          >
            <LuCopy size={13} />
            Dupliquer la séance
          </Button>
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

      {selectorBlockId && (
        <ExerciseSelectorPanel
          isOpen={!!selectorBlockId}
          onClose={() => setSelectorBlockId(null)}
          onSelect={(exercise) => {
            onAddExercise(selectorBlockId, exercise);
            setSelectorBlockId(null);
          }}
        />
      )}
    </>
  );
};
