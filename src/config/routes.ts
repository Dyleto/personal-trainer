const PUBLIC_ROUTES = new Set(['/login', '/auth/callback', '/join']);

export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.has(pathname);
};
