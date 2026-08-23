import { BlockType, SessionBlock } from '@/types';

export const BLOCK_TYPE_CONFIG: Record<BlockType, { label: string }> = {
  warmup: { label: 'Échauffement' },
  emom: { label: 'EMOM' },
  every: { label: 'Every' },
  amrap: { label: 'AMRAP' },
  timecap: { label: 'TimeCap' },
  chipper: { label: 'Chipper' },
  classic: { label: 'Classique' },
  tabata: { label: 'Tabata' },
  onoff: { label: 'On / Off' },
  pyramid: { label: 'Pyramide' },
  ladder: { label: 'Échelle' },
};

export const BLOCK_DESCRIPTIONS: Record<BlockType, string> = {
  warmup: 'Échauffement libre',
  classic: 'Séries & reps classiques',
  emom: 'Exos toutes les minutes',
  every: 'Circuit toutes les X min',
  amrap: 'Max de tours en temps limité',
  timecap: 'Terminer avant la limite',
  chipper: 'Liste à faire en 1 passe',
  tabata: 'Travail / Repos en alternance',
  onoff: 'Xon / Xoff × N tours',
  pyramid: 'Reps qui montent et descendent',
  ladder: 'Reps qui augmentent ou diminuent',
};

export const getBlockDescription = (type: BlockType): string =>
  BLOCK_DESCRIPTIONS[type] ?? '';

export const BLOCK_TYPES_ORDERED: BlockType[] = [
  'warmup',
  'classic',
  'emom',
  'every',
  'amrap',
  'timecap',
  'chipper',
  'tabata',
  'onoff',
  'pyramid',
  'ladder',
];

export const blockSupportsSets = (type: BlockType): boolean =>
  type === 'classic';

// Blocs où le timing est entièrement défini par le schéma du bloc (aucune métrique par exercice)
export const blockDefinesOwnMetrics = (type: BlockType): boolean =>
  ['pyramid', 'ladder'].includes(type);

// Blocs où seul un nombre de reps cible par exercice a du sens (pas de durée ni mesure)
export const blockSupportsRepsOnly = (type: BlockType): boolean =>
  ['tabata', 'onoff'].includes(type);

export const getBlockLabel = (type: BlockType): string =>
  BLOCK_TYPE_CONFIG[type]?.label ?? type;

export type BlockAccent = 'work' | 'rest' | 'neutral';

// Le repos y est une donnée nommée du schéma (Tabata, On/Off) : accent repos.
// L'échauffement n'est ni l'effort principal ni du repos : neutre. Tout le
// reste est de l'effort continu ou enchaîné, où un repos éventuel n'est
// qu'un détail de réglage, pas ce que le bloc représente.
export const getBlockAccent = (type: BlockType): BlockAccent => {
  if (blockSupportsRepsOnly(type)) return 'rest';
  if (type === 'warmup') return 'neutral';
  return 'work';
};

export const blockIndexPrefix = (type: BlockType): boolean =>
  ['emom'].includes(type);

export const getBlockConfigSummary = (block: SessionBlock): string => {
  switch (block.type) {
    case 'emom':
      return block.rounds ? `${block.rounds} tours` : '';
    case 'amrap':
      return block.durationMinutes ? `${block.durationMinutes} min` : '';
    case 'timecap':
      return block.durationMinutes ? `${block.durationMinutes} min max` : '';
    case 'every':
      return [
        block.intervalMinutes && `${block.intervalMinutes}min`,
        block.rounds && `× ${block.rounds}`,
      ]
        .filter(Boolean)
        .join(' ');
    case 'tabata':
      return [
        block.workDuration !== undefined && `${block.workDuration}s`,
        block.restDuration !== undefined && `/ ${block.restDuration}s`,
      ]
        .filter(Boolean)
        .join(' ');

    case 'onoff':
      return [
        block.rounds && `${block.rounds}×`,
        block.workDuration !== undefined && `${block.workDuration}min`,
        block.restDuration !== undefined && `/ ${block.restDuration}min`,
      ]
        .filter(Boolean)
        .join(' ');
    case 'pyramid':
    case 'ladder': {
      const scheme = block.repsScheme?.join('-') ?? '';
      const rest = block.restBetweenRounds
        ? `${block.restBetweenRounds}s repos`
        : '';
      return [scheme, rest].filter(Boolean).join(' · ');
    }
    case 'chipper':
      return block.durationMinutes ? `${block.durationMinutes} min max` : '';
    default:
      return '';
  }
};
