import { BlockSnapshot, Session, SessionBlock } from "@/types";

type BlockForDuration = Pick<
  SessionBlock | BlockSnapshot,
  | "type"
  | "durationMinutes"
  | "intervalMinutes"
  | "rounds"
  | "restBetweenRounds"
  | "workDuration"
  | "restDuration"
  | "repsScheme"
  | "exercises"
>;

const calculateBlockDuration = (block: BlockForDuration): number => {
  switch (block.type) {
    case "emom":
    case "amrap":
    case "timecap":
      return (block.durationMinutes || 0) * 60;

    case "every":
      // Le repos est implicite dans l'intervalle (temps restant après le travail)
      return (block.intervalMinutes || 0) * 60 * (block.rounds || 0);

    case "tabata":
      // Pas de rounds définis — durée non calculable, on retourne 0
      return 0;

    case "onoff": {
      const rounds = block.rounds || 0;
      return rounds * (block.workDuration || 0) + Math.max(0, rounds - 1) * (block.restDuration || 0);
    }

    case "pyramid":
    case "ladder": {
      const scheme = block.repsScheme || [];
      const exerciseTime =
        block.exercises.length * scheme.reduce((s, r) => s + r * 4, 0);
      const restTime = Math.max(0, scheme.length - 1) * (block.restBetweenRounds || 0);
      return exerciseTime + restTime;
    }

    case "warmup":
      return block.exercises.reduce((sum, ex) => {
        const perEx = (ex as { duration?: number }).duration
          ? (ex as { duration: number }).duration
          : (ex as { reps?: number }).reps
          ? (ex as { reps: number }).reps * 4
          : 0;
        return sum + perEx;
      }, 0);

    case "classic": {
      return block.exercises.reduce((sum, ex) => {
        const sets = (ex as { sets?: number }).sets || 1;
        const perSet = (ex as { duration?: number }).duration
          ? (ex as { duration: number }).duration
          : (ex as { reps?: number }).reps
          ? (ex as { reps: number }).reps * 4
          : (ex as { customMetric?: unknown }).customMetric
          ? 30
          : 0;
        const rest =
          sets > 1 ? (sets - 1) * ((ex as { restBetweenSets?: number }).restBetweenSets || 0) : 0;
        return sum + sets * perSet + rest;
      }, 0);
    }

    case "chipper": {
      if (block.durationMinutes) return block.durationMinutes * 60;
      return block.exercises.reduce((sum, ex) => {
        if ((ex as { duration?: number }).duration)
          return sum + (ex as { duration: number }).duration;
        if ((ex as { reps?: number }).reps)
          return sum + (ex as { reps: number }).reps * 4;
        if ((ex as { customMetric?: unknown }).customMetric) return sum + 60;
        return sum;
      }, 0);
    }

    default:
      return 0;
  }
};

export const calculateSessionDuration = (
  session: Session | { blocks: BlockSnapshot[] },
): number => {
  const raw = (session.blocks as BlockForDuration[]).reduce(
    (total, block) => total + calculateBlockDuration(block),
    0,
  );
  if (raw === 0) return 0;
  return Math.ceil(raw / 30) * 30;
};
