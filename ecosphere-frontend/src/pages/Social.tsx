import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocialDashboardTab } from "./social/SocialDashboardTab"
import { CSRActivitiesTab } from "./social/CSRActivitiesTab"
import { ParticipationTab } from "./social/ParticipationTab"
import { TrainingTab } from "./social/TrainingTab"

export default function Social() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Social Intelligence</h1>
        <p className="text-muted-foreground">Manage CSR activities, diversity metrics, and employee training.</p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full space-y-4">
        <TabsList className="bg-secondary/50 p-1 w-full justify-start overflow-x-auto">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2">Dashboard</TabsTrigger>
          <TabsTrigger value="activities" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2">CSR Activities</TabsTrigger>
          <TabsTrigger value="participation" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2">Participation</TabsTrigger>
          <TabsTrigger value="training" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2">Training Programs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-4 outline-none">
          <SocialDashboardTab />
        </TabsContent>
        
        <TabsContent value="activities" className="mt-4 outline-none">
          <CSRActivitiesTab />
        </TabsContent>

        <TabsContent value="participation" className="mt-4 outline-none">
          <ParticipationTab />
        </TabsContent>

        <TabsContent value="training" className="mt-4 outline-none">
          <TrainingTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
