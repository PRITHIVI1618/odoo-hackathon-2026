import { api } from '@/lib/axios';

// Placeholder delay function for mock responses
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
