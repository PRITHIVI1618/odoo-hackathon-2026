import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Award, Star, History } from "lucide-react"
import type { GamificationDashboardResponse } from "@/services/gamificationApi"

export function PersonalDashboardTab({ data }: { data: GamificationDashboardResponse | null }) {
  if (!data) return <div className="text-muted-foreground p-8">Loading dashboard...</div>;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Hero Card */}
        <Card className="glass md:col-span-2 row-span-2 flex flex-col justify-center items-center p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
              <circle 
                cx="64" cy="64" r="60" 
                stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray="377" 
                strokeDashoffset={377 - (377 * data.progressPercentage) / 100} 
                className="text-green-500 transition-all duration-1000 ease-out" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">Lvl {data.currentLevel}</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-2xl font-bold">{data.currentXp} XP</h3>
            <p className="text-muted-foreground">{data.xpToNextLevel - data.currentXp} XP to Level {data.currentLevel + 1}</p>
          </div>
        </Card>

        {/* KPIs */}
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{data.rank}</div>
            <p className="text-xs text-muted-foreground">Out of {data.totalEmployees} employees</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Challenges</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.challengesCompleted}</div>
            <p className="text-xs text-muted-foreground">Completed out of {data.totalChallenges} active</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards</CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.rewardsRedeemed}</div>
            <p className="text-xs text-muted-foreground">Total rewards redeemed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Badges */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Earned Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.earnedBadges.length === 0 ? (
              <p className="text-muted-foreground text-sm">No badges earned yet. Complete challenges to unlock them!</p>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {data.earnedBadges.map(badge => (
                  <div key={badge.id} className="flex flex-col items-center group relative cursor-help">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 shadow-sm group-hover:scale-110 transition-transform">
                      {/* Using first letter as a placeholder icon since we don't have images */}
                      <span className="text-2xl font-bold text-yellow-600">{badge.icon || badge.name.charAt(0)}</span>
                    </div>
                    <span className="text-xs text-center mt-2 font-medium line-clamp-2">{badge.name}</span>
                    <div className="absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background border p-2 rounded shadow-lg text-xs w-48 z-10 pointer-events-none transform -translate-y-full">
                      <strong>{badge.name}</strong><br/>
                      {badge.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievement Timeline */}
        <Card className="glass overflow-hidden flex flex-col h-[400px]">
          <CardHeader className="bg-muted/30 pb-4 border-b">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="p-4 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
              {data.recentActivity.map((activity, index) => (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-background bg-blue-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-3 rounded bg-muted/30 border shadow-sm transition-all hover:shadow-md hover:bg-muted/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        activity.actionType === 'CHALLENGE_COMPLETED' ? 'bg-green-500/10 text-green-500' :
                        activity.actionType === 'BADGE_EARNED' ? 'bg-yellow-500/10 text-yellow-600' :
                        activity.actionType === 'REWARD' ? 'bg-purple-500/10 text-purple-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {activity.actionType.replace('_', ' ')}
                      </span>
                      <time className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </time>
                    </div>
                    <div className="text-sm font-medium">{activity.title}</div>
                    {activity.xpEarned > 0 && (
                      <div className="text-xs text-green-500 font-bold mt-1">+{activity.xpEarned} XP</div>
                    )}
                    {activity.xpEarned < 0 && (
                      <div className="text-xs text-red-500 font-bold mt-1">{activity.xpEarned} XP</div>
                    )}
                  </div>
                </div>
              ))}
              {data.recentActivity.length === 0 && (
                <div className="text-center text-muted-foreground p-8">No recent activity. Start engaging to earn XP!</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
