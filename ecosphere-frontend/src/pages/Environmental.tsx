import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardTab } from "./environmental/DashboardTab"
import { TransactionsTab } from "./environmental/TransactionsTab"
import { FactorsTab } from "./environmental/FactorsTab"
import { GoalsTab } from "./environmental/GoalsTab"

export function Environmental() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Environmental Intelligence</h2>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Carbon Transactions</TabsTrigger>
          <TabsTrigger value="goals">Sustainability Goals</TabsTrigger>
          <TabsTrigger value="factors">Emission Factors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="m-0">
          <DashboardTab />
        </TabsContent>
        <TabsContent value="transactions" className="m-0">
          <TransactionsTab />
        </TabsContent>
        <TabsContent value="goals" className="m-0">
          <GoalsTab />
        </TabsContent>
        <TabsContent value="factors" className="m-0">
          <FactorsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
