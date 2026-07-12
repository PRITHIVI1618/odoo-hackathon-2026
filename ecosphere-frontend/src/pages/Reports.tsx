import { useState, useEffect } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, FileText, BrainCircuit, TrendingUp, 
  Leaf, Users, Scale, FileSpreadsheet, Loader2 
} from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from "recharts";
import { analyticsService } from "@/services/environmentalApi";
import { socialApi } from "@/services/socialApi";
import { GovernanceService } from "@/services/governanceApi";
import { aiApi } from "@/services/aiApi";
import ReactMarkdown from 'react-markdown';

export function Reports() {
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({ env: 0, soc: 0, gov: 0, overall: 0 });
  const [deptData, setDeptData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [envKpis, socKpis, govKpis] = await Promise.all([
          analyticsService.getKpis().catch(() => null),
          socialApi.getKpis().catch(() => null),
          GovernanceService.getDashboardKpis().catch(() => null)
        ]);

        const [envDepts, socDepts, govDepts] = await Promise.all([
          analyticsService.getDepartmentScores().catch(() => []),
          socialApi.getDepartmentScores().catch(() => []),
          GovernanceService.getDepartmentScores().catch(() => [])
        ]);

        const deptsMap = new Map();
        
        envDepts?.forEach((d: any) => {
          deptsMap.set(d.departmentName, { 
            name: d.departmentName, env: Math.round(d.score || 70) 
          });
        });
        
        socDepts?.forEach((d: any) => {
          const existing = deptsMap.get(d.departmentName) || { name: d.departmentName, env: 75 };
          existing.soc = Math.round(d.score || 75);
          deptsMap.set(d.departmentName, existing);
        });

        govDepts?.forEach((d: any) => {
          const existing = deptsMap.get(d.departmentName) || { name: d.departmentName, env: 75, soc: 75 };
          existing.gov = Math.round(d.score || 80);
          deptsMap.set(d.departmentName, existing);
        });

        // Ensure we have some departments if API is totally empty
        if (deptsMap.size === 0) {
          deptsMap.set('IT', { name: 'IT', env: 65, soc: 82, gov: 90 });
          deptsMap.set('HR', { name: 'HR', env: 85, soc: 95, gov: 88 });
          deptsMap.set('Operations', { name: 'Operations', env: 45, soc: 70, gov: 75 });
          deptsMap.set('Finance', { name: 'Finance', env: 90, soc: 85, gov: 95 });
        }

        const aggregatedDepts = Array.from(deptsMap.values()).map(d => {
          d.overall = Math.round(((d.env || 0) + (d.soc || 0) + (d.gov || 0)) / 3);
          return d;
        });
        
        setDeptData(aggregatedDepts);

        const avgEnv = aggregatedDepts.reduce((acc, d) => acc + d.env, 0) / (aggregatedDepts.length || 1);
        const avgSoc = aggregatedDepts.reduce((acc, d) => acc + d.soc, 0) / (aggregatedDepts.length || 1);
        const avgGov = govKpis?.overallGovernanceScore || aggregatedDepts.reduce((acc, d) => acc + (d.gov||0), 0) / (aggregatedDepts.length || 1);
        const overallScore = Math.round((avgEnv + avgSoc + avgGov) / 3);

        setScores({
          env: Math.round(avgEnv),
          soc: Math.round(avgSoc),
          gov: Math.round(avgGov),
          overall: overallScore
        });

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const mockTrend = months.map((m, i) => ({
          month: m,
          score: Math.max(0, overallScore - (5 - i) * 2 + Math.floor(Math.random() * 5)),
          env: Math.max(0, avgEnv - (5 - i) * 1.5 + Math.floor(Math.random() * 4)),
          soc: Math.max(0, avgSoc - (5 - i) * 2.5 + Math.floor(Math.random() * 6)),
          gov: Math.max(0, avgGov - (5 - i) * 1 + Math.floor(Math.random() * 3)),
        }));
        setTrendData(mockTrend);

      } catch (error) {
        console.error("Error fetching report data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true);
      const res = await aiApi.generateSummary('executive');
      setAiReport(res.response);
    } catch (error) {
      console.error("Failed to generate report", error);
      setAiReport("?? Failed to generate the AI Executive Report. Please ensure the backend is running and the Gemini API key is valid.");
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    alert("Exporting CSV... (Mock Download Started)");
  };

  const radarData = [
    { subject: 'Environmental', A: scores.env, fullMark: 100 },
    { subject: 'Social', A: scores.soc, fullMark: 100 },
    { subject: 'Governance', A: scores.gov, fullMark: 100 },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-4 text-xl">Compiling Executive Reports...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Executive Reports
          </h2>
          <p className="text-muted-foreground">Comprehensive ESG performance and AI analytics.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="glass shadow-sm" onClick={handleExportCSV}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button className="shadow-lg hover:shadow-xl transition-all" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall ESG Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{scores.overall}</div>
            <p className="text-xs text-muted-foreground mt-1">out of 100</p>
            <Progress value={scores.overall} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="glass shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Environmental</CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scores.env}</div>
            <Progress value={scores.env} className="mt-3 h-1" />
          </CardContent>
        </Card>

        <Card className="glass shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scores.soc}</div>
            <Progress value={scores.soc} className="mt-3 h-1" />
          </CardContent>
        </Card>

        <Card className="glass shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Governance</CardTitle>
            <Scale className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scores.gov}</div>
            <Progress value={scores.gov} className="mt-3 h-1" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass shadow-sm">
          <CardHeader>
            <CardTitle>ESG Performance Trend</CardTitle>
            <CardDescription>6-month historical overall score trajectory</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="score" name="Overall" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="env" name="Environment" stroke="#22c55e" strokeWidth={2} opacity={0.6} />
                <Line type="monotone" dataKey="soc" name="Social" stroke="#3b82f6" strokeWidth={2} opacity={0.6} />
                <Line type="monotone" dataKey="gov" name="Governance" stroke="#a855f7" strokeWidth={2} opacity={0.6} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 glass shadow-sm">
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Pillar balance analysis</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid opacity={0.3} />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Score" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass shadow-sm">
          <CardHeader>
            <CardTitle>Department Comparison</CardTitle>
            <CardDescription>Pillar breakdown by business unit</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={true} vertical={false}/>
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar dataKey="env" name="Environment" fill="#22c55e" stackId="a" radius={[0,0,0,0]} />
                <Bar dataKey="soc" name="Social" fill="#3b82f6" stackId="a" radius={[0,0,0,0]} />
                <Bar dataKey="gov" name="Governance" fill="#a855f7" stackId="a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass shadow-lg border-t-4 border-t-primary flex flex-col">
          <CardHeader className="bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
                  AI Executive Summary
                </CardTitle>
                <CardDescription className="mt-1">Auto-generated board-level report using Gemini</CardDescription>
              </div>
              <Button onClick={handleGenerateReport} disabled={generatingReport} className="shadow-md">
                {generatingReport ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                  <><FileText className="mr-2 h-4 w-4" /> Generate Report</>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[300px] w-full p-6">
              {aiReport ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{aiReport}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 opacity-70">
                  <BrainCircuit className="h-12 w-12 text-muted-foreground/50" />
                  <p>Click "Generate Report" to analyze current ESG data.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
