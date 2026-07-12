import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { socialApi } from "@/services/socialApi"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { Activity, Users, Clock, Award, GraduationCap, TrendingUp, BarChart3, PieChart as PieIcon } from 'lucide-react'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export function SocialDashboardTab() {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['social-kpis'],
    queryFn: socialApi.getKpis
  })

  const { data: deptScores, isLoading: scoresLoading } = useQuery({
    queryKey: ['social-department-scores'],
    queryFn: socialApi.getDepartmentScores
  })

  const { data: genderData, isLoading: genderLoading } = useQuery({
    queryKey: ['social-gender-distribution'],
    queryFn: socialApi.getGenderDistribution
  })

  const { data: csrTrend, isLoading: trendLoading } = useQuery({
    queryKey: ['social-csr-trend'],
    queryFn: socialApi.getCsrTrend
  })

  if (kpisLoading || scoresLoading || genderLoading || trendLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-32 bg-secondary/20" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Social Score</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-full">
              <Award className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.overallSocialScore?.toFixed(1) || 0}</div>
            <p className="text-xs text-emerald-500 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Company Average
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Participants</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.activeParticipants || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all departments</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Volunteer Hours</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-full">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.totalVolunteerHours?.toFixed(1) || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total contributed hours</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Training Completion</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-full">
              <GraduationCap className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.averageTrainingCompletion?.toFixed(1) || 0}%</div>
            <Progress value={kpis?.averageTrainingCompletion || 0} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSR Trend Chart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              CSR Activities Trend
            </CardTitle>
            <CardDescription>Monthly CSR activity occurrences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={csrTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="label" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(var(--background), 0.9)', borderColor: 'rgba(var(--border))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--color-primary, #10b981)" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gender Distribution Chart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold">
              <PieIcon className="h-5 w-5 mr-2 text-primary" />
              Diversity Metrics
            </CardTitle>
            <CardDescription>Gender distribution across the organization</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="label"
                  >
                    {(genderData || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(var(--background), 0.9)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {(genderData || []).map((entry: any, index: number) => (
                  <div key={entry.label} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm font-medium">{entry.label} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Scores */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-semibold">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            Department Social Scores
          </CardTitle>
          <CardDescription>Social score ranking by department (Max 100)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptScores || []} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} className="text-xs" />
                <YAxis dataKey="departmentName" type="category" width={150} className="text-xs font-medium" />
                <Tooltip 
                  cursor={{ fill: 'rgba(var(--muted), 0.2)' }}
                  contentStyle={{ backgroundColor: 'rgba(var(--background), 0.9)', borderColor: 'rgba(var(--border))' }}
                />
                <Bar dataKey="score" name="Social Score" radius={[0, 4, 4, 0]}>
                  {(deptScores || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
