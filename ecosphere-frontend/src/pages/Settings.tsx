import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings as SettingsIcon, Building2, Palette, Key, Bell, Upload, Save } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Settings() {
  const [activeTab, setActiveTab] = useState("company")
  const [theme, setTheme] = useState("system")

  const handleSave = () => {
    toast.success("Settings saved successfully!")
  }

  return (
    <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            Platform Settings
          </h2>
          <p className="text-muted-foreground">Manage your organization preferences and API configurations.</p>
        </div>
        <Button onClick={handleSave} className="shadow-md hover:shadow-lg transition-all">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      <Tabs defaultValue="company" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 max-w-[600px] mb-6">
          <TabsTrigger value="company" className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Company</TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2"><Palette className="h-4 w-4" /> Theme</TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2"><Key className="h-4 w-4" /> API Keys</TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card className="glass shadow-sm max-w-3xl">
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Update your company's profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Company Logo</label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/50 flex items-center justify-center bg-muted/20">
                    <Building2 className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload New Logo</Button>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Organization Name</label>
                <input 
                  type="text" 
                  defaultValue="EcoSphere Global" 
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <option>Technology</option>
                  <option>Manufacturing</option>
                  <option>Energy</option>
                  <option>Logistics</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <Card className="glass shadow-sm max-w-3xl">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-4">
                <label className="text-sm font-medium">Theme Preference</label>
                <div className="flex gap-4">
                  <div 
                    onClick={() => setTheme('light')}
                    className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border'}`}
                  >
                    <div className="h-20 w-32 bg-white rounded shadow-sm border"></div>
                    <span className="text-sm font-medium">Light</span>
                  </div>
                  <div 
                    onClick={() => setTheme('dark')}
                    className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'}`}
                  >
                    <div className="h-20 w-32 bg-slate-950 rounded shadow-sm border border-slate-800"></div>
                    <span className="text-sm font-medium">Dark</span>
                  </div>
                  <div 
                    onClick={() => setTheme('system')}
                    className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border'}`}
                  >
                    <div className="h-20 w-32 bg-gradient-to-r from-white to-slate-950 rounded shadow-sm border border-slate-800"></div>
                    <span className="text-sm font-medium">System</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card className="glass shadow-sm max-w-3xl">
            <CardHeader>
              <CardTitle>API Integrations</CardTitle>
              <CardDescription>Manage keys for external services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Google Gemini API Key</label>
                <input 
                  type="password" 
                  defaultValue="••••••••••••••••••••••••••••••••" 
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                />
                <p className="text-xs text-muted-foreground">Used for AI Intelligence and Executive Summaries.</p>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">NewsAPI Key</label>
                <input 
                  type="password" 
                  defaultValue="••••••••••••••••••••••••••••••••" 
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="glass shadow-sm max-w-3xl">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive daily digests and critical alerts via email.</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-primary">
                  <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform translate-x-5"></span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive instant browser alerts for important events.</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-primary">
                  <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform translate-x-5"></span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Weekly Reports</h4>
                  <p className="text-sm text-muted-foreground">Receive an automated ESG summary every Monday.</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-muted">
                  <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform translate-x-0"></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
