import { api } from '@/lib/axios';

// --- CSR Activities ---
export const socialApi = {
  getCsrActivities: async () => {
    const res = await api.get('/social/csr');
    return res.data;
  },
  createCsrActivity: async (data: any) => {
    const res = await api.post('/social/csr', data);
    return res.data;
  },
  updateCsrActivity: async (id: number, data: any) => {
    const res = await api.put(`/social/csr/${id}`, data);
    return res.data;
  },
  deleteCsrActivity: async (id: number) => {
    const res = await api.delete(`/social/csr/${id}`);
    return res.data;
  },

  // --- Employee Participations ---
  getParticipations: async () => {
    const res = await api.get('/social/participations');
    return res.data;
  },
  createParticipation: async (data: any) => {
    const res = await api.post('/social/participations', data);
    return res.data;
  },
  updateParticipation: async (id: number, data: any) => {
    const res = await api.put(`/social/participations/${id}`, data);
    return res.data;
  },
  deleteParticipation: async (id: number) => {
    const res = await api.delete(`/social/participations/${id}`);
    return res.data;
  },

  // --- Training Programs ---
  getTrainingPrograms: async () => {
    const res = await api.get('/social/training');
    return res.data;
  },
  createTrainingProgram: async (data: any) => {
    const res = await api.post('/social/training', data);
    return res.data;
  },
  updateTrainingProgram: async (id: number, data: any) => {
    const res = await api.put(`/social/training/${id}`, data);
    return res.data;
  },
  deleteTrainingProgram: async (id: number) => {
    const res = await api.delete(`/social/training/${id}`);
    return res.data;
  },

  // --- Dashboard Analytics ---
  getKpis: async () => {
    const res = await api.get('/social/dashboard/kpis');
    return res.data;
  },
  getDepartmentScores: async () => {
    const res = await api.get('/social/dashboard/department-scores');
    return res.data;
  },
  getGenderDistribution: async () => {
    const res = await api.get('/social/dashboard/gender-distribution');
    return res.data;
  },
  getCsrTrend: async () => {
    const res = await api.get('/social/dashboard/csr-trend');
    return res.data;
  }
};
