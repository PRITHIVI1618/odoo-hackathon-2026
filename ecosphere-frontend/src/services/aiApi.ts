import axios from 'axios';

// Safe axios instance for AI calls - does NOT use the global 401-logout interceptor.
// This prevents the page from redirecting to /login if a specific AI endpoint
// fails (e.g., because the backend just restarted and is still warming up).
const safeApi = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

safeApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AiChatResponse {
  response: string;
  timestamp: string;
}

export interface NewsArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface WeatherData {
  weather: { id: number; main: string; description: string; icon: string }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: { speed: number; deg: number };
  name: string;
}

export interface ChatHistoryEntry {
  id: number;
  userMessage: string;
  aiResponse: string;
  timestamp: string;
}

export const aiApi = {
  chat: async (message: string): Promise<AiChatResponse> => {
    const response = await safeApi.post('/api/ai/chat', { message });
    return response.data;
  },

  generateSummary: async (module: string): Promise<AiChatResponse> => {
    const response = await safeApi.get(`/api/ai/summary/${module}`);
    return response.data;
  },

  getRecommendations: async (): Promise<AiChatResponse> => {
    const response = await safeApi.get('/api/ai/recommendations');
    return response.data;
  },

  analyzeDepartments: async (): Promise<AiChatResponse> => {
    const response = await safeApi.get('/api/ai/departments');
    return response.data;
  },

  analyzeTrends: async (): Promise<AiChatResponse> => {
    const response = await safeApi.get('/api/ai/trends');
    return response.data;
  },

  getPredictions: async (): Promise<AiChatResponse> => {
    const response = await safeApi.get('/api/ai/predictions');
    return response.data;
  },

  getNews: async (): Promise<NewsApiResponse> => {
    const response = await safeApi.get('/api/ai/news');
    return response.data;
  },

  getWeather: async (): Promise<WeatherData> => {
    const response = await safeApi.get('/api/ai/weather');
    return response.data;
  },

  getChatHistory: async (): Promise<ChatHistoryEntry[]> => {
    const response = await safeApi.get('/api/ai/history');
    return response.data;
  },

  clearChatHistory: async (): Promise<void> => {
    await safeApi.delete('/api/ai/history');
  },
};

