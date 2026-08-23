import {
  LuBicepsFlexed,
  LuBrain,
  LuMoon,
  LuSmile,
  LuZap,
} from 'react-icons/lu';
import { SessionMetrics } from '@/types';
import { IconType } from 'react-icons';

export type MetricConfigEntry = {
  key: keyof SessionMetrics;
  Icon: IconType;
  label: string;
  lowLabel: string;
  highLabel: string;
};

export const METRICS_CONFIG: MetricConfigEntry[] = [
  {
    key: 'stress',
    Icon: LuBrain,
    label: 'Stress',
    lowLabel: 'Calme',
    highLabel: 'Stressé',
  },
  {
    key: 'mood',
    Icon: LuSmile,
    label: 'Humeur',
    lowLabel: 'Morose',
    highLabel: 'Excellente',
  },
  {
    key: 'energy',
    Icon: LuZap,
    label: 'Énergie',
    lowLabel: 'Épuisé',
    highLabel: 'Débordant',
  },
  {
    key: 'sleep',
    Icon: LuMoon,
    label: 'Sommeil',
    lowLabel: 'Mauvais',
    highLabel: 'Excellent',
  },
  {
    key: 'soreness',
    Icon: LuBicepsFlexed,
    label: 'Douleurs',
    lowLabel: 'Aucune',
    highLabel: 'Intenses',
  },
];

export const CLIENT_CONTENT_MAX_W = '640px';
export const CLIENT_GRID_MAX_W = '5xl';
