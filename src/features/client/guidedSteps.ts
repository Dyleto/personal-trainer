import { Session, SessionBlock, BlockExercise, BlockType } from '@/types';
import {
  getBlockLabel,
  blockDefinesOwnMetrics,
  blockSupportsRepsOnly,
} from '@/features/program/constants';
import { formatExerciseMetric, formatDuration } from '@/utils/formatters';

export type GuidedStep =
  | {
      type: 'exercise';
      blockLabel: string;
      exerciseName: string;
      exerciseId: string;
      metric: string;
    }
  | {
      type: 'rest';
      duration: number;
      nextExerciseName: string | null;
    };

// Blocs dont les tours (rounds) sont chronométrés au niveau du bloc plutôt
// que par exercice : EMOM/Every (intervalle) et Tabata/On-Off (travail/repos).
const ROUND_BASED_TYPES: BlockType[] = ['emom', 'every', 'tabata', 'onoff'];

const sortByOrder = <T extends { order: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => a.order - b.order);

const pushExerciseSteps = (
  steps: GuidedStep[],
  block: SessionBlock,
  exercises: BlockExercise[],
  blockLabel: string,
  metricOverride?: (ex: BlockExercise) => string
) => {
  exercises.forEach((ex) => {
    steps.push({
      type: 'exercise',
      blockLabel,
      exerciseName: ex.exercise.name,
      exerciseId: ex.exercise._id,
      metric: metricOverride
        ? metricOverride(ex)
        : formatExerciseMetric(ex, block.type),
    });
  });
};

// EMOM/Every (chronométré par intervalle) et Tabata/On-Off (travail/repos) :
// on répète le passage sur les exercices du bloc `rounds` fois, avec un
// repos réel entre chaque tour.
const buildRoundBasedSteps = (
  block: SessionBlock,
  exercises: BlockExercise[],
  blockLabel: string,
  nextBlockFirstExerciseName: string | null
): GuidedStep[] => {
  const steps: GuidedStep[] = [];
  const rounds = block.rounds ?? 1;
  const isWorkRest = blockSupportsRepsOnly(block.type);
  const intervalSeconds = (block.intervalMinutes ?? 1) * 60;

  const metricOverride = isWorkRest
    ? (ex: BlockExercise) =>
        ex.reps
          ? `${ex.reps} reps`
          : block.workDuration !== undefined
            ? formatDuration(block.workDuration)
            : ''
    : undefined;

  for (let round = 1; round <= rounds; round++) {
    pushExerciseSteps(steps, block, exercises, blockLabel, metricOverride);

    const isLastRound = round === rounds;
    const restDuration = isWorkRest ? block.restDuration : intervalSeconds;
    if (restDuration) {
      steps.push({
        type: 'rest',
        duration: restDuration,
        nextExerciseName: isLastRound
          ? nextBlockFirstExerciseName
          : (exercises[0]?.exercise.name ?? null),
      });
    }
  }

  return steps;
};

// Pyramide/Échelle : le nombre de reps change à chaque tour selon
// `repsScheme` (ex. 2-4-6-8-6-4-2), pas selon la config de l'exercice.
const buildSchemeBasedSteps = (
  block: SessionBlock,
  exercises: BlockExercise[],
  blockLabel: string,
  nextBlockFirstExerciseName: string | null
): GuidedStep[] => {
  const steps: GuidedStep[] = [];
  const scheme =
    block.repsScheme && block.repsScheme.length > 0
      ? block.repsScheme
      : [undefined];

  scheme.forEach((reps, i) => {
    pushExerciseSteps(steps, block, exercises, blockLabel, () =>
      reps !== undefined ? `${reps} reps` : ''
    );

    const isLastStep = i === scheme.length - 1;
    if (block.restBetweenRounds) {
      steps.push({
        type: 'rest',
        duration: block.restBetweenRounds,
        nextExerciseName: isLastStep
          ? nextBlockFirstExerciseName
          : (exercises[0]?.exercise.name ?? null),
      });
    }
  });

  return steps;
};

export function buildGuidedSteps(session: Session): GuidedStep[] {
  const steps: GuidedStep[] = [];
  const sortedBlocks = sortByOrder(session.blocks);

  sortedBlocks.forEach((block, blockIndex) => {
    const blockLabel = getBlockLabel(block.type);
    const exercises = sortByOrder(block.exercises);
    const nextBlockFirstExerciseName =
      sortedBlocks[blockIndex + 1]?.exercises[0]?.exercise.name ?? null;

    let blockSteps: GuidedStep[];
    if (blockDefinesOwnMetrics(block.type)) {
      blockSteps = buildSchemeBasedSteps(
        block,
        exercises,
        blockLabel,
        nextBlockFirstExerciseName
      );
    } else if (
      ROUND_BASED_TYPES.includes(block.type) &&
      (block.rounds ?? 1) > 1
    ) {
      blockSteps = buildRoundBasedSteps(
        block,
        exercises,
        blockLabel,
        nextBlockFirstExerciseName
      );
    } else {
      blockSteps = [];
      pushExerciseSteps(blockSteps, block, exercises, blockLabel);
    }

    steps.push(...blockSteps);

    // Repos entre deux blocs : seulement si le coach a réellement défini une
    // durée, jamais une valeur inventée — et jamais deux repos d'affilée si
    // le bloc vient déjà de terminer sur un repos de tour.
    const isLastBlock = blockIndex === sortedBlocks.length - 1;
    const endsWithRest = blockSteps[blockSteps.length - 1]?.type === 'rest';
    const interBlockRest = block.restDuration ?? block.restBetweenRounds;

    if (!isLastBlock && !endsWithRest && interBlockRest) {
      steps.push({
        type: 'rest',
        duration: interBlockRest,
        nextExerciseName: nextBlockFirstExerciseName,
      });
    }
  });

  return steps;
}
