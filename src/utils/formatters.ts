import { blockSupportsSets } from '@/features/program/constants';
import { BlockExercise, BlockType } from '@/types';

/**
 * Retire les accents et diacritiques d'une chaîne (é→e, à→a, ç→c…)
 */
export const stripAccents = (str: string): string =>
  str.normalize('NFD').replace(/[̀-ͯ]/g, '');

/**
 * Formate une durée en secondes en format lisible (ex: 1h30, 45min, 30s)
 * @param seconds Durée en secondes
 * @returns Durée formatée
 */
export const formatDuration = (seconds: number): string => {
  const totalMinutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Si moins d'une minute, afficher en secondes uniquement
  if (totalMinutes === 0) {
    return `${seconds}s`;
  }

  // Si moins d'une heure
  if (totalMinutes < 60) {
    if (remainingSeconds > 0) {
      return `${totalMinutes}min${remainingSeconds}s`;
    }
    return `${totalMinutes}min`;
  }

  // Sinon afficher en heures et minutes (on ignore les secondes)
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h${mins.toString().padStart(2, '0')}`;
};

export const formatExerciseMetric = (
  ex: BlockExercise,
  blockType: BlockType
): string => {
  const effort = ex.reps
    ? `${ex.reps} reps`
    : ex.duration
      ? formatDuration(ex.duration)
      : ex.customMetric
        ? `${ex.customMetric.value} ${ex.customMetric.unit}`
        : '';

  if (!effort) return '';
  if (blockSupportsSets(blockType) && ex.sets && ex.sets > 1) {
    return `${ex.sets} × ${effort}`;
  }
  return effort;
};
