import { BlockExercise, SessionBlock } from "@/types";
import { Block } from "./blocks";

interface BlockEditorProps {
  block: SessionBlock;
  onUpdate: (updates: Partial<SessionBlock>) => void;
  onRemove: () => void;
  onAddExercise: () => void;
  onRemoveExercise: (index: number) => void;
  onUpdateExercise: (
    index: number,
    updates: Partial<Omit<BlockExercise, "exercise">>,
  ) => void;
}

export const BlockEditor = (props: BlockEditorProps) => (
  <Block {...props} isEditing={true} />
);
