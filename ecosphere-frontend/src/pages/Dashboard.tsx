import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CloudRain, Droplet, Leaf, TrendingUp, TrendingDown, Zap } from "lucide-react"
import { DashboardService } from "@/services/api"
import { Loader } from "@/components/shared/Loader"
import { ErrorState } from "@/components/shared/ErrorState"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function Dashboard() {
  const { data: metrics, isLoading: isMetricsLoading, isError: isMetricsError, refetch: refetchMetrics } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: DashboardService.getOverviewMetrics,
  })

  const { data: history, isLoading: isHistoryLoading, isError: isHistoryError, refetch: refetchHistory } = useQuery({
    queryKey: ["dashboard-history"],
    queryFn: DashboardService.getEmissionHistory,
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  if (isMetricsError) return <ErrorState message="Failed to load dashboard metrics." retry={refetchMetrics} />
  if (isHistoryError) return <ErrorState message="Failed to load emission history." retry={refetchHistory} />

  return (
    <div className="flex-1 space-y-6 pb-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Executive Dashboard</h2>
      </div>
      
      {isMetricsLoading ? (
        <Card className="glass min-h-[140px] flex items-center justify-center">
          <Loader text="Aggregating ESG metrics..." />
        </Card>
      ) : (
        <motion.div 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <Card className="glass shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carbon Emissions</CardTitle>
                <CloudRain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalCarbonEmissions.toLocaleString()} tCO2e</div>
                <p className={`text-xs mt-1 flex items-center ${metrics && metrics.carbonTrend < 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics && metrics.carbonTrend < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                  {metrics?.carbonTrend}% from last year
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Energy Consumption</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.energyConsumption.toLocaleString()} MWh</div>
                <p className={`text-xs mt-1 flex items-center ${metrics && metrics.energyTrend < 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics && metrics.energyTrend < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                  {metrics?.energyTrend}% from last year
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
                <Droplet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.waterUsage.toLocaleString()} kL</div>
                <p className={`text-xs mt-1 flex items-center ${metrics && metrics.waterTrend < 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics && metrics.waterTrend < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                  {metrics?.waterTrend}% from last year
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall ESG Score</CardTitle>
                <Leaf className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{metrics?.esgScore} / 100</div>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {metrics?.esgTrend} pts improvement
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass">
          <CardHeader>
            <CardTitle>Emission Trajectory (YTD)</CardTitle>
          </CardHeader>
          <CardContent className="pl-0 pb-4 h-[350px]">
            {isHistoryLoading ? (
              <Loader text="Loading chart data..." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="target" stroke="#10b981" fillOpacity={1} fill="url(#colorTarget)" name="Target (tCO2e)" />
                  <Area type="monotone" dataKey="emissions" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorEmissions)" name="Actual (tCO2e)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 glass">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <span className="relative flex h-2 w-2 mr-4 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Automated API sync complete</p>
                  <p className="text-sm text-muted-foreground">Scope 2 emissions data updated from utility provider.</p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">Just now</div>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-4 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">New governance policy uploaded</p>
                  <p className="text-sm text-muted-foreground">Anti-corruption policy v2.4 reviewed.</p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">2h ago</div>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-4 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Target achieved!</p>
                  <p className="text-sm text-muted-foreground">Water usage reduction target met for Q2.</p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">1d ago</div>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-amber-500 mr-4 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Anomaly detected</p>
                  <p className="text-sm text-muted-foreground">Unusual energy spike in Facility B.</p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">2d ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
