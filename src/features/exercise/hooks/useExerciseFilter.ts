import { useMemo } from "react";
import { Exercise } from "@/types";

export const useExerciseFilter = (exercises: Exercise[], searchQuery: string) =>
  useMemo(
    () =>
      exercises.filter((ex) =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [exercises, searchQuery],
  );
