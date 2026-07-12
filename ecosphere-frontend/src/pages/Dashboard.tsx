import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, CloudRain, Droplet, Leaf, TrendingUp, TrendingDown, Zap, Sun, Newspaper, Lightbulb, CalendarDays } from "lucide-react"
import { DashboardService } from "@/services/api"
import { aiApi } from "@/services/aiApi"
import { Loader } from "@/components/shared/Loader"
import { ErrorState } from "@/components/shared/ErrorState"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import ReactMarkdown from 'react-markdown'

export function Dashboard() {
  const { data: metrics, isLoading: isMetricsLoading, isError: isMetricsError, refetch: refetchMetrics } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: DashboardService.getOverviewMetrics,
  })

  const { data: history, isLoading: isHistoryLoading, isError: isHistoryError, refetch: refetchHistory } = useQuery({
    queryKey: ["dashboard-history"],
    queryFn: DashboardService.getEmissionHistory,
  })

  const { data: weather } = useQuery({
    queryKey: ["dashboard-weather"],
    queryFn: aiApi.getWeather,
  })

  const { data: news } = useQuery({
    queryKey: ["dashboard-news"],
    queryFn: aiApi.getNews,
  })

  const { data: aiRecs } = useQuery({
    queryKey: ["dashboard-ai-recs"],
    queryFn: aiApi.getRecommendations,
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

  const upcomingEvents = [
    { title: "Quarterly Audit", date: "Oct 15, 2026" },
    { title: "Supplier CSR Review", date: "Oct 20, 2026" },
    { title: "Zero Waste Workshop", date: "Nov 02, 2026" }
  ];

  return (
    <div className="flex-1 space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                <p className="text-xs mt-1 flex items-center">
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
                <p className="text-xs mt-1 flex items-center">
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
                <p className="text-xs mt-1 flex items-center">
                  {metrics && metrics.waterTrend < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                  {metrics?.waterTrend}% from last year
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass shadow-sm hover:shadow-md transition-shadow border-b-4 border-b-primary">
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
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass shadow-sm">
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
        
        <div className="col-span-3 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="glass shadow-sm bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" /> Today's Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weather ? (
                  <div>
                    <div className="text-2xl font-bold">{Math.round(weather.main.temp)}°C</div>
                    <p className="text-xs text-muted-foreground capitalize">{weather.weather[0]?.description} in {weather.name}</p>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground animate-pulse">Loading...</div>
                )}
              </CardContent>
            </Card>

            <Card className="glass shadow-sm bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-green-500" /> Eco Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs italic leading-tight">"Turn off equipment over the weekend to save up to 10% on energy costs."</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-purple-500" /> Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((evt, i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                    <span className="text-sm font-medium">{evt.title}</span>
                    <span className="text-xs text-muted-foreground">{evt.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass shadow-sm border-t-2 border-t-primary overflow-hidden">
            <CardHeader className="bg-muted/30 pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Leaf className="h-4 w-4 text-primary" /> Quick AI Insight
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 max-h-[140px] overflow-hidden text-ellipsis">
              {aiRecs ? (
                <div className="prose prose-sm dark:prose-invert text-xs leading-relaxed line-clamp-4">
                  <ReactMarkdown>{aiRecs.response}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground animate-pulse">Analyzing ESG Data...</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {news && news.articles && news.articles.length > 0 && (
        <Card className="glass shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Newspaper className="h-5 w-5 text-primary" /> Latest ESG News</CardTitle>
            <CardDescription>Curated industry updates and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {news.articles.slice(0, 3).map((article, i) => (
                <a key={i} href={article.url} target="_blank" rel="noreferrer" className="group flex flex-col gap-2 hover:bg-muted/30 p-3 rounded-lg transition-colors">
                  {article.urlToImage && (
                    <div className="h-32 w-full overflow-hidden rounded-md bg-muted mb-2">
                      <img src={article.urlToImage} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{article.description}</p>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

