import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge as UiBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GamificationService } from "@/services/gamificationApi"
import type { Reward } from "@/services/gamificationApi"
import { Gift, AlertCircle, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { useAuthStore } from "@/store/useAuthStore"

export function RewardsTab({ rewards, currentXp, refetch }: { rewards: Reward[], currentXp: number, refetch: () => void }) {
  const [redeeming, setRedeeming] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);

  const handleRedeem = async (reward: Reward) => {
    if (!user) return;
    try {
      setRedeeming(reward.id);
      setError(null);
      await GamificationService.redeemReward(reward.id, user.id);
      refetch();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to redeem reward');
    } finally {
      setRedeeming(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="flex items-center justify-between p-4 glass rounded-lg border-blue-500/20 bg-blue-500/5">
        <div>
          <h3 className="font-semibold flex items-center gap-2"><Gift className="w-5 h-5 text-purple-500" /> Reward Catalog</h3>
          <p className="text-sm text-muted-foreground">Redeem your hard-earned XP for real-world rewards.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Available XP</p>
          <p className="text-2xl font-bold text-green-500">{currentXp}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rewards.map(reward => {
          const canAfford = currentXp >= reward.pointsRequired;
          const outOfStock = reward.status === 'OUT_OF_STOCK' || reward.stock === 0;

          return (
            <Card key={reward.id} className={`glass flex flex-col transition-colors ${canAfford && !outOfStock ? 'hover:border-purple-500/50' : 'opacity-80'}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <UiBadge variant={outOfStock ? 'destructive' : 'default'} className={!outOfStock ? 'bg-purple-500/20 text-purple-500 hover:bg-purple-500/30' : ''}>
                    {outOfStock ? 'Out of Stock' : 'Available'}
                  </UiBadge>
                  <span className="text-sm font-bold text-green-500">{reward.pointsRequired} XP</span>
                </div>
                <CardTitle className="mt-4">{reward.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                {reward.stock > 0 && (
                  <p className="text-xs text-muted-foreground">Only {reward.stock} left in stock!</p>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${canAfford && !outOfStock ? 'bg-purple-500 hover:bg-purple-600 text-white' : ''}`}
                  disabled={!canAfford || outOfStock || redeeming === reward.id}
                  variant={canAfford && !outOfStock ? 'default' : 'secondary'}
                  onClick={() => handleRedeem(reward)}
                >
                  {redeeming === reward.id ? 'Redeeming...' : outOfStock ? 'Out of Stock' : !canAfford ? 'Not Enough XP' : 'Redeem Reward'}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
      {rewards.length === 0 && (
        <div className="text-center text-muted-foreground p-8 glass rounded-lg">
          No rewards available in the catalog.
        </div>
      )}
    </div>
  )
}
