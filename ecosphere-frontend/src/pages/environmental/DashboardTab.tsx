import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { analyticsService, goalService } from "@/services/environmentalApi"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { Cloud, Zap, Droplets, Target, Loader2, ArrowDownRight, ArrowUpRight } from "lucide-react"

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function DashboardTab() {
  const { data: kpis, isLoading: kpiLoading } = useQuery({
    queryKey: ['env-kpis'],
    queryFn: analyticsService.getKpis,
    refetchInterval: 10000 // Refetch every 10s for live feel
  })

  const { data: deptScores = [] } = useQuery({
    queryKey: ['env-dept-scores'],
    queryFn: analyticsService.getDepartmentScores
  })

  const { data: monthlyTrend = [] } = useQuery({
    queryKey: ['env-monthly-trend'],
    queryFn: analyticsService.getMonthlyTrend
  })

  const { data: sourceDist = [] } = useQuery({
    queryKey: ['env-source-dist'],
    queryFn: analyticsService.getSourceDistribution
  })

  const { data: goals = [] } = useQuery({
    queryKey: ['env-active-goals'],
    queryFn: goalService.getGoals
  })

  if (kpiLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  const formatNumber = (num: number) => num ? num.toLocaleString(undefined, { maximumFractionDigits: 1 }) : "0"

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Carbon Emissions</CardTitle>
            <Cloud className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(kpis?.totalCarbonEmissions)} <span className="text-sm font-normal text-muted-foreground">kgCO2e</span></div>
          </CardContent>
        </Card>
        <Card className="glass shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Emissions</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(kpis?.todaysEmissions)} <span className="text-sm font-normal text-muted-foreground">kgCO2e</span></div>
          </CardContent>
        </Card>
        <Card className="glass shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Average</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(kpis?.monthlyEmissions)} <span className="text-sm font-normal text-muted-foreground">kgCO2e</span></div>
          </CardContent>
        </Card>
        <Card className="glass shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sustainability Goals</CardTitle>
            <Target className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.activeGoals} Active</div>
            <p className="text-xs text-muted-foreground mt-1">{kpis?.completedGoals} Completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        
        {/* Main Chart */}
        <Card className="col-span-4 glass shadow-sm">
          <CardHeader>
            <CardTitle>Emission Trajectory (6 Months)</CardTitle>
            <CardDescription>Monthly carbon emission trends across all departments.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEmission" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="emissions" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorEmission)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Scores */}
        <Card className="col-span-3 glass shadow-sm">
          <CardHeader>
            <CardTitle>Department Environmental Score</CardTitle>
            <CardDescription>Normalized performance (100 = Zero Emissions)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {deptScores.map((dept: any, i: number) => (
              <div key={dept.departmentId} className="flex items-center">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">{dept.departmentName}</p>
                    <span className="text-sm font-bold text-primary">{dept.score}/100</span>
                  </div>
                  <Progress value={dept.score} className="h-2" />
                </div>
              </div>
            ))}
            {deptScores.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">No departmental data available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Source Distribution */}
        <Card className="glass shadow-sm">
          <CardHeader>
            <CardTitle>Emission Sources</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="source"
                >
                  {sourceDist.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Goals Tracker */}
        <Card className="glass shadow-sm">
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 overflow-y-auto max-h-[300px] pr-2">
            {goals.filter((g: any) => g.status === 'ACTIVE').map((goal: any) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{goal.title}</span>
                  <span className="text-muted-foreground">{goal.currentReduction}% / {goal.targetReduction}%</span>
                </div>
                <Progress value={(goal.currentReduction / goal.targetReduction) * 100} className="h-2 bg-secondary" />
                <p className="text-xs text-muted-foreground text-right">Deadline: {new Date(goal.endDate).toLocaleDateString()}</p>
              </div>
            ))}
            {goals.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">No active goals.</p>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
