import { api } from '@/lib/axios';

export interface GamificationDashboardResponse {
  currentXp: number;
  currentLevel: number;
  xpToNextLevel: number;
  progressPercentage: number;
  rank: number;
  totalEmployees: number;
  challengesCompleted: number;
  totalChallenges: number;
  rewardsRedeemed: number;
  earnedBadges: Badge[];
  recentActivity: AchievementTimeline[];
}

export interface Badge {
  id: number;
  name: string;
  icon: string;
  description: string;
  unlockCriteria: string;
  category: string;
  createdAt: string;
}

export interface AchievementTimeline {
  id: number;
  actionType: string;
  title: string;
  xpEarned: number;
  timestamp: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  category: string;
  targetType: string;
  targetValue: number;
  xpReward: number;
  badgeReward?: Badge;
  startDate: string;
  endDate: string;
  status: string;
}

export interface Reward {
  id: number;
  title: string;
  description: string;
  pointsRequired: number;
  stock: number;
  status: string;
}

export interface RewardRedemption {
  id: number;
  redeemedDate: string;
  pointsUsed: number;
  status: string;
}

export interface LeaderboardEntryResponse {
  rank: number;
  employeeId: number;
  employeeName: string;
  departmentName: string;
  avatarUrl: string;
  xp: number;
  level: number;
  badgesCount: number;
  challengesCompleted: number;
}

export interface DepartmentLeaderboardResponse {
  rank: number;
  departmentId: number;
  departmentName: string;
  totalXp: number;
  activeEmployees: number;
  totalBadges: number;
}

export const GamificationService = {
  getPersonalDashboard: async (employeeId: number): Promise<GamificationDashboardResponse> => {
    const response = await api.get(`/gamification/dashboard/${employeeId}`);
    return response.data;
  },

  getEmployeeLeaderboard: async (): Promise<LeaderboardEntryResponse[]> => {
    const response = await api.get('/gamification/leaderboard/employee');
    return response.data;
  },

  getDepartmentLeaderboard: async (): Promise<DepartmentLeaderboardResponse[]> => {
    const response = await api.get('/gamification/leaderboard/department');
    return response.data;
  },

  getAllChallenges: async (): Promise<Challenge[]> => {
    const response = await api.get('/gamification/challenges');
    return response.data;
  },

  getAllBadges: async (): Promise<Badge[]> => {
    const response = await api.get('/gamification/badges');
    return response.data;
  },

  getAllRewards: async (): Promise<Reward[]> => {
    const response = await api.get('/gamification/rewards');
    return response.data;
  },

  redeemReward: async (rewardId: number, employeeId: number): Promise<RewardRedemption> => {
    const response = await api.post(`/gamification/rewards/${rewardId}/redeem/${employeeId}`);
    return response.data;
  }
};
