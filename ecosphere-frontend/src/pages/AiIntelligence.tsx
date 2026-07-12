import { useState, useEffect } from 'react';
import { Bot, MessageSquare, FileText, Lightbulb, Newspaper, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { aiApi } from '@/services/aiApi';
import type { NewsApiResponse, WeatherData, ChatHistoryEntry } from '@/services/aiApi';
import { AiChat } from './ai/AiChat';
import { ExecutiveSummary } from './ai/ExecutiveSummary';
import { AiAnalytics } from './ai/AiAnalytics';
import { NewsWidget } from './ai/NewsWidget';
import { WeatherWidget } from './ai/WeatherWidget';

export function AiIntelligence() {
  const [news, setNews] = useState<NewsApiResponse | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [history, setHistory] = useState<ChatHistoryEntry[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    const loadWidgets = async () => {
      try {
        const [newsData, weatherData, historyData] = await Promise.all([
          aiApi.getNews().catch(() => null),
          aiApi.getWeather().catch(() => null),
          aiApi.getChatHistory().catch(() => [] as ChatHistoryEntry[]),
        ]);
        if (newsData) setNews(newsData);
        if (weatherData) setWeather(weatherData);
        if (historyData) setHistory(historyData as ChatHistoryEntry[]);
      } catch {
        // Silently fail - widgets will show empty state
      } finally {
        setNewsLoading(false);
        setWeatherLoading(false);
      }
    };
    loadWidgets();
  }, []);

  // Compute basic ESG score from available data (placeholder for hero card)
  const heroStats = [
    { label: 'AI Status', value: 'Online', color: 'text-green-500' },
    { label: 'Data Source', value: 'Live ESG DB', color: 'text-blue-500' },
    { label: 'Location', value: 'Coimbatore, IN', color: 'text-purple-500' },
    { label: 'Model', value: 'Gemini 1.5 Flash', color: 'text-orange-500' },
  ];

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg shadow-green-500/20">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Intelligence Center</h2>
          <p className="text-sm text-muted-foreground">Powered by Google Gemini · Live ESG data connected</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          AI Online
        </div>
      </div>

      {/* Hero Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {heroStats.map(stat => (
          <Card key={stat.label} className="glass">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-lg font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto gap-2 bg-transparent p-0">
          <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground glass p-3">
            <MessageSquare className="w-4 h-4 mr-2" /> ESG Chat
          </TabsTrigger>
          <TabsTrigger value="summary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground glass p-3">
            <FileText className="w-4 h-4 mr-2" /> Executive Summary
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground glass p-3">
            <Lightbulb className="w-4 h-4 mr-2" /> AI Analytics
          </TabsTrigger>
          <TabsTrigger value="feeds" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground glass p-3">
            <Newspaper className="w-4 h-4 mr-2" /> News & Weather
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <AiChat history={history} />
        </TabsContent>

        <TabsContent value="summary">
          <ExecutiveSummary />
        </TabsContent>

        <TabsContent value="analytics">
          <AiAnalytics />
        </TabsContent>

        <TabsContent value="feeds">
          <div className="grid gap-6 lg:grid-cols-2">
            <WeatherWidget weather={weather} loading={weatherLoading} />
            <NewsWidget news={news} loading={newsLoading} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
