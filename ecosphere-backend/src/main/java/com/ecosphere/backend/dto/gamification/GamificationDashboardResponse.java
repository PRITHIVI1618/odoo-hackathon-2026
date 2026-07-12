package com.ecosphere.backend.dto.gamification;

import com.ecosphere.backend.entity.gamification.AchievementTimeline;
import com.ecosphere.backend.entity.gamification.Badge;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GamificationDashboardResponse {
    private Integer currentXp;
    private Integer currentLevel;
    private Integer xpToNextLevel;
    private Integer progressPercentage;
    private Integer rank;
    private Integer totalEmployees;
    private Integer challengesCompleted;
    private Integer totalChallenges;
    private Integer rewardsRedeemed;
    
    private List<Badge> earnedBadges;
    private List<AchievementTimeline> recentActivity;
}
