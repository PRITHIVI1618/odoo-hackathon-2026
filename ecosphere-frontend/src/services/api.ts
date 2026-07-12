import { api } from '@/lib/axios';

// Placeholder delay function for mock responses
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AuthService = {
  login: async (credentials: any) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (data: any) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await api.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`);
    return res.data;
  }
};

// User Services
export const userService = {
  getUsers: async () => {
    const res = await api.get('/users')
    return res.data
  },
  getUser: async (id: number) => {
    const res = await api.get(`/users/${id}`)
    return res.data
  },
  createUser: async (data: any) => {
    const res = await api.post('/users', data)
    return res.data
  },
  updateUser: async (id: number, data: any) => {
    const res = await api.put(`/users/${id}`, data)
    return res.data
  },
  deleteUser: async (id: number) => {
    const res = await api.delete(`/users/${id}`)
    return res.data
  }
}

// Department Services
export const departmentService = {
  getDepartments: async () => {
    const res = await api.get('/departments')
    return res.data
  },
  createDepartment: async (data: any) => {
    const res = await api.post('/departments', data)
    return res.data
  },
  updateDepartment: async (id: number, data: any) => {
    const res = await api.put(`/departments/${id}`, data)
    return res.data
  },
  deleteDepartment: async (id: number) => {
    const res = await api.delete(`/departments/${id}`)
    return res.data
  }
}

// Role Services
export const roleService = {
  getRoles: async () => {
    const res = await api.get('/roles')
    return res.data
  }
}

export const DashboardService = {
  getOverviewMetrics: async () => {
    // In production, this would be: return api.get('/dashboard/metrics').then(res => res.data);
    await delay(800); // Simulate network latency
    
    return {
      totalCarbonEmissions: 45231.89,
      carbonTrend: -12.5,
      waterUsage: 2350,
      waterTrend: -5.2,
      energyConsumption: 12234,
      energyTrend: -8.4,
      esgScore: 82,
      esgTrend: "+4.1",
    };
  },

  getEmissionHistory: async () => {
    await delay(1000);
    return [
      { name: "Jan", emissions: 4000, target: 4500 },
      { name: "Feb", emissions: 3000, target: 4400 },
      { name: "Mar", emissions: 2000, target: 4300 },
      { name: "Apr", emissions: 2780, target: 4200 },
      { name: "May", emissions: 1890, target: 4100 },
      { name: "Jun", emissions: 2390, target: 4000 },
      { name: "Jul", emissions: 3490, target: 3900 },
    ];
  }
};
