import { AlertTriangle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ErrorState({ message, retry }: { message?: string, retry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[200px] gap-4 p-6 text-center border-2 border-dashed border-destructive/20 rounded-xl bg-destructive/5">
      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <div className="max-w-[300px]">
        <h3 className="font-semibold text-lg mb-1">Failed to load data</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {message || "An unexpected error occurred while fetching the required information."}
        </p>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>
        )}
      </div>
    </div>
  )
}
