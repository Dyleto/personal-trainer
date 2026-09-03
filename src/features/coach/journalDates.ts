/**
 * Clé de jour locale, « 2026-03-07 ».
 *
 * `toISOString()` bascule en UTC : une séance enregistrée à 22 h à Paris
 * tomberait la veille dans la grille. On lit donc la date telle que
 * l'affiche le navigateur du coach.
 */
export const dayKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** « lundi 7 mars » — l'en-tête du jour sélectionné. */
export const formatDayLabel = (key: string): string => {
  const [year, month, day] = key.split('-').map(Number);
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(year, month - 1, day));
};
