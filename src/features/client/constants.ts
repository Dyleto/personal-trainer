import { FeedbackTag, SessionMetrics } from '@/types';

// ─── Effort ──────────────────────────────────────────────────────────────────

export type EffortZone = 'easy' | 'target' | 'hard';

export interface EffortLevel {
  value: number;
  label: string;
  description: string;
  zone: EffortZone;
}

// La cible est au centre et elle est nommée : il n'y a pas de « plus = mieux »
// à interpréter. 1 et 5 sont deux problèmes différents, pas deux extrémités
// d'une même échelle de qualité.
export const EFFORT_LEVELS: EffortLevel[] = [
  {
    value: 1,
    label: 'Trop facile',
    description: "j'aurais pu en faire beaucoup plus",
    zone: 'easy',
  },
  {
    value: 2,
    label: 'Facile',
    description: 'confortable du début à la fin',
    zone: 'easy',
  },
  {
    value: 3,
    label: 'Juste',
    description: 'engagée, mais tenue',
    zone: 'target',
  },
  {
    value: 4,
    label: 'Dure',
    description: 'finie en serrant les dents',
    zone: 'hard',
  },
  {
    value: 5,
    label: 'Trop dure',
    description: "je n'ai pas pu tout faire",
    zone: 'hard',
  },
];

export const EFFORT_ZONE_COLOR: Record<EffortZone, string> = {
  easy: 'session.rest',
  target: 'app.primary',
  hard: 'session.work',
};

export const getEffortLevel = (effort?: number): EffortLevel | undefined =>
  EFFORT_LEVELS.find((l) => l.value === effort);

// ─── Étiquettes ──────────────────────────────────────────────────────────────

// Les clés sont stables et stockées telles quelles côté API : on peut changer
// un libellé sans rien casser dans l'historique déjà enregistré.
export const FEEDBACK_TAG_LABELS: Record<FeedbackTag, string> = {
  poor_sleep: 'Mal dormi',
  pain: 'Douleur',
  stress: 'Stressé',
  fatigue: 'Fatigué',
  illness: 'Malade',
  great_shape: 'En forme',
};

// « En forme » est volontairement dans la liste : sans étiquette positive, on
// n'ouvre le formulaire que quand ça va mal et le coach perd la moitié du
// signal.
export const FEEDBACK_TAGS: FeedbackTag[] = [
  'poor_sleep',
  'pain',
  'stress',
  'fatigue',
  'illness',
  'great_shape',
];

// ─── Legacy ──────────────────────────────────────────────────────────────────

/**
 * Les cinq axes de l'ancien bilan. Servent uniquement à relire les séances
 * enregistrées avant la refonte du ressenti — jamais à en saisir de nouvelles,
 * et jamais à recalculer une moyenne.
 */
export const LEGACY_METRIC_LABELS: Record<keyof SessionMetrics, string> = {
  stress: 'Stress',
  mood: 'Humeur',
  energy: 'Énergie',
  sleep: 'Sommeil',
  soreness: 'Douleurs',
};

export const CLIENT_CONTENT_MAX_W = '640px';
export const CLIENT_GRID_MAX_W = '5xl';
