import { useState } from 'react';
import {
  BlockExercise,
  BlockType,
  Exercise,
  Session,
  SessionBlock,
} from '@/types';
import { SessionCard, ExerciseSelectorPanel } from '@/features/program';

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

// Ne rend plus qu'une seule séance (l'atelier, Phase 15) : la coquille
// (titre "Programme", bouton "Modifier", grille de séances) est montée
// d'un cran dans ClientDetails.tsx.
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
  const [selectorBlockId, setSelectorBlockId] = useState<string | null>(null);

  const handleSelectExercise = (exercise: Exercise) => {
    if (selectorBlockId) onAddExercise(selectorBlockId, exercise);
    setSelectorBlockId(null);
  };

  return (
    <>
      <SessionCard
        session={session}
        interactive={false}
        isEditing
        onRemoveSession={onRemoveSession}
        onUpdateSessionNotes={onUpdateSessionNotes}
        onAddBlock={onAddBlock}
        onRemoveBlock={onRemoveBlock}
        onUpdateBlock={onUpdateBlock}
        onReorderBlocks={onReorderBlocks}
        onAddExercise={(blockId) => setSelectorBlockId(blockId)}
        onRemoveExercise={onRemoveExercise}
        onUpdateExercise={onUpdateExercise}
      />

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
