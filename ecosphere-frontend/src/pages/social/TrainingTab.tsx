import { useQuery } from "@tanstack/react-query"
import { socialApi } from "@/services/socialApi"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function TrainingTab() {
  const { data: trainings, isLoading } = useQuery({
    queryKey: ['training-programs'],
    queryFn: socialApi.getTrainingPrograms
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Employee Training Programs</CardTitle>
          <CardDescription>Track learning and development initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Program Name</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Completion %</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">Loading programs...</TableCell>
                  </TableRow>
                ) : trainings?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No training programs found.</TableCell>
                  </TableRow>
                ) : (
                  trainings?.map((t: any) => (
                    <TableRow key={t.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="font-medium">{t.title}</div>
                        <div className="text-xs text-muted-foreground">{t.department?.name || 'Organization Wide'}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {t.trainer?.firstName} {t.trainer?.lastName}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {t.startDate} to {t.endDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={t.completionPercentage} className="h-2 w-[60%]" />
                          <span className="text-xs font-medium">{t.completionPercentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={t.status === 'Completed' ? 'secondary' : t.status === 'In Progress' ? 'default' : 'outline'}>
                          {t.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
