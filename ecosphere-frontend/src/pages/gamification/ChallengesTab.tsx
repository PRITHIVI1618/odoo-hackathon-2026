import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge as UiBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Challenge } from "@/services/gamificationApi"
import { Target, Calendar, Award } from "lucide-react"

export function ChallengesTab({ challenges }: { challenges: Challenge[] }) {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map(challenge => (
          <Card key={challenge.id} className="glass flex flex-col hover:border-green-500/50 transition-colors group">
            <CardHeader>
              <div className="flex justify-between items-start">
                <UiBadge variant={challenge.status === 'ACTIVE' ? 'default' : 'secondary'} className={challenge.status === 'ACTIVE' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : ''}>
                  {challenge.status}
                </UiBadge>
                <UiBadge variant="outline">{challenge.category}</UiBadge>
              </div>
              <CardTitle className="mt-2 line-clamp-1">{challenge.title}</CardTitle>
              <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4 text-blue-500" />
                Target: {challenge.targetValue} {challenge.targetType.replace('_', ' ')}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-purple-500" />
                Ends: {new Date(challenge.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Award className="w-4 h-4 text-yellow-500" />
                Reward: <span className="text-green-500">+{challenge.xpReward} XP</span>
              </div>
              {challenge.badgeReward && (
                <div className="flex items-center gap-2 text-sm font-semibold text-yellow-600">
                  <Star className="w-4 h-4" />
                  + {challenge.badgeReward.name} Badge
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full group-hover:bg-green-500 group-hover:text-white transition-colors" variant="outline">
                View Progress
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {challenges.length === 0 && (
        <div className="text-center text-muted-foreground p-8 glass rounded-lg">
          No challenges available at the moment.
        </div>
      )}
    </div>
  )
}

function Star(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
