import { BlockExercise, Session, SessionBlock } from '@/types';
import { getBlockLabel } from '@/features/program/constants';

/**
 * Une modification en attente, telle qu'on la dirait à voix haute.
 *
 * `sessionOrder` sert à regrouper : la barre annonce « 3 modifications ·
 * Séance 2 » quand tout tient dans une séance, et « · 2 séances » sinon.
 */
export interface ProgramChange {
  sessionOrder: number;
  label: string;
}

const CONFIG_FIELDS: {
  key: keyof SessionBlock;
  label: string;
  unit?: string;
}[] = [
  { key: 'rounds', label: 'tours' },
  { key: 'durationMinutes', label: 'durée', unit: ' min' },
  { key: 'intervalMinutes', label: 'intervalle', unit: ' min' },
  { key: 'restBetweenRounds', label: 'repos entre paliers', unit: ' s' },
  { key: 'workDuration', label: 'travail', unit: ' s' },
  { key: 'restDuration', label: 'repos', unit: ' s' },
];

const EXERCISE_FIELDS: {
  key: keyof BlockExercise;
  label: string;
  unit?: string;
}[] = [
  { key: 'sets', label: 'séries' },
  { key: 'reps', label: 'répétitions' },
  { key: 'duration', label: 'durée', unit: ' s' },
  { key: 'restBetweenSets', label: 'repos entre séries', unit: ' s' },
];

// « — » plutôt que « undefined » : la barre se lit, elle ne se débogue pas.
const show = (value: unknown, unit = ''): string =>
  value === undefined || value === null || value === ''
    ? '—'
    : `${value}${unit}`;

const blockName = (block: SessionBlock): string =>
  block.label?.trim()
    ? `${getBlockLabel(block.type)} « ${block.label.trim()} »`
    : getBlockLabel(block.type);

const sameSequence = (a?: number[], b?: number[]): boolean =>
  (a ?? []).length === (b ?? []).length &&
  (a ?? []).every((n, i) => n === (b ?? [])[i]);

const diffExercise = (
  before: BlockExercise,
  after: BlockExercise,
  push: (label: string) => void,
  prefix: string
) => {
  const name = after.exercise.name;

  EXERCISE_FIELDS.forEach(({ key, label, unit }) => {
    const b = before[key];
    const a = after[key];
    if (b !== a)
      push(`${prefix}${name} — ${label} : ${show(b, unit)} → ${show(a, unit)}`);
  });

  const bm = before.customMetric;
  const am = after.customMetric;
  if (bm?.value !== am?.value || bm?.unit !== am?.unit) {
    const fmt = (m?: { value: number; unit: string }) =>
      m ? `${m.value} ${m.unit}` : '—';
    push(`${prefix}${name} — mesure : ${fmt(bm)} → ${fmt(am)}`);
  }
};

const diffBlock = (
  before: SessionBlock,
  after: SessionBlock,
  push: (label: string) => void
) => {
  const prefix = `${blockName(after)} · `;

  if ((before.label ?? '') !== (after.label ?? ''))
    push(
      `${getBlockLabel(after.type)} — nom : ${show(before.label)} → ${show(after.label)}`
    );

  if ((before.notes ?? '') !== (after.notes ?? ''))
    push(`${blockName(after)} — consigne modifiée`);

  CONFIG_FIELDS.forEach(({ key, label, unit }) => {
    const b = before[key];
    const a = after[key];
    if (b !== a)
      push(`${prefix}${label} : ${show(b, unit)} → ${show(a, unit)}`);
  });

  if (!sameSequence(before.repsScheme, after.repsScheme))
    push(
      `${prefix}paliers : ${(before.repsScheme ?? []).join('-') || '—'} → ${(after.repsScheme ?? []).join('-') || '—'}`
    );

  // Les exercices n'ont pas d'identifiant propre dans un bloc : on les
  // apparie par position, et on décrit le reste comme ajout ou retrait.
  const common = Math.min(before.exercises.length, after.exercises.length);
  for (let i = 0; i < common; i++) {
    const b = before.exercises[i];
    const a = after.exercises[i];
    if (b.exercise._id !== a.exercise._id) {
      push(`${prefix}${b.exercise.name} remplacé par ${a.exercise.name}`);
    } else {
      diffExercise(b, a, push, prefix);
    }
  }
  after.exercises
    .slice(common)
    .forEach((ex) => push(`${prefix}${ex.exercise.name} ajouté`));
  before.exercises
    .slice(common)
    .forEach((ex) => push(`${prefix}${ex.exercise.name} retiré`));
};

const diffSession = (
  before: Session,
  after: Session,
  push: (label: string) => void
) => {
  if ((before.notes ?? '') !== (after.notes ?? ''))
    push('note de séance modifiée');

  const beforeBlocks = new Map(before.blocks.map((b) => [b._id, b]));
  const afterBlocks = new Map(after.blocks.map((b) => [b._id, b]));

  after.blocks.forEach((block) => {
    const previous = beforeBlocks.get(block._id);
    if (!previous) {
      push(`bloc ${blockName(block)} ajouté`);
      return;
    }
    diffBlock(previous, block, push);
  });

  before.blocks.forEach((block) => {
    if (!afterBlocks.has(block._id)) push(`bloc ${blockName(block)} supprimé`);
  });

  // Un déplacement ne compte qu'une fois : l'ordre des blocs conservés a
  // changé, pas dix blocs individuellement.
  const keptBefore = before.blocks
    .filter((b) => afterBlocks.has(b._id))
    .map((b) => b._id);
  const keptAfter = after.blocks
    .filter((b) => beforeBlocks.has(b._id))
    .map((b) => b._id);
  if (
    keptBefore.length === keptAfter.length &&
    keptBefore.some((id, i) => id !== keptAfter[i])
  )
    push('blocs réordonnés');
};

/**
 * Ce qui a changé depuis le dernier enregistrement, en clair.
 *
 * Le but n'est pas d'être exhaustif au champ près mais d'être dénombrable :
 * une barre qui dit « 3 modifications » doit correspondre à trois gestes que
 * le coach se rappelle avoir faits.
 */
export const diffProgram = (
  before: Session[],
  after: Session[]
): ProgramChange[] => {
  const changes: ProgramChange[] = [];
  const beforeById = new Map(before.map((s) => [s._id, s]));
  const afterById = new Map(after.map((s) => [s._id, s]));

  after.forEach((session, index) => {
    const order = index + 1;
    const push = (label: string) =>
      changes.push({ sessionOrder: order, label });
    const previous = beforeById.get(session._id);
    if (!previous) {
      // Une séance neuve compte pour un changement — c'est juste au sens du
      // diff — mais le coach vient d'y poser un bloc et des exercices, et
      // « 1 modification » ne raconte pas ce qu'il a fait. On dit ce qu'elle
      // contient plutôt que de la laisser muette.
      const blocks = session.blocks.length;
      const exercises = session.blocks.reduce(
        (sum, b) => sum + b.exercises.length,
        0
      );
      const contenu = [
        blocks > 0 && `${blocks} bloc${blocks > 1 ? 's' : ''}`,
        exercises > 0 && `${exercises} exercice${exercises > 1 ? 's' : ''}`,
      ]
        .filter(Boolean)
        .join(', ');
      push(contenu ? `séance ajoutée — ${contenu}` : 'séance ajoutée');
      return;
    }
    diffSession(previous, session, push);
  });

  before.forEach((session, index) => {
    if (!afterById.has(session._id))
      changes.push({ sessionOrder: index + 1, label: 'séance supprimée' });
  });

  const keptBefore = before
    .filter((s) => afterById.has(s._id))
    .map((s) => s._id);
  const keptAfter = after
    .filter((s) => beforeById.has(s._id))
    .map((s) => s._id);
  if (
    keptBefore.length === keptAfter.length &&
    keptBefore.some((id, i) => id !== keptAfter[i])
  )
    changes.push({ sessionOrder: 0, label: 'séances réordonnées' });

  return changes;
};

/**
 * L'étiquette de la barre : le nombre, puis où ça se passe.
 */
export const summarizeChanges = (changes: ProgramChange[]): string => {
  const count = changes.length;
  if (count === 0) return '';

  // Une séance qu'on vient de créer : « 1 modification » ne raconte pas les
  // trois gestes qu'on a faits pour la remplir. Quand c'est le seul
  // changement, la barre porte directement ce qu'il dit.
  const single = count === 1 ? changes[0] : null;
  if (single && single.label.startsWith('séance ajoutée')) {
    const detail = single.label.slice('séance ajoutée'.length).trim();
    return `Séance ${single.sessionOrder} ajoutée${detail ? ` ${detail}` : ''}`;
  }

  const noun = `${count} modification${count > 1 ? 's' : ''}`;

  const sessions = [...new Set(changes.map((c) => c.sessionOrder))].filter(
    (o) => o > 0
  );
  if (sessions.length === 0) return noun;
  if (sessions.length === 1) return `${noun} · Séance ${sessions[0]}`;
  return `${noun} · ${sessions.length} séances`;
};
