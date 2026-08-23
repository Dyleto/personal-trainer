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
  return '/login';
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
  exercises: '/coach/exercises',
};
