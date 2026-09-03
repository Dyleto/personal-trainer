import { CompletedSession } from '@/types';

export type ProgressionMetric = 'weight' | 'reps' | 'duration';

export interface ProgressionPoint {
  value: number;
  completedAt: Date;
}

export interface ExerciseProgression {
  exerciseId: string;
  name: string;
  metric: ProgressionMetric;
  points: ProgressionPoint[];
  /** Date du dernier point : sert à mettre les exercices récents en premier. */
  lastAt: Date;
}

export const METRIC_UNIT: Record<ProgressionMetric, string> = {
  weight: 'kg',
  reps: 'reps',
  duration: 's',
};

// Une valeur isolée n'est pas une progression, et au-delà de cinq points la
// ligne ne se lit plus : on garde les cinq derniers, les plus parlants.
const MIN_POINTS = 2;
const MAX_POINTS = 5;

const exerciseIdOf = (exercise: Record<string, unknown>): string | null => {
  const id = exercise?._id;
  return typeof id === 'string' ? id : null;
};

const nameOf = (exercise: Record<string, unknown>): string => {
  const name = exercise?.name;
  return typeof name === 'string' ? name : 'Exercice';
};

/**
 * « Goblet Squat : 20 → 24 → 26 kg », par exercice, sur tout l'historique.
 *
 * Le client voyait ses séances une par une : pour savoir s'il montait en
 * charge il fallait ouvrir trois bilans et se souvenir. La donnée est déjà
 * là, dans les instantanés — il n'y manquait qu'une lecture verticale.
 *
 * Une seule grandeur par exercice, celle du passage le plus récent : mélanger
 * des kilos et des répétitions sur la même flèche ne voudrait rien dire.
 */
export const buildExerciseProgressions = (
  history: CompletedSession[]
): ExerciseProgression[] => {
  const chronological = [...history].sort(
    (a, b) =>
      new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );

  const byExercise = new Map<
    string,
    {
      name: string;
      entries: {
        at: Date;
        weight?: number;
        reps?: number;
        duration?: number;
      }[];
    }
  >();

  chronological.forEach((completed) => {
    const at = new Date(completed.completedAt);
    completed.blocks.forEach((block) => {
      block.exercises.forEach((ex) => {
        if (!ex.performed) return;
        const id = exerciseIdOf(ex.exercise);
        if (!id) return;
        const bucket = byExercise.get(id) ?? {
          name: nameOf(ex.exercise),
          entries: [],
        };
        bucket.name = nameOf(ex.exercise);
        bucket.entries.push({ at, ...ex.performed });
        byExercise.set(id, bucket);
      });
    });
  });

  const progressions: ExerciseProgression[] = [];

  byExercise.forEach((bucket, exerciseId) => {
    const latest = bucket.entries[bucket.entries.length - 1];
    const metric: ProgressionMetric | null =
      latest.weight !== undefined
        ? 'weight'
        : latest.reps !== undefined
          ? 'reps'
          : latest.duration !== undefined
            ? 'duration'
            : null;
    if (!metric) return;

    const points = bucket.entries
      .filter((e) => e[metric] !== undefined)
      .map((e) => ({ value: e[metric] as number, completedAt: e.at }));

    if (points.length < MIN_POINTS) return;

    progressions.push({
      exerciseId,
      name: bucket.name,
      metric,
      points: points.slice(-MAX_POINTS),
      lastAt: points[points.length - 1].completedAt,
    });
  });

  // Le plus récemment travaillé en premier : c'est celui sur lequel la
  // question « je mets combien la prochaine fois ? » se pose.
  return progressions.sort((a, b) => b.lastAt.getTime() - a.lastAt.getTime());
};

/** `true` si le dernier point est strictement au-dessus du précédent. */
export const isRising = (progression: ExerciseProgression): boolean => {
  const { points } = progression;
  return points[points.length - 1].value > points[points.length - 2].value;
};
