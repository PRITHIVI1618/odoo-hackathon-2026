import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { socialApi } from "@/services/socialApi"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit2, Trash2, MapPin, Calendar } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export function CSRActivitiesTab() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    startDate: "",
    endDate: "",
    maxParticipants: 50,
    status: "Upcoming"
  })

  const { data: activities, isLoading } = useQuery({
    queryKey: ['csr-activities'],
    queryFn: socialApi.getCsrActivities
  })

  const createMutation = useMutation({
    mutationFn: socialApi.createCsrActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['csr-activities'] })
      queryClient.invalidateQueries({ queryKey: ['social-kpis'] })
      setIsDialogOpen(false)
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => socialApi.updateCsrActivity(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['csr-activities'] })
      setIsDialogOpen(false)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: socialApi.deleteCsrActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['csr-activities'] })
      queryClient.invalidateQueries({ queryKey: ['social-kpis'] })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (activity: any) => {
    setFormData({
      title: activity.title,
      description: activity.description,
      category: activity.category,
      location: activity.location,
      startDate: activity.startDate,
      endDate: activity.endDate,
      maxParticipants: activity.maxParticipants,
      status: activity.status
    })
    setEditingId(activity.id)
    setIsDialogOpen(true)
  }

  const openNewDialog = () => {
    setFormData({
      title: "",
      description: "",
      category: "Environment",
      location: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      maxParticipants: 50,
      status: "Upcoming"
    })
    setEditingId(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>CSR Activities</CardTitle>
            <CardDescription>Manage corporate social responsibility events and initiatives</CardDescription>
          </div>
          <Button onClick={openNewDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Activity
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location & Date</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">Loading activities...</TableCell>
                  </TableRow>
                ) : activities?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No CSR activities found. Create one!</TableCell>
                  </TableRow>
                ) : (
                  activities?.map((activity: any) => (
                    <TableRow key={activity.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="font-medium text-foreground">{activity.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{activity.description}</div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{activity.category}</Badge></TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1 text-xs">
                          <span className="flex items-center text-muted-foreground"><MapPin className="h-3 w-3 mr-1" /> {activity.location}</span>
                          <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {activity.startDate}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">Max: {activity.maxParticipants}</TableCell>
                      <TableCell>
                        <Badge variant={activity.status === 'Active' ? 'default' : activity.status === 'Completed' ? 'secondary' : 'outline'}>
                          {activity.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(activity)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => deleteMutation.mutate(activity.id)}>
                          <Trash2 className="h-4 w-4" />
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit CSR Activity" : "Create CSR Activity"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update the details of this activity." : "Add a new CSR initiative for employees to join."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Title</Label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Tree Plantation Drive" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Description</Label>
                <Input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Community">Community</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Draft">Draft</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Location</Label>
                <Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Max Participants</Label>
                <Input type="number" required value={formData.maxParticipants} onChange={e => setFormData({...formData, maxParticipants: parseInt(e.target.value)})} />
              </div>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? "Update" : "Save"} Activity
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
