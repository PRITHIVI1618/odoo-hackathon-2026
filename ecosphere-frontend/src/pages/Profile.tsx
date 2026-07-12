import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useAuthStore } from "@/store/useAuthStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Mail, Building, Briefcase, Phone } from "lucide-react"
import { toast } from "sonner"

export function Profile() {
  const { user, login, token } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  
  // Local state for editing
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [phone, setPhone] = useState("")

  const handleSave = () => {
    // In a real app, call API to update user
    if (user && token) {
      login(token, {
        ...user,
        firstName,
        lastName
      })
      toast.success("Profile updated successfully")
      setIsEditing(false)
    }
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">User Profile</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass shadow-sm md:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-3xl font-bold text-primary">
              {user?.firstName?.[0] || ""}{user?.lastName?.[0] || ""}
            </div>
            <h3 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h3>
            <p className="text-sm text-muted-foreground mb-4">{user?.role}</p>
            
            <div className="w-full space-y-3 mt-4">
              <div className="flex items-center text-sm text-muted-foreground gap-3">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground gap-3">
                <Briefcase className="h-4 w-4" />
                <span>{user?.role}</span>
              </div>
              {user?.department && (
                <div className="flex items-center text-sm text-muted-foreground gap-3">
                  <Building className="h-4 w-4" />
                  <span>{user?.department}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  disabled={!isEditing} 
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  disabled={!isEditing} 
                  className="bg-background/50"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input value={user?.email || ""} disabled className="bg-background/50" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                disabled={!isEditing} 
                placeholder="+1 234 567 8900"
                className="bg-background/50"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
