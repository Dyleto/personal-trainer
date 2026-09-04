import { PerformedSet, PerformedValues } from '@/types';

export const isEmptySet = (set: PerformedSet): boolean =>
  set.weight === undefined &&
  set.reps === undefined &&
  set.duration === undefined;

export const sameSet = (a: PerformedSet, b: PerformedSet): boolean =>
  a.weight === b.weight && a.reps === b.reps && a.duration === b.duration;

/**
 * Une série laissée vide veut dire que l'exercice s'est arrêté là : les
 * suivantes n'ont pas eu lieu. Une série vide tronque donc la liste, elle ne
 * se saute pas — c'est la règle que le serveur applique aussi.
 */
export const truncateAtFirstEmpty = (sets: PerformedSet[]): PerformedSet[] => {
  const stop = sets.findIndex(isEmptySet);
  return stop === -1 ? sets : sets.slice(0, stop);
};

/** La série commune à toutes, ou `null` si elles diffèrent. */
export const uniformSet = (sets: PerformedSet[]): PerformedSet | null =>
  sets.length > 0 && sets.every((s) => sameSet(s, sets[0])) ? sets[0] : null;

const setParts = (set: PerformedSet): string[] => {
  const parts: string[] = [];
  if (set.weight !== undefined) parts.push(`${set.weight} kg`);
  if (set.reps !== undefined) parts.push(`${set.reps} reps`);
  if (set.duration !== undefined) parts.push(`${set.duration}s`);
  return parts;
};

/**
 * Le réalisé en une ligne. `null` s'il n'y a rien à dire.
 *
 * Trois formes, de la plus courante à la plus rare :
 *   une série                    « 26 kg · 12 reps »
 *   plusieurs séries identiques  « 26 kg · 3 × 12 reps »
 *   la même charge, moins de reps « 26 kg · 12 + 10 + 8 »
 *   tout le reste                « 26 kg × 12 · 24 kg × 10 »
 *
 * Les trois premières couvrent ce qu'on écrit d'ordinaire ; la dernière ne
 * cherche pas à être courte, elle cherche à rester non ambiguë.
 */
export const formatPerformedSets = (sets: PerformedSet[]): string | null => {
  const kept = truncateAtFirstEmpty(sets);
  if (kept.length === 0) return null;

  const uniform = uniformSet(kept);
  if (uniform) {
    const parts = setParts(uniform);
    if (parts.length === 0) return null;
    if (kept.length === 1) return parts.join(' · ');
    // Le compte de séries se pose devant l'effort, jamais devant la charge :
    // « 3 × 26 kg » se lirait comme un poids total.
    const weight = uniform.weight !== undefined ? `${uniform.weight} kg` : null;
    const effort = setParts({ reps: uniform.reps, duration: uniform.duration });
    if (effort.length === 0) return `${kept.length} × ${weight}`;
    return [weight, `${kept.length} × ${effort.join(' · ')}`]
      .filter(Boolean)
      .join(' · ');
  }

  const weights = kept.map((s) => s.weight);
  const sameWeight =
    weights[0] !== undefined && weights.every((w) => w === weights[0]);
  if (sameWeight && kept.every((s) => s.duration === undefined)) {
    const reps = kept.map((s) => (s.reps === undefined ? '—' : String(s.reps)));
    return `${weights[0]} kg · ${reps.join(' + ')}`;
  }

  // Dans une liste de séries, le « × » dit déjà qu'il s'agit de répétitions :
  // répéter le mot à chaque série n'ajoute rien et allonge tout.
  return kept
    .map((set) => {
      const effort = [
        set.reps !== undefined ? String(set.reps) : null,
        set.duration !== undefined ? `${set.duration}s` : null,
      ]
        .filter(Boolean)
        .join(' · ');
      const weight = set.weight !== undefined ? `${set.weight} kg` : null;
      if (!weight) return effort || '—';
      return effort ? `${weight} × ${effort}` : weight;
    })
    .join(' · ');
};

export const formatPerformed = (performed?: PerformedValues): string | null =>
  performed ? formatPerformedSets(performed.sets) : null;
