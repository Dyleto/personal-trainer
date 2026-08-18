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
  programme: '/client/programme',
  seance: '/client/seance',
  historique: '/client/historique',
};
