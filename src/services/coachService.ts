import api from '@/config/api';
import { Client, ClientWithDetails, CompletedSession, Exercise } from '@/types';

export const coachService = {
  getClients: async () => {
    const { data } = await api.get<Client[]>('/api/coach/clients');
    return data;
  },

  getClientDetails: async (clientId: string) => {
    const { data } = await api.get<ClientWithDetails>(
      `/api/coach/clients/${clientId}`
    );
    return data;
  },

  getClientHistory: async (clientId: string) => {
    const { data } = await api.get<CompletedSession[]>(
      `/api/coach/clients/${clientId}/history`
    );
    return data;
  },

  markClientHistoryAsViewed: async (clientId: string) => {
    await api.patch(`/api/coach/clients/${clientId}/history/mark-viewed`);
  },

  getExercises: async () => {
    const { data } = await api.get<Exercise[]>('/api/coach/exercises');
    return data;
  },

  createExercise: async (exerciseData: Partial<Exercise>) => {
    const { data } = await api.post<Exercise>(
      '/api/coach/exercises',
      exerciseData
    );
    return data;
  },

  generateInvitation: async (expiresIn = 7) => {
    const { data } = await api.post('/api/coach/generate-invitation', {
      expiresIn,
    });
    return data;
  },
};
