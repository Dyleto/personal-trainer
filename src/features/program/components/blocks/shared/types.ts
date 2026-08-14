import { BlockExercise, SessionBlock } from '@/types';

export interface BlockProps {
  block: SessionBlock;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<SessionBlock>) => void;
  onRemove?: () => void;
  onAddExercise?: () => void;
  onRemoveExercise?: (index: number) => void;
  onUpdateExercise?: (
    index: number,
    updates: Partial<Omit<BlockExercise, 'exercise'>>
  ) => void;
  dragHandleProps?: Record<string, unknown>;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}
