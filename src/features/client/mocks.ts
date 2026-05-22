import { ClientProgram, CompletedSession } from "@/types";

export const mockProgram: ClientProgram = {
  sessions: [
    {
      _id: "s1",
      order: 1,
      notes: "Séance 1 : Focus chaîne postérieure. Concentre-toi bien sur le hip hinge.",
      blocks: [
        {
          _id: "b1",
          type: "warmup",
          order: 1,
          exercises: [
            {
              exercise: {
                _id: "e1",
                name: "Sauts à la corde",
                createdBy: "c1",
                createdAt: new Date(),
                updatedAt: new Date(),
                description: "Garde les poignets souples et reste sur la pointe des pieds.",
                videoUrl: "https://www.youtube.com/watch?v=FjIvwlXqGgg",
              },
              order: 1,
              duration: 120,
            },
            {
              exercise: {
                _id: "e2",
                name: "Mobilité hanches (90/90)",
                createdBy: "c1",
                createdAt: new Date(),
                updatedAt: new Date(),
                description: "Prends ton temps pour chercher l'amplitude.",
              },
              order: 2,
              reps: 10,
            },
          ],
        },
        {
          _id: "b2",
          type: "classic",
          order: 2,
          rounds: 4,
          restBetweenRounds: 90,
          exercises: [
            {
              exercise: {
                _id: "e3",
                name: "Kettlebell Swing",
                createdBy: "c1",
                createdAt: new Date(),
                updatedAt: new Date(),
                description: "Le mouvement part de tes hanches. Serre fort les fessiers en haut !",
                videoUrl: "https://www.youtube.com/watch?v=sjc5wTzHXM4",
              },
              order: 1,
              sets: 4,
              reps: 15,
              restBetweenSets: 60,
            },
            {
              exercise: {
                _id: "e4",
                name: "Goblet Squat",
                createdBy: "c1",
                createdAt: new Date(),
                updatedAt: new Date(),
                description: "Descends en gardant les coudes à l'intérieur de tes genoux.",
                videoUrl: "https://www.youtube.com/watch?v=MeIiIdhgPug",
              },
              order: 2,
              sets: 4,
              reps: 12,
              restBetweenSets: 60,
            },
          ],
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "s2",
      order: 2,
      notes: "Séance 2 : Haut du corps. Maintiens le gainage sur tous les mouvements pressés.",
      blocks: [
        {
          _id: "b3",
          type: "warmup",
          order: 1,
          exercises: [
            {
              exercise: {
                _id: "e5",
                name: "KB Halos",
                createdBy: "c1",
                createdAt: new Date(),
                updatedAt: new Date(),
                description: "Garde la KB proche de ta tête et ne bouge pas le torse.",
              },
              order: 1,
              reps: 10,
            },
          ],
        },
        {
          _id: "b4",
          type: "classic",
          order: 2,
          rounds: 3,
          restBetweenRounds: 120,
          exercises: [
            {
              exercise: {
                _id: "e6",
                name: "Strict Press unilatéral",
                createdBy: "c1",
                createdAt: new Date(),
                updatedAt: new Date(),
                description: "Serre les abdos et les fessiers. Le bras doit être tendu proche de l'oreille.",
              },
              order: 1,
              sets: 3,
              reps: 8,
              restBetweenSets: 45,
            },
            {
              exercise: {
                _id: "e7",
                name: "Gorilla Row",
                createdBy: "c1",
                createdAt: new Date(),
                updatedAt: new Date(),
                description: "Garde le buste parallèle au sol. Tire la KB vers ta hanche.",
              },
              order: 2,
              sets: 3,
              reps: 10,
              restBetweenSets: 45,
            },
          ],
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "s3",
      order: 3,
      notes: "Séance 3 : Travail dynamique et explosivité. Qualité > Vitesse.",
      blocks: [
        {
          _id: "b5",
          type: "warmup",
          order: 1,
          exercises: [
            {
              exercise: {
                _id: "e8",
                name: "Jumping Jacks",
                createdBy: "c1",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              order: 1,
              duration: 60,
            },
          ],
        },
        {
          _id: "b6",
          type: "emom",
          order: 2,
          durationMinutes: 10,
          exercises: [
            {
              exercise: {
                _id: "e9",
                name: "Kettlebell Clean",
                createdBy: "c1",
                createdAt: new Date(),
                updatedAt: new Date(),
                description: "La KB doit arriver doucement en position de rack. Utilise l'élan des hanches !",
                videoUrl: "https://www.youtube.com/watch?v=twyEq-oW6X8",
              },
              order: 1,
              reps: 8,
            },
          ],
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

export const mockCompleted: CompletedSession[] = [
  {
    _id: "log1",
    completedAt: new Date("2026-02-24"),
    originalSessionId: "s1",
    sessionOrder: 1,
    coachNotes: "Bien s'hydrater avant cette séance.",
    blocks: [
      {
        type: "warmup",
        order: 1,
        exercises: [
          {
            exercise: { _id: "e1", name: "Sauts à la corde" },
            order: 1,
            duration: 120,
          },
          {
            exercise: { _id: "e2", name: "Mobilité hanches" },
            order: 2,
            reps: 10,
          },
        ],
      },
      {
        type: "classic",
        order: 2,
        rounds: 4,
        restBetweenRounds: 90,
        exercises: [
          {
            exercise: { _id: "e3", name: "Kettlebell Swing" },
            order: 1,
            sets: 4,
            reps: 15,
            restBetweenSets: 60,
          },
          {
            exercise: { _id: "e4", name: "Goblet Squat" },
            order: 2,
            sets: 4,
            reps: 12,
            restBetweenSets: 60,
          },
        ],
      },
    ],
    metrics: { stress: 3, mood: 4, energy: 3, sleep: 4, soreness: 2 },
    clientNotes: "Bonne séance, un peu fatigué sur les derniers rounds.",
    viewedByCoach: true,
  },
  {
    _id: "log2",
    completedAt: new Date("2026-02-27"),
    originalSessionId: "s2",
    sessionOrder: 2,
    blocks: [
      {
        type: "warmup",
        order: 1,
        exercises: [
          {
            exercise: { _id: "e5", name: "KB Halos" },
            order: 1,
            reps: 10,
          },
        ],
      },
      {
        type: "classic",
        order: 2,
        rounds: 3,
        restBetweenRounds: 120,
        exercises: [
          {
            exercise: { _id: "e6", name: "Strict Press unilatéral" },
            order: 1,
            sets: 3,
            reps: 8,
            restBetweenSets: 45,
          },
          {
            exercise: { _id: "e7", name: "Gorilla Row" },
            order: 2,
            sets: 3,
            reps: 10,
            restBetweenSets: 45,
          },
        ],
      },
    ],
    metrics: { stress: 2, mood: 5, energy: 4, sleep: 5, soreness: 3 },
    clientNotes: "",
    viewedByCoach: true,
  },
];
