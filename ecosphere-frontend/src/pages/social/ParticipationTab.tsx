import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { socialApi } from "@/services/socialApi"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Clock, Eye } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export function ParticipationTab() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedParticipation, setSelectedParticipation] = useState<any>(null)
  
  const [remarks, setRemarks] = useState("")

  const { data: participations, isLoading } = useQuery({
    queryKey: ['employee-participations'],
    queryFn: socialApi.getParticipations
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => socialApi.updateParticipation(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-participations'] })
      queryClient.invalidateQueries({ queryKey: ['social-kpis'] })
      setIsDialogOpen(false)
    }
  })

  const handleReview = (participation: any) => {
    setSelectedParticipation(participation)
    setRemarks(participation.remarks || "")
    setIsDialogOpen(true)
  }

  const handleApprove = () => {
    updateMutation.mutate({
      ...selectedParticipation,
      approvalStatus: "APPROVED",
      remarks
    })
  }

  const handleReject = () => {
    updateMutation.mutate({
      ...selectedParticipation,
      approvalStatus: "REJECTED",
      remarks
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Employee Participation Review</CardTitle>
          <CardDescription>Review and approve employee volunteer hours for CSR activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">Loading participations...</TableCell>
                  </TableRow>
                ) : participations?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No participation records found.</TableCell>
                  </TableRow>
                ) : (
                  participations?.map((p: any) => (
                    <TableRow key={p.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="font-medium">{p.employee?.firstName} {p.employee?.lastName}</div>
                        <div className="text-xs text-muted-foreground">{p.employee?.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-primary">{p.csrActivity?.title}</div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.participationDate}</TableCell>
                      <TableCell className="font-medium">{p.hoursContributed} hrs</TableCell>
                      <TableCell>
                        <Badge variant={p.approvalStatus === 'APPROVED' ? 'default' : p.approvalStatus === 'REJECTED' ? 'destructive' : 'secondary'}>
                          {p.approvalStatus === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                          {p.approvalStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleReview(p)}>
                          <Eye className="h-4 w-4 mr-1" /> Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Review Participation</DialogTitle>
            <DialogDescription>
              Approve or reject this volunteer request.
            </DialogDescription>
          </DialogHeader>
          {selectedParticipation && (
            <div className="space-y-4 py-4">
              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employee:</span>
                  <span className="font-medium">{selectedParticipation.employee?.firstName} {selectedParticipation.employee?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Activity:</span>
                  <span className="font-medium">{selectedParticipation.csrActivity?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hours Logged:</span>
                  <span className="font-medium">{selectedParticipation.hoursContributed} hrs</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Manager Remarks</Label>
                <Input value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="e.g. Great job representing the company!" />
              </div>
              <div className="flex justify-end pt-4 space-x-2">
                <Button type="button" variant="outline" className="text-destructive hover:bg-destructive/10 border-destructive/20" onClick={handleReject} disabled={updateMutation.isPending}>
                  <X className="w-4 h-4 mr-1" /> Reject
                </Button>
                <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleApprove} disabled={updateMutation.isPending}>
                  <Check className="w-4 h-4 mr-1" /> Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
