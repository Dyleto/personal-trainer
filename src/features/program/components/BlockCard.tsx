import { SessionBlock } from '@/types';
import { Block, BlockProps } from './blocks';

interface BlockCardProps {
  block: SessionBlock;
  renderExerciseExtra?: BlockProps['renderExerciseExtra'];
}

export const BlockCard = ({ block, renderExerciseExtra }: BlockCardProps) => (
  <Block
    block={block}
    isEditing={false}
    renderExerciseExtra={renderExerciseExtra}
  />
);
