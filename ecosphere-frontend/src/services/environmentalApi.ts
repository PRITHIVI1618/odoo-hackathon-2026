import { api } from '@/lib/axios';

// --- EMISSION FACTORS ---
export const factorService = {
  getFactors: async () => {
    const res = await api.get('/environmental/factors')
    return res.data
  },
  createFactor: async (data: any) => {
    const res = await api.post('/environmental/factors', data)
    return res.data
  },
  updateFactor: async (id: number, data: any) => {
    const res = await api.put(`/environmental/factors/${id}`, data)
    return res.data
  },
  deleteFactor: async (id: number) => {
    const res = await api.delete(`/environmental/factors/${id}`)
    return res.data
  }
}

// --- CARBON TRANSACTIONS ---
export const transactionService = {
  getTransactions: async () => {
    const res = await api.get('/environmental/transactions')
    return res.data
  },
  createTransaction: async (data: any) => {
    const res = await api.post('/environmental/transactions', data)
    return res.data
  },
  updateTransaction: async (id: number, data: any) => {
    const res = await api.put(`/environmental/transactions/${id}`, data)
    return res.data
  },
  deleteTransaction: async (id: number) => {
    const res = await api.delete(`/environmental/transactions/${id}`)
    return res.data
  }
}

// --- ENVIRONMENTAL GOALS ---
export const goalService = {
  getGoals: async () => {
    const res = await api.get('/environmental/goals')
    return res.data
  },
  createGoal: async (data: any) => {
    const res = await api.post('/environmental/goals', data)
    return res.data
  },
  updateGoal: async (id: number, data: any) => {
    const res = await api.put(`/environmental/goals/${id}`, data)
    return res.data
  },
  deleteGoal: async (id: number) => {
    const res = await api.delete(`/environmental/goals/${id}`)
    return res.data
  }
}

// --- DASHBOARD ANALYTICS ---
export const analyticsService = {
  getKpis: async () => {
    const res = await api.get('/environmental/dashboard/kpis')
    return res.data
  },
  getDepartmentScores: async () => {
    const res = await api.get('/environmental/dashboard/department-scores')
    return res.data
  },
  getMonthlyTrend: async () => {
    const res = await api.get('/environmental/dashboard/monthly-trend')
    return res.data
  },
  getSourceDistribution: async () => {
    const res = await api.get('/environmental/dashboard/source-distribution')
    return res.data
  }
}
