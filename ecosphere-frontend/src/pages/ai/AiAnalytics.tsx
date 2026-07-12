import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Lightbulb } from 'lucide-react';
import { aiApi } from '@/services/aiApi';

const ANALYSIS_TYPES = [
  { id: 'recommendations', label: 'AI Recommendations', fn: () => aiApi.getRecommendations(), desc: 'Actionable ESG improvement strategies' },
  { id: 'departments', label: 'Department Analysis', fn: () => aiApi.analyzeDepartments(), desc: 'Compare strengths & weaknesses by department' },
  { id: 'trends', label: 'Trend Analysis', fn: () => aiApi.analyzeTrends(), desc: 'Analyze ESG performance over time' },
  { id: 'predictions', label: 'Predictive Insights', fn: () => aiApi.getPredictions(), desc: 'Forecast ESG risks and goal completion' },
];

export function AiAnalytics() {
  const [activeTab, setActiveTab] = useState(ANALYSIS_TYPES[0].id);
  const [results, setResults] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const runAnalysis = async (type: typeof ANALYSIS_TYPES[0]) => {
    setActiveTab(type.id);
    if (results[type.id] && loading !== type.id) return;
    setLoading(type.id);
    try {
      const res = await type.fn();
      setResults(prev => ({ ...prev, [type.id]: res.response }));
    } catch {
      setResults(prev => ({ ...prev, [type.id]: 'Analysis failed. Please try again.' }));
    } finally {
      setLoading(null);
    }
  };

  const refresh = async () => {
    const type = ANALYSIS_TYPES.find(t => t.id === activeTab)!;
    setResults(prev => { const copy = { ...prev }; delete copy[type.id]; return copy; });
    await runAnalysis(type);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ANALYSIS_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => runAnalysis(type)}
            className={`glass p-4 rounded-xl border text-left transition-all duration-200 hover:border-green-500/50 ${activeTab === type.id ? 'border-green-500 bg-green-500/5' : ''}`}
          >
            <Lightbulb className={`w-5 h-5 mb-2 ${activeTab === type.id ? 'text-green-500' : 'text-muted-foreground'}`} />
            <p className={`font-semibold text-sm ${activeTab === type.id ? 'text-green-500' : ''}`}>{type.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{type.desc}</p>
          </button>
        ))}
      </div>

      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            {ANALYSIS_TYPES.find(t => t.id === activeTab)?.label}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading !== null}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {loading === activeTab ? (
            <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-muted animate-spin border-t-green-500" />
                <Lightbulb className="w-6 h-6 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p>AI is analyzing your live ESG data...</p>
            </div>
          ) : results[activeTab] ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{results[activeTab]}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Click any analysis type above to generate AI insights from your live ESG data.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
