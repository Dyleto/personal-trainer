import { CompletedSession } from '@/types';
import {
  sessionTotals,
  type ProgressionMetric,
} from '@/features/client/exerciseProgression';

export interface PassageColumn {
  exerciseId: string;
  name: string;
  /** La grandeur de cette colonne, fixe pour tous ses passages. */
  metric: ProgressionMetric;
  unit: string;
}

const UNIT: Record<ProgressionMetric, string> = {
  weight: 'kg',
  reps: 'reps',
  duration: 's',
};

const idOf = (exercise: Record<string, unknown>): string | null =>
  typeof exercise?._id === 'string' ? exercise._id : null;

const nameOf = (exercise: Record<string, unknown>): string =>
  typeof exercise?.name === 'string' ? exercise.name : 'Exercice';

/**
 * Les exercices de cette séance sur lesquels le client a noté quelque chose.
 *
 * Les passages du panneau sont la même séance refaite plusieurs fois : les
 * exercices sont donc identiques d'une ligne à l'autre, et une colonne nommée
 * d'après l'un d'eux se compare de haut en bas. C'est ce qui rend le tableau
 * possible.
 *
 * Triés du plus souvent renseigné au moins souvent : le premier fait le
 * meilleur défaut, c'est celui qui a le plus de points à comparer.
 */
export const buildPassageColumns = (
  history: CompletedSession[]
): PassageColumn[] => {
  const seen = new Map<
    string,
    {
      name: string;
      count: number;
      weight: number;
      reps: number;
      duration: number;
    }
  >();

  history.forEach((completed) => {
    completed.blocks.forEach((block) => {
      block.exercises.forEach((ex) => {
        if (!ex.performed) return;
        const totals = sessionTotals(ex.performed.sets ?? []);
        if (!totals) return;
        const id = idOf(ex.exercise);
        if (!id) return;

        const entry = seen.get(id) ?? {
          name: nameOf(ex.exercise),
          count: 0,
          weight: 0,
          reps: 0,
          duration: 0,
        };
        entry.name = nameOf(ex.exercise);
        entry.count += 1;
        if (totals.weight !== undefined) entry.weight += 1;
        if (totals.reps !== undefined) entry.reps += 1;
        if (totals.duration !== undefined) entry.duration += 1;
        seen.set(id, entry);
      });
    });
  });

  return [...seen.entries()]
    .map(([exerciseId, e]) => {
      // Une seule grandeur par colonne : celle qui est le plus souvent
      // renseignée sur cet exercice. Mélanger des kilos et des répétitions
      // dans une même colonne ne se compare pas.
      const metric: ProgressionMetric =
        e.weight >= e.reps && e.weight >= e.duration
          ? 'weight'
          : e.reps >= e.duration
            ? 'reps'
            : 'duration';
      return {
        exerciseId,
        name: e.name,
        metric,
        unit: UNIT[metric],
        count: e.count,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'fr'))
    .map(({ exerciseId, name, metric, unit }) => ({
      exerciseId,
      name,
      metric,
      unit,
    }));
};

/** La valeur de cet exercice pour ce passage, ou `undefined` s'il n'a rien noté. */
export const passageValue = (
  completed: CompletedSession,
  column: PassageColumn
): number | undefined => {
  for (const block of completed.blocks) {
    for (const ex of block.exercises) {
      if (idOf(ex.exercise) !== column.exerciseId || !ex.performed) continue;
      const totals = sessionTotals(ex.performed.sets ?? []);
      return totals?.[column.metric];
    }
  }
  return undefined;
};
