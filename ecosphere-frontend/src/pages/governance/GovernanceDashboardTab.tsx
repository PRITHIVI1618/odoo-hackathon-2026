import { useQuery } from "@tanstack/react-query";
import { GovernanceService } from "@/services/governanceApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, FileText, Activity, AlertTriangle, Crosshair, AlertCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

export function GovernanceDashboardTab() {
  const { data: kpis, isLoading: isLoadingKpis } = useQuery({
    queryKey: ["govKpis"],
    queryFn: GovernanceService.getDashboardKpis,
  });

  const { data: policyData, isLoading: isLoadingPolicies } = useQuery({
    queryKey: ["govPolicyStatus"],
    queryFn: GovernanceService.getPolicyStatusDistribution,
  });

  const { data: deptScores, isLoading: isLoadingScores } = useQuery({
    queryKey: ["govDeptScores"],
    queryFn: GovernanceService.getDepartmentScores,
  });

  if (isLoadingKpis || isLoadingPolicies || isLoadingScores) {
    return <div className="p-8 text-center animate-pulse">Loading Governance Intelligence...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card className="glass-card border-none bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight">Governance Health</h2>
              <p className="text-muted-foreground max-w-lg">
                Executive overview of corporate policies, audits, risks, and compliance status.
              </p>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-4xl font-black text-primary">
                  {kpis?.overallGovernanceScore}%
                </div>
                <div className="text-sm text-muted-foreground font-medium mt-1">Health Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-blue-500">
                  {kpis?.policyCompliancePercentage}%
                </div>
                <div className="text-sm text-muted-foreground font-medium mt-1">Policy Adoption</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-amber-500">
                  {kpis?.auditCompletionPercentage}%
                </div>
                <div className="text-sm text-muted-foreground font-medium mt-1">Audit Completion</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="glass-card hover:border-primary/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.activePolicies}</div>
          </CardContent>
        </Card>
        <Card className="glass-card hover:border-primary/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Acks</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.pendingAcknowledgements}</div>
          </CardContent>
        </Card>
        <Card className="glass-card hover:border-primary/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Audits</CardTitle>
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.upcomingAudits}</div>
          </CardContent>
        </Card>
        <Card className="glass-card hover:border-primary/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.openComplianceIssues}</div>
          </CardContent>
        </Card>
        <Card className="glass-card hover:border-primary/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.openRisks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass-card">
          <CardHeader>
            <CardTitle>Department Governance Rankings</CardTitle>
            <CardDescription>Overall compliance and audit score by department</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptScores}>
                <XAxis dataKey="departmentName" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 glass-card">
          <CardHeader>
            <CardTitle>Policy Status Distribution</CardTitle>
            <CardDescription>Overview of all policies by lifecycle stage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={policyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {policyData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
