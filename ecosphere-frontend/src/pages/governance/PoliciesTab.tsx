import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GovernanceService } from "@/services/governanceApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useAuthStore } from "@/store/useAuthStore";

export function PoliciesTab() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");

  const { data: policies, isLoading } = useQuery({
    queryKey: ["policies"],
    queryFn: GovernanceService.getPolicies,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Approved": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Under Review": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "Draft": return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPolicies = policies?.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.policyCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Policy Management</CardTitle>
          <CardDescription>Manage corporate policies, versions, and lifecycle.</CardDescription>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search policies..."
              className="pl-8 bg-background/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {(user?.role === "Super Admin" || user?.role === "ESG Manager") && (
            <Button className="shrink-0 gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Policy</span>
            </Button>
          )}
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
                  <TableHead>Policy Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No policies found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPolicies?.map((policy) => (
                    <TableRow key={policy.id} className="group hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          {policy.policyCode}
                        </div>
                      </TableCell>
                      <TableCell>{policy.title}</TableCell>
                      <TableCell>{policy.category}</TableCell>
                      <TableCell>v{policy.version}</TableCell>
                      <TableCell>{format(new Date(policy.effectiveDate), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(policy.status)}>
                          {policy.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {policy.status === "Published" && (
                          <Button variant="ghost" size="sm" className="h-8 gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20">
                            <CheckCircle className="h-4 w-4" />
                            Acknowledge
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-8">View</Button>
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
