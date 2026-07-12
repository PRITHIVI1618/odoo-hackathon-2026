import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GovernanceDashboardTab } from "./governance/GovernanceDashboardTab"
import { PoliciesTab } from "./governance/PoliciesTab"
import { AuditsTab } from "./governance/AuditsTab"
import { ComplianceIssuesTab } from "./governance/ComplianceIssuesTab"
import { RisksTab } from "./governance/RisksTab"
import { CorrectiveActionsTab } from "./governance/CorrectiveActionsTab"
import { Scale, FileText, ShieldCheck, AlertCircle, AlertTriangle, CheckSquare } from "lucide-react"

export function Governance() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Governance Intelligence</h1>
        <p className="text-muted-foreground">Monitor corporate policies, audits, compliance issues, and organizational risks.</p>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <div className="overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <TabsList className="w-full sm:w-auto inline-flex h-11 bg-background/50 backdrop-blur-md border border-border/50">
            <TabsTrigger value="dashboard" className="gap-2 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all">
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="policies" className="gap-2 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Policies</span>
            </TabsTrigger>
            <TabsTrigger value="audits" className="gap-2 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Audits</span>
            </TabsTrigger>
            <TabsTrigger value="issues" className="gap-2 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all">
              <AlertCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Issues</span>
            </TabsTrigger>
            <TabsTrigger value="risks" className="gap-2 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Risks</span>
            </TabsTrigger>
            <TabsTrigger value="actions" className="gap-2 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">CAPA</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <GovernanceDashboardTab />
        </TabsContent>
        <TabsContent value="policies" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <PoliciesTab />
        </TabsContent>
        <TabsContent value="audits" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <AuditsTab />
        </TabsContent>
        <TabsContent value="issues" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <ComplianceIssuesTab />
        </TabsContent>
        <TabsContent value="risks" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <RisksTab />
        </TabsContent>
        <TabsContent value="actions" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <CorrectiveActionsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
