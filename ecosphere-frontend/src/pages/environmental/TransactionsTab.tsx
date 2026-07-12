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
import { transactionService, factorService } from "@/services/environmentalApi"
import { departmentService, userService } from "@/services/api"

const formSchema = z.object({
  departmentId: z.coerce.number().min(1, "Department is required"),
  employeeId: z.coerce.number().min(1, "Employee is required"),
  emissionFactorId: z.coerce.number().min(1, "Emission Factor is required"),
  quantity: z.coerce.number().min(0.0001, "Quantity must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
})

type TransactionFormValues = z.infer<typeof formSchema>

export function TransactionsTab() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0, date: new Date().toISOString().split('T')[0], notes: "",
    },
  })

  const { data: transactions = [], isLoading } = useQuery({ queryKey: ['env-transactions'], queryFn: transactionService.getTransactions })
  const { data: factors = [] } = useQuery({ queryKey: ['env-factors'], queryFn: factorService.getFactors })
  const { data: departments = [] } = useQuery({ queryKey: ['departments'], queryFn: departmentService.getDepartments })
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: userService.getUsers })

  const createMutation = useMutation({
    mutationFn: transactionService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['env-transactions'] })
      queryClient.invalidateQueries({ queryKey: ['env-kpis'] })
      toast.success("Transaction created successfully")
      closeDialog()
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed to create transaction")
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => transactionService.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['env-transactions'] })
      queryClient.invalidateQueries({ queryKey: ['env-kpis'] })
      toast.success("Transaction updated successfully")
      closeDialog()
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed to update transaction")
  })

  const deleteMutation = useMutation({
    mutationFn: transactionService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['env-transactions'] })
      queryClient.invalidateQueries({ queryKey: ['env-kpis'] })
      toast.success("Transaction deleted successfully")
      setIsDeleteDialogOpen(false)
    },
    onError: () => toast.error("Failed to delete transaction.")
  })

  const openCreateDialog = () => {
    setEditingTransaction(null)
    form.reset({ quantity: 0, date: new Date().toISOString().split('T')[0], notes: "" })
    setIsDialogOpen(true)
  }

  const openEditDialog = (t: any) => {
    setEditingTransaction(t)
    form.reset({
      departmentId: t.department?.id,
      employeeId: t.employee?.id,
      emissionFactorId: t.emissionFactor?.id,
      quantity: t.quantity,
      date: t.date,
      notes: t.notes || "",
    })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingTransaction(null)
    form.reset()
  }

  const onSubmit = (data: TransactionFormValues) => {
    const payload = {
      ...data,
      department: { id: data.departmentId },
      employee: { id: data.employeeId },
      emissionFactor: { id: data.emissionFactorId }
    }
    
    if (editingTransaction) {
      updateMutation.mutate({ id: editingTransaction.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const filtered = transactions.filter((t: any) => 
    t.department?.name?.toLowerCase().includes(search.toLowerCase()) || 
    t.source?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="glass shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Carbon Transactions Log</CardTitle>
            <CardDescription>Track every emission event across the organization.</CardDescription>
          </div>
          <Button onClick={openCreateDialog}><Plus className="mr-2 h-4 w-4" /> Add Record</Button>
        </CardHeader>
        <CardContent>
          <div className="flex pb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by department or source..."
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
                  <TableHead>Date</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="font-bold text-primary">Emissions (kgCO2e)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No records found.</TableCell></TableRow>
                ) : (
                  filtered.map((t: any) => (
                    <TableRow key={t.id} className="hover:bg-primary/5">
                      <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{t.department?.name}</TableCell>
                      <TableCell>{t.source}</TableCell>
                      <TableCell>{t.quantity} {t.emissionFactor?.unit}</TableCell>
                      <TableCell className="font-bold text-primary">{t.calculatedEmission?.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(t)}><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeletingId(t.id); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingTransaction ? 'Edit Transaction' : 'Record Emission'}</DialogTitle>
            <DialogDescription>Submit a new carbon transaction to the ledger.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="departmentId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {departments.map((d: any) => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="employeeId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>
                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select Employee" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {users.map((u: any) => <SelectItem key={u.id} value={u.id.toString()}>{u.firstName} {u.lastName}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="emissionFactorId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emission Factor</FormLabel>
                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select Source" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {factors.filter((f:any)=>f.status==='ACTIVE').map((f: any) => <SelectItem key={f.id} value={f.id.toString()}>{f.name} ({f.unit})</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="quantity" render={({ field }) => (
                  <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} max={new Date().toISOString().split('T')[0]} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem><FormLabel>Notes</FormLabel><FormControl><Input placeholder="Optional notes" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="pt-4 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Submit Record</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the transaction.</AlertDialogDescription>
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
