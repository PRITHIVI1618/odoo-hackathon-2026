import { useState, useEffect } from "react"
import { Trophy, Target, Award, Star, Gift, LayoutDashboard } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/store/useAuthStore"
import { GamificationService } from "@/services/gamificationApi"
import type {
  GamificationDashboardResponse, 
  LeaderboardEntryResponse, 
  DepartmentLeaderboardResponse, 
  Challenge, 
  Badge, 
  Reward 
} from "@/services/gamificationApi"

import {
  PersonalDashboardTab,
  LeaderboardsTab,
  ChallengesTab,
  BadgesTab,
  RewardsTab
} from "./gamification/index"

export function Gamification() {
  const user = useAuthStore(state => state.user);
  
  const [dashboardData, setDashboardData] = useState<GamificationDashboardResponse | null>(null);
  const [empLeaderboard, setEmpLeaderboard] = useState<LeaderboardEntryResponse[]>([]);
  const [deptLeaderboard, setDeptLeaderboard] = useState<DepartmentLeaderboardResponse[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [dash, emp, dept, chall, b, rew] = await Promise.all([
        GamificationService.getPersonalDashboard(user.id),
        GamificationService.getEmployeeLeaderboard(),
        GamificationService.getDepartmentLeaderboard(),
        GamificationService.getAllChallenges(),
        GamificationService.getAllBadges(),
        GamificationService.getAllRewards()
      ]);
      setDashboardData(dash);
      setEmpLeaderboard(emp);
      setDeptLeaderboard(dept);
      setChallenges(chall);
      setBadges(b);
      setRewards(rew);
    } catch (error) {
      console.error("Failed to fetch gamification data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Gamification Engine
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading Gamification Engine...
        </div>
      ) : (
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto gap-2 bg-transparent p-0">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground glass p-3">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="leaderboards" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground glass p-3">
              <Trophy className="w-4 h-4 mr-2" /> Leaderboards
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground glass p-3">
              <Target className="w-4 h-4 mr-2" /> Challenges
            </TabsTrigger>
            <TabsTrigger value="badges" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground glass p-3">
              <Star className="w-4 h-4 mr-2" /> Badges
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground glass p-3">
              <Gift className="w-4 h-4 mr-2" /> Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <PersonalDashboardTab data={dashboardData} />
          </TabsContent>
          <TabsContent value="leaderboards">
            <LeaderboardsTab employees={empLeaderboard} departments={deptLeaderboard} />
          </TabsContent>
          <TabsContent value="challenges">
            <ChallengesTab challenges={challenges} />
          </TabsContent>
          <TabsContent value="badges">
            <BadgesTab allBadges={badges} earnedBadges={dashboardData?.earnedBadges || []} />
          </TabsContent>
          <TabsContent value="rewards">
            <RewardsTab rewards={rewards} currentXp={dashboardData?.currentXp || 0} refetch={fetchData} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
