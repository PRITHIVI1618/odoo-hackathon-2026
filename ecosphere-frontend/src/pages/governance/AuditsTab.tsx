import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GovernanceService } from "@/services/governanceApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Calendar, User } from "lucide-react";
import { format } from "date-fns";

export function AuditsTab() {
  const [search, setSearch] = useState("");

  const { data: audits, isLoading } = useQuery({
    queryKey: ["audits"],
    queryFn: GovernanceService.getAudits,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "In Progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Planned": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAudits = audits?.filter(a => 
    a.auditName.toLowerCase().includes(search.toLowerCase()) ||
    a.department?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Audit Timeline Component */}
      <Card className="glass-card bg-gradient-to-r from-background to-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Audit Timeline Overview</h3>
              <p className="text-sm text-muted-foreground">Track scheduled and completed audits across departments.</p>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
             {/* Simple timeline visualization */}
             {audits?.slice(0, 5).map((audit, i) => (
                <div key={i} className="min-w-[200px] p-4 rounded-lg border bg-background/50 flex flex-col gap-2 relative">
                   <div className={`absolute top-0 left-0 w-1 h-full rounded-l-lg ${audit.status === 'Completed' ? 'bg-green-500' : audit.status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                   <div className="text-xs font-medium text-muted-foreground">{format(new Date(audit.scheduledDate), "MMM dd, yyyy")}</div>
                   <div className="font-semibold text-sm truncate">{audit.auditName}</div>
                   <Badge variant="outline" className={`w-fit text-[10px] ${getStatusColor(audit.status)}`}>{audit.status}</Badge>
                </div>
             ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Audit Management</CardTitle>
            <CardDescription>Schedule and track internal and external audits.</CardDescription>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search audits..."
                className="pl-8 bg-background/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button className="shrink-0 gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule Audit</span>
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
                    <TableHead>Audit Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Auditor</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAudits?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No audits found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAudits?.map((audit) => (
                      <TableRow key={audit.id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{audit.auditName}</TableCell>
                        <TableCell>{audit.department?.name || "Org-Wide"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-3 w-3 text-muted-foreground" />
                            {audit.auditor?.firstName} {audit.auditor?.lastName}
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(audit.scheduledDate), "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(audit.status)}>
                            {audit.status}
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
