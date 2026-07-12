import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GovernanceService } from "@/services/governanceApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export function ComplianceIssuesTab() {
  const [search, setSearch] = useState("");

  const { data: issues, isLoading } = useQuery({
    queryKey: ["complianceIssues"],
    queryFn: GovernanceService.getIssues,
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 border-red-500/50";
      case "High": return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400 border-orange-500/50";
      case "Medium": return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 border-amber-500/50";
      case "Low": return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 border-blue-500/50";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "Investigating": return <Clock className="h-4 w-4 text-amber-500" />;
      case "Resolved": 
      case "Closed": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const filteredIssues = issues?.filter(i => 
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.department?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Compliance Issues</CardTitle>
          <CardDescription>Track and manage audit findings and compliance breaches.</CardDescription>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search issues..."
              className="pl-8 bg-background/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="shrink-0 gap-1">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Report Issue</span>
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
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Audit Source</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No issues found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIssues?.map((issue) => (
                    <TableRow key={issue.id} className="group hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{issue.title}</TableCell>
                      <TableCell>{issue.department?.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{issue.audit?.auditName || 'Direct Report'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                          {issue.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{issue.dueDate ? format(new Date(issue.dueDate), "MMM dd, yyyy") : '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-medium text-sm">
                          {getStatusIcon(issue.status)}
                          {issue.status}
                        </div>
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
  );
}
