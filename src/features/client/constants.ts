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
};

export const METRICS_CONFIG: MetricConfigEntry[] = [
  { key: 'stress', Icon: LuBrain, label: 'Stress' },
  { key: 'mood', Icon: LuSmile, label: 'Humeur' },
  { key: 'energy', Icon: LuZap, label: 'Énergie' },
  { key: 'sleep', Icon: LuMoon, label: 'Sommeil' },
  { key: 'soreness', Icon: LuBicepsFlexed, label: 'Douleurs' },
];

export const CLIENT_CONTENT_MAX_W = '640px';

export const CLIENT_GRID_MAX_W = '5xl';
