import { CompletedSession, PerformedValues } from '@/types';
import { formatPerformedSets, truncateAtFirstEmpty } from './performedFormat';

export interface LastPerformance extends PerformedValues {
  completedAt: Date;
}

/**
 * Adresse d'un exercice dans l'instantané d'une séance — « ordre du bloc :
 * ordre de l'exercice ». C'est exactement la clé attendue par l'API pour le
 * réalisé, et la seule utilisée côté front.
 */
export const performedKey = (blockOrder: number, exerciseOrder: number) =>
  `${blockOrder}:${exerciseOrder}`;

const exerciseIdOf = (exercise: Record<string, unknown>): string | null => {
  const id = exercise?._id;
  return typeof id === 'string' ? id : null;
};

const hasAnyValue = (p: PerformedValues) =>
  truncateAtFirstEmpty(p.sets ?? []).length > 0;

/**
 * Le dernier `performed` connu pour chaque exercice, toutes séances confondues.
 *
 * Indexé par identifiant d'exercice et non par position : « j'avais mis
 * combien ? » porte sur le mouvement, pas sur l'emplacement qu'il occupait
 * dans la séance ce jour-là.
 *
 * Se calcule entièrement depuis l'historique déjà chargé — aucune requête.
 */
export const buildLastPerformanceIndex = (
  history: CompletedSession[]
): Map<string, LastPerformance> => {
  const index = new Map<string, LastPerformance>();

  // Du plus ancien au plus récent : la dernière écriture gagne, donc chaque
  // exercice finit sur son passage le plus récent.
  const chronological = [...history].sort(
    (a, b) =>
      new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );

  chronological.forEach((completed) => {
    completed.blocks.forEach((block) => {
      block.exercises.forEach((ex) => {
        if (!ex.performed || !hasAnyValue(ex.performed)) return;
        const id = exerciseIdOf(ex.exercise);
        if (!id) return;
        index.set(id, {
          ...ex.performed,
          completedAt: new Date(completed.completedAt),
        });
      });
    });
  });

  return index;
};

/**
 * « 26 kg · 3 × 12 reps » — les seules séries réellement renseignées, jamais
 * un zéro de remplissage. `null` s'il n'y a rien à dire.
 */
export const formatLastPerformance = (
  last: LastPerformance | undefined
): string | null => (last ? formatPerformedSets(last.sets ?? []) : null);
