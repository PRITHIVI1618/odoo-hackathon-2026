import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as UiBadge } from "@/components/ui/badge"
import type { DepartmentLeaderboardResponse, LeaderboardEntryResponse } from "@/services/gamificationApi"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award } from "lucide-react"

export function LeaderboardsTab({ 
  employees, 
  departments 
}: { 
  employees: LeaderboardEntryResponse[], 
  departments: DepartmentLeaderboardResponse[] 
}) {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Employee Leaderboard</TabsTrigger>
          <TabsTrigger value="departments">Department Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Top Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((emp) => (
                  <div key={emp.employeeId} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 font-bold text-lg">
                        {emp.rank === 1 ? <Trophy className="h-6 w-6 text-yellow-500" /> : 
                         emp.rank === 2 ? <Medal className="h-6 w-6 text-gray-400" /> : 
                         emp.rank === 3 ? <Medal className="h-6 w-6 text-amber-700" /> : 
                         `#${emp.rank}`}
                      </div>
                      <div>
                        <p className="font-semibold">{emp.employeeName}</p>
                        <p className="text-xs text-muted-foreground">{emp.departmentName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-bold text-green-500">{emp.xp} XP</p>
                        <p className="text-xs text-muted-foreground">Level {emp.level}</p>
                      </div>
                      <div className="hidden md:flex gap-2">
                        <UiBadge variant="outline" className="flex gap-1"><Award className="w-3 h-3"/> {emp.badgesCount}</UiBadge>
                      </div>
                    </div>
                  </div>
                ))}
                {employees.length === 0 && <p className="text-muted-foreground">No data available.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Top Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((dept) => (
                  <div key={dept.departmentId} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 font-bold text-lg">
                        {dept.rank === 1 ? <Trophy className="h-6 w-6 text-yellow-500" /> : `#${dept.rank}`}
                      </div>
                      <div>
                        <p className="font-semibold">{dept.departmentName}</p>
                        <p className="text-xs text-muted-foreground">{dept.activeEmployees} active employees</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-500">{dept.totalXp} Total XP</p>
                      <p className="text-xs text-muted-foreground">{dept.totalBadges} Badges Earned</p>
                    </div>
                  </div>
                ))}
                {departments.length === 0 && <p className="text-muted-foreground">No data available.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
