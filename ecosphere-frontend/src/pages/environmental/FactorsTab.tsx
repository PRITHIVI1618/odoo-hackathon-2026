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
import { Search, Plus, Edit2, Trash2, Loader2 } from "lucide-react"
import { factorService } from "@/services/environmentalApi"

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  source: z.string().min(2, "Source is required"),
  category: z.string().min(2, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
  emissionFactor: z.coerce.number().min(0.000001, "Factor must be positive"),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
})

type FactorFormValues = z.infer<typeof formSchema>

export function FactorsTab() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingFactor, setEditingFactor] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const form = useForm<FactorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", source: "", category: "", unit: "", emissionFactor: 0, description: "", status: "ACTIVE",
    },
  })

  const { data: factors = [], isLoading } = useQuery({
    queryKey: ['env-factors'],
    queryFn: factorService.getFactors,
  })

  const createMutation = useMutation({
    mutationFn: factorService.createFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['env-factors'] })
      toast.success("Emission Factor created successfully")
      closeDialog()
    },
    onError: () => toast.error("Failed to create factor")
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: FactorFormValues }) => factorService.updateFactor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['env-factors'] })
      toast.success("Emission Factor updated successfully")
      closeDialog()
    },
    onError: () => toast.error("Failed to update factor")
  })

  const deleteMutation = useMutation({
    mutationFn: factorService.deleteFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['env-factors'] })
      toast.success("Emission Factor deleted successfully")
      setIsDeleteDialogOpen(false)
    },
    onError: () => toast.error("Failed to delete factor. It might be in use.")
  })

  const openCreateDialog = () => {
    setEditingFactor(null)
    form.reset({ name: "", source: "", category: "", unit: "", emissionFactor: 0, description: "", status: "ACTIVE" })
    setIsDialogOpen(true)
  }

  const openEditDialog = (f: any) => {
    setEditingFactor(f)
    form.reset({
      name: f.name, source: f.source, category: f.category, unit: f.unit,
      emissionFactor: f.emissionFactor, description: f.description || "", status: f.status,
    })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingFactor(null)
    form.reset()
  }

  const onSubmit = (data: FactorFormValues) => {
    if (editingFactor) {
      updateMutation.mutate({ id: editingFactor.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const filtered = factors.filter((f: any) => 
    f.name?.toLowerCase().includes(search.toLowerCase()) || 
    f.source?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="glass shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Emission Factors Library</CardTitle>
            <CardDescription>Master data for carbon calculations.</CardDescription>
          </div>
          <Button onClick={openCreateDialog}><Plus className="mr-2 h-4 w-4" /> Add Factor</Button>
        </CardHeader>
        <CardContent>
          <div className="flex pb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search factors..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Factor (kgCO2e/Unit)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No emission factors found.</TableCell></TableRow>
                ) : (
                  filtered.map((f: any) => (
                    <TableRow key={f.id} className="hover:bg-primary/5">
                      <TableCell className="font-medium">{f.name}</TableCell>
                      <TableCell>{f.source}</TableCell>
                      <TableCell>{f.category}</TableCell>
                      <TableCell>{f.emissionFactor} / {f.unit}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${f.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{f.status}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(f)}><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeletingId(f.id); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
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
            <DialogTitle>{editingFactor ? 'Edit Factor' : 'Create Factor'}</DialogTitle>
            <DialogDescription>Add a new environmental emission conversion factor.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Grid Electricity" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="source" render={({ field }) => (
                  <FormItem><FormLabel>Source</FormLabel><FormControl><Input placeholder="Electricity" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="Scope 2" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="unit" render={({ field }) => (
                  <FormItem><FormLabel>Unit</FormLabel><FormControl><Input placeholder="kWh" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="emissionFactor" render={({ field }) => (
                  <FormItem><FormLabel>Factor (kgCO2e)</FormLabel><FormControl><Input type="number" step="0.000001" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
              </div>
              <div className="pt-4 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Save</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the emission factor.</AlertDialogDescription>
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
