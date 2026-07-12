import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GovernanceService } from "@/services/governanceApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, AlertTriangle } from "lucide-react";

export function RisksTab() {
  const [search, setSearch] = useState("");

  const { data: risks, isLoading } = useQuery({
    queryKey: ["risks"],
    queryFn: GovernanceService.getRisks,
  });

  const getScoreColor = (score: number) => {
    if (score >= 15) return "bg-red-500 text-white";
    if (score >= 10) return "bg-orange-500 text-white";
    if (score >= 5) return "bg-amber-500 text-white";
    return "bg-green-500 text-white";
  };

  const filteredRisks = risks?.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.riskCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="glass-card bg-gradient-to-r from-background to-red-500/5 border-red-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Risk Register Matrix</h3>
              <p className="text-sm text-muted-foreground">Identify and mitigate high-impact organizational risks.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
             <div className="p-4 rounded-xl border bg-background/50 flex flex-col items-center justify-center gap-2">
                <div className="text-3xl font-bold text-red-500">{risks?.filter(r => r.riskScore >= 15).length || 0}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Critical (15-25)</div>
             </div>
             <div className="p-4 rounded-xl border bg-background/50 flex flex-col items-center justify-center gap-2">
                <div className="text-3xl font-bold text-orange-500">{risks?.filter(r => r.riskScore >= 10 && r.riskScore < 15).length || 0}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">High (10-14)</div>
             </div>
             <div className="p-4 rounded-xl border bg-background/50 flex flex-col items-center justify-center gap-2">
                <div className="text-3xl font-bold text-amber-500">{risks?.filter(r => r.riskScore >= 5 && r.riskScore < 10).length || 0}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Medium (5-9)</div>
             </div>
             <div className="p-4 rounded-xl border bg-background/50 flex flex-col items-center justify-center gap-2">
                <div className="text-3xl font-bold text-green-500">{risks?.filter(r => r.riskScore < 5).length || 0}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Low (1-4)</div>
             </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Risk Register</CardTitle>
            <CardDescription>Comprehensive list of identified risks and mitigation plans.</CardDescription>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search risks..."
                className="pl-8 bg-background/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button className="shrink-0 gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Risk</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted/50 rounded-md animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border bg-background/50 backdrop-blur-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Risk Code</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Likelihood</TableHead>
                    <TableHead className="text-center">Impact</TableHead>
                    <TableHead className="text-center">Risk Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRisks?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        No risks found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRisks?.map((risk) => (
                      <TableRow key={risk.id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium text-xs">{risk.riskCode}</TableCell>
                        <TableCell className="font-medium">{risk.title}</TableCell>
                        <TableCell>{risk.category}</TableCell>
                        <TableCell className="text-center">{risk.likelihood}/5</TableCell>
                        <TableCell className="text-center">{risk.impact}/5</TableCell>
                        <TableCell className="text-center">
                          <Badge className={`w-8 h-8 flex items-center justify-center rounded-full ${getScoreColor(risk.riskScore)}`}>
                            {risk.riskScore}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={risk.status === 'Open' ? 'text-red-500' : 'text-green-500'}>
                            {risk.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8">Details</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
