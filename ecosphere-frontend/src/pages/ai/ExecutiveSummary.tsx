import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Leaf, Users, Shield, Globe, FileText } from 'lucide-react';
import { aiApi } from '@/services/aiApi';

const SUMMARY_MODULES = [
  { id: 'Environmental', label: 'Environmental', icon: Leaf, color: 'text-green-500', gradient: 'from-green-500/10 to-emerald-500/10 border-green-500/20' },
  { id: 'Social', label: 'Social', icon: Users, color: 'text-blue-500', gradient: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20' },
  { id: 'Governance', label: 'Governance', icon: Shield, color: 'text-purple-500', gradient: 'from-purple-500/10 to-violet-500/10 border-purple-500/20' },
  { id: 'Overall ESG', label: 'Overall ESG', icon: Globe, color: 'text-orange-500', gradient: 'from-orange-500/10 to-amber-500/10 border-orange-500/20' },
];

export function ExecutiveSummary() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const generateSummary = async (module: string) => {
    if (summaries[module]) { setActiveModule(module); return; }
    setLoading(module);
    setActiveModule(module);
    try {
      const res = await aiApi.generateSummary(module);
      setSummaries(prev => ({ ...prev, [module]: res.response }));
    } catch {
      setSummaries(prev => ({ ...prev, [module]: 'Failed to generate summary. Please try again.' }));
    } finally {
      setLoading(null);
    }
  };

  const activeData = SUMMARY_MODULES.find(m => m.id === activeModule);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SUMMARY_MODULES.map(({ id, label, icon: Icon, color, gradient }) => (
          <button
            key={id}
            onClick={() => generateSummary(id)}
            className={`glass p-6 rounded-xl border bg-gradient-to-br ${gradient} hover:scale-105 transition-all duration-200 text-left group ${activeModule === id ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
          >
            <Icon className={`w-8 h-8 mb-3 ${color} group-hover:scale-110 transition-transform`} />
            <p className="font-semibold">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">Click to generate summary</p>
          </button>
        ))}
      </div>

      {activeModule && (
        <Card className="glass border-muted/50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="border-b pb-4">
            <CardTitle className={`flex items-center gap-2 ${activeData?.color}`}>
              {activeData && <activeData.icon className="w-5 h-5" />}
              {activeModule} Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading === activeModule ? (
              <div className="flex items-center gap-3 text-muted-foreground py-8 justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-green-500" />
                <span>Generating AI executive summary from live ESG data...</span>
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{summaries[activeModule]}</ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
