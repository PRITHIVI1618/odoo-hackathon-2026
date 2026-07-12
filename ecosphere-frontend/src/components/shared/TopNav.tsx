import { ThemeToggle } from "./ThemeToggle"

export function TopNav() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card/50 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Placeholder for breadcrumbs or page title */}
        <h1 className="text-lg font-medium">Overview</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
          AD
        </div>
      </div>
    </header>
  )
}
