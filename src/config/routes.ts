import { User } from '@/types';

const PUBLIC_ROUTES = new Set(['/login', '/auth/callback', '/join']);

export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.has(pathname);
};

export const getDefaultRoleRoute = (user: User | null): string => {
  if (!user) return '/login';
  if (user.isAdmin) return '/admin';
  if (user.isCoach) return '/coach';
  if (user.isClient) return '/client';
  return '/no-role';
};

export const CLIENT_ROUTES = {
  today: '/client',
  program: '/client/program',
  session: '/client/session',
  sessionById: (sessionId: string) => `/client/session/${sessionId}`,
  history: '/client/history',
};

export const COACH_ROUTES = {
  clients: '/coach',
  clientDetails: (clientId: string) => `/coach/clients/${clientId}`,
  clientSession: (clientId: string, sessionIndex: number) =>
    `/coach/clients/${clientId}/s/${sessionIndex}`,
  clientJournal: (clientId: string) => `/coach/clients/${clientId}/journal`,
  exercises: '/coach/exercises',
  exerciseDetails: (exerciseId: string) => `/coach/exercises/${exerciseId}`,
};

export const NO_ROLE_ROUTES = {
  main: '/no-role',
};
