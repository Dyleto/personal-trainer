import { CompletedSession, Session, SessionMetrics } from '@/types';
import { BlockType } from '@/types';
import { getBlockLabel } from '@/features/program/constants';

export const getSessionSummary = (session: Session): string => {
  const blockCount = session.blocks.length;
  const exerciseCount = session.blocks.reduce(
    (sum, b) => sum + b.exercises.length,
    0
  );
  return `${blockCount} bloc${blockCount > 1 ? 's' : ''} · ${exerciseCount} exercice${exerciseCount > 1 ? 's' : ''}`;
};

export const getSessionBlockTypes = (session: Session): string => {
  const uniqueTypes = [...new Set(session.blocks.map((b) => b.type))];
  return uniqueTypes.map(getBlockLabel).join(' · ');
};

export const getCompletedSessionBlockTypes = (
  completed: CompletedSession
): string => {
  const uniqueTypes = [...new Set(completed.blocks.map((b) => b.type))];
  return uniqueTypes.map((t) => getBlockLabel(t as BlockType)).join(' · ');
};

export const getAverageRating = (metrics: SessionMetrics): number => {
  const { stress, mood, energy, sleep, soreness } = metrics;
  return (stress + mood + energy + sleep + soreness) / 5;
};

export const getRelativeDate = (date: Date | string): string => {
  const d = new Date(date);
  const today = new Date();
  const diffDays = Math.round(
    (new Date(today.toDateString()).getTime() -
      new Date(d.toDateString()).getTime()) /
      86400000
  );

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays > 1 && diffDays < 7) return `Il y a ${diffDays} jours`;
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(d);
};
