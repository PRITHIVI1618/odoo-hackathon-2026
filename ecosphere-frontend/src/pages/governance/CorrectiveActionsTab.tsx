import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GovernanceService } from "@/services/governanceApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, User } from "lucide-react";
import { format } from "date-fns";

export function CorrectiveActionsTab() {
  const [search, setSearch] = useState("");

  const { data: actions, isLoading } = useQuery({
    queryKey: ["correctiveActions"],
    queryFn: GovernanceService.getCorrectiveActions,
  });

  const filteredActions = actions?.filter(a => 
    a.actionDescription.toLowerCase().includes(search.toLowerCase()) ||
    a.issue.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Corrective Actions (CAPA)</CardTitle>
          <CardDescription>Manage remediation workflows for compliance issues.</CardDescription>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search actions..."
              className="pl-8 bg-background/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="shrink-0 gap-1">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Action</span>
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
                  <TableHead>Associated Issue</TableHead>
                  <TableHead>Action Plan</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Target Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActions?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No corrective actions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredActions?.map((action) => (
                    <TableRow key={action.id} className="group hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium text-xs text-muted-foreground">
                        {action.issue.title}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{action.actionDescription}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {action.assignedTo?.firstName} {action.assignedTo?.lastName}
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(action.targetDate), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          action.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          action.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-amber-100 text-amber-800'
                        }>
                          {action.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8">Update</Button>
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
