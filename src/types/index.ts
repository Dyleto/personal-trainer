export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  isAdmin: boolean;
  isCoach: boolean;
  isClient: boolean;
}

export interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
  linkedAt: Date;
  unseenCount: number;
  /** Absent tant que le client n'a jamais terminé de séance. */
  lastCompletedAt?: Date;
}

export interface Coach {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
  hiredAt: Date;
}

export interface Program {
  _id: string;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  _id: string;
  name: string;
  description?: string;
  videoUrl?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  /** Nombre de séances du coach où l'exercice apparaît. Servi par l'API. */
  usageCount?: number;
}

export interface ExerciseStats {
  count: number;
}

// ─── Blocks ──────────────────────────────────────────────────────────────────

export type BlockType =
  | 'warmup'
  | 'emom'
  | 'every'
  | 'amrap'
  | 'timecap'
  | 'chipper'
  | 'classic'
  | 'tabata'
  | 'onoff'
  | 'pyramid'
  | 'ladder';

export interface CustomMetric {
  value: number;
  unit: string;
}

export interface BlockExercise {
  exercise: Exercise;
  order: number;
  sets?: number;
  restBetweenSets?: number;
  reps?: number;
  duration?: number;
  customMetric?: CustomMetric;
}

export interface SessionBlock {
  _id: string;
  type: BlockType;
  label?: string;
  order: number;
  notes?: string;
  durationMinutes?: number;
  intervalMinutes?: number;
  rounds?: number;
  restBetweenRounds?: number;
  workDuration?: number;
  restDuration?: number;
  repsScheme?: number[];
  exercises: BlockExercise[];
}

// ─── Session ─────────────────────────────────────────────────────────────────

export interface Session {
  _id: string;
  order: number;
  notes?: string;
  blocks: SessionBlock[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientProgram {
  sessions: Session[];
}

export interface ClientWithDetails extends Client {
  program: ClientProgram;
  unseenCount: number;
}

// ─── Completed Session (snapshot) ────────────────────────────────────────────

export interface BlockExerciseSnapshot {
  exercise: Record<string, unknown>;
  order: number;
  sets?: number;
  restBetweenSets?: number;
  reps?: number;
  duration?: number;
  customMetric?: CustomMetric;
  performed?: PerformedValues;
}

export interface BlockSnapshot {
  type: string;
  label?: string;
  order: number;
  notes?: string;
  durationMinutes?: number;
  intervalMinutes?: number;
  rounds?: number;
  restBetweenRounds?: number;
  workDuration?: number;
  restDuration?: number;
  repsScheme?: number[];
  exercises: BlockExerciseSnapshot[];
}

export interface CompletedSession {
  _id: string;
  completedAt: Date;
  originalSessionId: string;
  sessionOrder: number;
  blocks: BlockSnapshot[];
  coachNotes?: string;
  feedback?: SessionFeedback;
  /** @deprecated Ancien bilan en 5 axes. Encore lu, plus jamais écrit. */
  metrics?: SessionMetrics;
  clientNotes?: string;
  viewedByCoach: boolean;
  editedAt?: Date;
}

// ─── Ressenti ────────────────────────────────────────────────────────────────

export type FeedbackTag =
  'poor_sleep' | 'pain' | 'stress' | 'fatigue' | 'illness' | 'great_shape';

export interface SessionFeedback {
  /** 1 « trop facile » … 5 « trop dure ». La cible est 3, au centre. */
  effort: number;
  tags?: FeedbackTag[];
  note?: string;
}

/** @deprecated Remplacé par `SessionFeedback`. Conservé pour relire l'historique. */
export interface SessionMetrics {
  stress: number;
  mood: number;
  energy: number;
  sleep: number;
  soreness: number;
}

/**
 * Une valeur réalisée, adressée par sa position dans l'instantané.
 * `null` demande l'effacement de la valeur, une clé absente n'y touche pas.
 */
export interface PerformedEntry {
  blockOrder: number;
  exerciseOrder: number;
  weight?: number | null;
  reps?: number | null;
  sets?: number | null;
  duration?: number | null;
}

/**
 * Ce que le client a réellement fait, à côté de la prescription.
 * Une clé absente veut dire « non renseignée » — jamais zéro.
 */
export interface PerformedValues {
  weight?: number;
  reps?: number;
  sets?: number;
  duration?: number;
}
