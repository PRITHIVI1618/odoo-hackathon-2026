import { Card, CardContent } from "@/components/ui/card"
import type { Badge as ApiBadge } from "@/services/gamificationApi"
import { Badge as UiBadge } from "@/components/ui/badge"

export function BadgesTab({ allBadges, earnedBadges }: { allBadges: ApiBadge[], earnedBadges: ApiBadge[] }) {
  const earnedIds = new Set(earnedBadges.map(b => b.id));

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {allBadges.map(badge => {
          const isEarned = earnedIds.has(badge.id);
          return (
            <Card key={badge.id} className={`glass overflow-hidden transition-all duration-300 ${isEarned ? 'border-yellow-500/50 shadow-yellow-500/10 shadow-lg' : 'opacity-75 hover:opacity-100 grayscale hover:grayscale-0'}`}>
              <CardContent className="p-6 flex flex-col items-center text-center relative">
                {isEarned && (
                  <UiBadge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 text-white border-0">Earned</UiBadge>
                )}
                
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isEarned ? 'bg-gradient-to-br from-yellow-400 to-amber-600 shadow-lg' : 'bg-muted border-2 border-dashed'}`}>
                  <span className={`text-4xl font-bold ${isEarned ? 'text-white drop-shadow-md' : 'text-muted-foreground'}`}>
                    {badge.icon || badge.name.charAt(0)}
                  </span>
                </div>
                
                <h3 className={`font-bold text-lg mb-2 ${isEarned ? 'text-yellow-600' : ''}`}>{badge.name}</h3>
                <p className="text-xs text-muted-foreground mb-4 h-10 line-clamp-2">{badge.description}</p>
                
                <div className="w-full pt-4 border-t border-muted/50">
                  <p className="text-xs font-medium">How to unlock:</p>
                  <p className="text-xs text-muted-foreground">{badge.unlockCriteria}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {allBadges.length === 0 && (
        <div className="text-center text-muted-foreground p-8 glass rounded-lg">
          No badges have been created yet.
        </div>
      )}
    </div>
  )
}
