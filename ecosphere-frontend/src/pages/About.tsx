import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, Code, Layers, Server, Shield, BrainCircuit } from "lucide-react"

export function About() {
  return (
    <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between text-center flex-col space-y-4 py-8">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center shadow-inner">
          <LeafIcon className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">EcoSphere AI</h2>
          <p className="text-muted-foreground text-lg mt-2">Intelligent ESG Management Platform</p>
          <Badge className="mt-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">Version 1.0.0</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5 text-blue-500" /> Core Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0"><LeafIcon className="h-4 w-4 text-green-500" /></div>
              <div>
                <h4 className="font-medium text-sm">Environmental Module</h4>
                <p className="text-sm text-muted-foreground">Scope 1, 2, 3 carbon tracking, emission factors, and predictive sustainability goals.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0"><Shield className="h-4 w-4 text-blue-500" /></div>
              <div>
                <h4 className="font-medium text-sm">Social & Governance</h4>
                <p className="text-sm text-muted-foreground">CSR activities, compliance auditing, risk matrices, and policy acknowledgements.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0"><BrainCircuit className="h-4 w-4 text-purple-500" /></div>
              <div>
                <h4 className="font-medium text-sm">AI Intelligence</h4>
                <p className="text-sm text-muted-foreground">Gemini-powered ESG advisor, automated executive summaries, and predictive analytics.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Code className="h-5 w-5 text-amber-500" /> Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2"><Server className="h-4 w-4 text-muted-foreground" /> Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">React 18</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Vite</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                  <Badge variant="secondary">Zustand</Badge>
                  <Badge variant="secondary">Framer Motion</Badge>
                  <Badge variant="secondary">Recharts</Badge>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2"><DatabaseIcon className="h-4 w-4 text-muted-foreground" /> Backend</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Spring Boot 3.3</Badge>
                  <Badge variant="outline">Java 17</Badge>
                  <Badge variant="outline">Spring Security + JWT</Badge>
                  <Badge variant="outline">Spring Data JPA</Badge>
                  <Badge variant="outline">MySQL</Badge>
                  <Badge variant="outline">Google Gemini API</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center text-sm text-muted-foreground mt-8 pb-8">
        <p>Developed for the Odoo Hackathon 2026</p>
        <p className="mt-1">© 2026 EcoSphere AI Team. All rights reserved.</p>
      </div>
    </div>
  )
}

function LeafIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

function DatabaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  )
}
