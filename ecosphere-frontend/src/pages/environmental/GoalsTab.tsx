import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import { Search, Plus, Edit2, Trash2, Loader2, Target } from "lucide-react"
import { goalService } from "@/services/environmentalApi"
import { departmentService } from "@/services/api"

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  departmentId: z.coerce.number().optional(),
  targetReduction: z.coerce.number().min(0.1, "Target must be positive"),
  currentReduction: z.coerce.number().min(0, "Current reduction cannot be negative"),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().min(1, "End Date is required"),
  status: z.enum(["ACTIVE", "ACHIEVED", "FAILED"]),
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"]
})

type GoalFormValues = z.infer<typeof formSchema>

export function GoalsTab() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "", targetReduction: 0, currentReduction: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      status: "ACTIVE"
    },
  })

  const { data: goals = [], isLoading } = useQuery({ queryKey: ['env-goals'], queryFn: goalService.getGoals })
  const { data: departments = [] } = useQuery({ queryKey: ['departments'], queryFn: departmentService.getDepartments })

  const createMutation = useMutation({
    mutationFn: goalService.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['env-goals'] })
      queryClient.invalidateQueries({ queryKey: ['env-kpis'] })
      toast.success("Goal created successfully")
      closeDialog()
    },
    onError: () => toast.error("Failed to create goal")
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => goalService.updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['env-goals'] })
      queryClient.invalidateQueries({ queryKey: ['env-kpis'] })
      toast.success("Goal updated successfully")
      closeDialog()
    },
    onError: () => toast.error("Failed to update goal")
  })

  const deleteMutation = useMutation({
    mutationFn: goalService.deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['env-goals'] })
      queryClient.invalidateQueries({ queryKey: ['env-kpis'] })
      toast.success("Goal deleted successfully")
      setIsDeleteDialogOpen(false)
    },
    onError: () => toast.error("Failed to delete goal.")
  })

  const openCreateDialog = () => {
    setEditingGoal(null)
    form.reset({
      title: "", targetReduction: 0, currentReduction: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      status: "ACTIVE"
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (g: any) => {
    setEditingGoal(g)
    form.reset({
      title: g.title,
      departmentId: g.department?.id,
      targetReduction: g.targetReduction,
      currentReduction: g.currentReduction,
      startDate: g.startDate,
      endDate: g.endDate,
      status: g.status,
    })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingGoal(null)
    form.reset()
  }

  const onSubmit = (data: GoalFormValues) => {
    const payload = {
      ...data,
      department: data.departmentId ? { id: data.departmentId } : null,
    }
    
    if (editingGoal) {
      updateMutation.mutate({ id: editingGoal.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const filtered = goals.filter((g: any) => 
    g.title?.toLowerCase().includes(search.toLowerCase()) || 
    g.department?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Visual Goals Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.filter((g:any)=>g.status === 'ACTIVE').slice(0,3).map((g: any) => (
          <Card key={g.id} className="glass shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex justify-between items-center">
                <span className="truncate pr-2">{g.title}</span>
                <Target className="h-4 w-4 text-primary shrink-0" />
              </CardTitle>
              <CardDescription>{g.department ? g.department.name : 'Organization-Wide'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span className="font-medium">{(g.currentReduction / g.targetReduction * 100).toFixed(0)}%</span>
              </div>
              <Progress value={(g.currentReduction / g.targetReduction) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-3">Target: {g.targetReduction}% Reduction | By: {new Date(g.endDate).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Sustainability Goals</CardTitle>
            <CardDescription>Manage and track reduction targets.</CardDescription>
          </div>
          <Button onClick={openCreateDialog}><Plus className="mr-2 h-4 w-4" /> Add Goal</Button>
        </CardHeader>
        <CardContent>
          <div className="flex pb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search goals..."
                className="w-full bg-background/50 pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Title</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Target (%)</TableHead>
                  <TableHead>Current (%)</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No goals found.</TableCell></TableRow>
                ) : (
                  filtered.map((g: any) => (
                    <TableRow key={g.id} className="hover:bg-primary/5">
                      <TableCell className="font-medium">{g.title}</TableCell>
                      <TableCell>{g.department?.name || 'Org-Wide'}</TableCell>
                      <TableCell>{g.targetReduction}%</TableCell>
                      <TableCell>{g.currentReduction}%</TableCell>
                      <TableCell>{new Date(g.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          g.status === 'ACHIEVED' ? 'bg-green-500/10 text-green-500' : 
                          g.status === 'FAILED' ? 'bg-red-500/10 text-red-500' : 
                          'bg-blue-500/10 text-blue-500'
                        }`}>{g.status}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(g)}><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeletingId(g.id); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingGoal ? 'Edit Goal' : 'Create Goal'}</DialogTitle>
            <DialogDescription>Set a new sustainability target.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Reduce Electricity by 15%" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="departmentId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department (Optional)</FormLabel>
                    <Select onValueChange={(val) => field.onChange(val === "none" ? undefined : Number(val))} value={field.value?.toString() || "none"}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Org-Wide" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="none">Org-Wide</SelectItem>
                        {departments.map((d: any) => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="ACHIEVED">Achieved</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="targetReduction" render={({ field }) => (
                  <FormItem><FormLabel>Target Reduction (%)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="currentReduction" render={({ field }) => (
                  <FormItem><FormLabel>Current Reduction (%)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="startDate" render={({ field }) => (
                  <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="endDate" render={({ field }) => (
                  <FormItem><FormLabel>End Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="pt-4 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Save Goal</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the goal.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && deleteMutation.mutate(deletingId)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
