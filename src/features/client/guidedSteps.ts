import { Session } from '@/types';
import { getBlockLabel } from '@/features/program/constants';
import { formatExerciseMetric } from '@/utils/formatters';

export type GuidedStep =
  | {
      type: 'exercise';
      blockLabel: string;
      exerciseName: string;
      metric: string;
    }
  | {
      type: 'rest';
      duration: number;
      nextExerciseName: string | null;
    };

export function buildGuidedSteps(session: Session): GuidedStep[] {
  const steps: GuidedStep[] = [];
  const sortedBlocks = [...session.blocks].sort((a, b) => a.order - b.order);

  sortedBlocks.forEach((block, blockIndex) => {
    const blockLabel = getBlockLabel(block.type);

    [...block.exercises]
      .sort((a, b) => a.order - b.order)
      .forEach((ex) => {
        steps.push({
          type: 'exercise',
          blockLabel,
          exerciseName: ex.exercise.name,
          metric: formatExerciseMetric(ex, block.type),
        });
      });

    const isLastBlock = blockIndex === sortedBlocks.length - 1;
    if (!isLastBlock) {
      const nextBlock = sortedBlocks[blockIndex + 1];
      const nextExerciseName = nextBlock.exercises[0]?.exercise.name ?? null;
      steps.push({
        type: 'rest',
        duration: block.restDuration ?? block.restBetweenRounds ?? 60,
        nextExerciseName,
      });
    }
  });

  return steps;
}
