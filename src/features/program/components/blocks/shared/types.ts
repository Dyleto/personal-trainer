import { BlockExercise, SessionBlock } from '@/types';
import { ReactNode } from 'react';

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
  /**
   * Contenu inséré sous chaque exercice, en mode lecture uniquement.
   * Sert au Client à saisir ce qu'il a réellement fait sans que le rendu
   * partagé avec le Coach change d'un pixel quand la prop est absente.
   */
  renderExerciseExtra?: (ctx: {
    blockOrder: number;
    exerciseOrder: number;
    exerciseId?: string;
  }) => ReactNode;
}
