import { useQuery } from '@tanstack/react-query';
import api from '@/config/api';
import { queryKeys } from '@/config/queryKeys';

interface ActiveInvitation {
  token: string;
  expiresAt: string;
}

/**
 * Le lien d'invitation en cours, s'il en existe un.
 *
 * Le lien ne vivait que le temps d'un message de confirmation : passé le
 * toast, il n'était plus nulle part, et il fallait en régénérer un pour
 * recopier celui qu'on avait déjà.
 */
export const useActiveInvitation = () =>
  useQuery({
    queryKey: queryKeys.coach.invitation(),
    queryFn: async () => {
      const { data } = await api.get<ActiveInvitation | null>(
        '/api/coach/invitation'
      );
      return data;
    },
  });
