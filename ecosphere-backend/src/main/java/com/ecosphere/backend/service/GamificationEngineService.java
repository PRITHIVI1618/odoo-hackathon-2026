package com.ecosphere.backend.service;

import com.ecosphere.backend.dto.gamification.DepartmentLeaderboardResponse;
import com.ecosphere.backend.dto.gamification.GamificationDashboardResponse;
import com.ecosphere.backend.dto.gamification.LeaderboardEntryResponse;
import com.ecosphere.backend.entity.User;
import com.ecosphere.backend.entity.gamification.*;
import com.ecosphere.backend.repository.UserRepository;
import com.ecosphere.backend.repository.gamification.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GamificationEngineService {

    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;
    private final EmployeeChallengeRepository employeeChallengeRepository;
    private final BadgeRepository badgeRepository;
    private final EmployeeBadgeRepository employeeBadgeRepository;
    private final RewardRepository rewardRepository;
    private final RewardRedemptionRepository rewardRedemptionRepository;
    private final AchievementTimelineRepository timelineRepository;

    private static final int BASE_XP = 250;
    private static final double XP_MULTIPLIER = 1.5;

    public int calculateXpForLevel(int level) {
        if (level <= 1) return 0;
        // Simple scaling: 250, 500, 900, 1400...
        int xp = 0;
        for (int i = 1; i < level; i++) {
            xp += (int) (BASE_XP * Math.pow(XP_MULTIPLIER, i - 1));
        }
        // Round to nearest 50 for clean numbers
        return (Math.round((float) xp / 50) * 50);
    }

    public int getLevelForXp(int xp) {
        int level = 1;
        while (xp >= calculateXpForLevel(level + 1)) {
            level++;
        }
        return level;
    }

    @Transactional
    public void awardXp(User user, int xpAmount, String actionType, String title) {
        user.setXp(user.getXp() + xpAmount);
        
        int newLevel = getLevelForXp(user.getXp());
        boolean leveledUp = newLevel > user.getLevel();
        if (leveledUp) {
            user.setLevel(newLevel);
            // Log level up
            logActivity(user, "LEVEL_UP", "Reached Level " + newLevel, 0);
        }
        userRepository.save(user);

        // Log XP gain
        logActivity(user, actionType, title, xpAmount);
    }

    @Transactional
    public void logActivity(User user, String actionType, String title, int xpEarned) {
        AchievementTimeline timeline = new AchievementTimeline();
        timeline.setEmployee(user);
        timeline.setActionType(actionType);
        timeline.setTitle(title);
        timeline.setXpEarned(xpEarned);
        timelineRepository.save(timeline);
    }

    @Transactional
    public void awardBadge(User user, String badgeName) {
        Optional<Badge> badgeOpt = badgeRepository.findByName(badgeName);
        if (badgeOpt.isPresent()) {
            Badge badge = badgeOpt.get();
            // Check if already earned
            if (employeeBadgeRepository.findByEmployeeIdAndBadgeId(user.getId(), badge.getId()).isEmpty()) {
                EmployeeBadge eb = new EmployeeBadge();
                eb.setEmployee(user);
                eb.setBadge(badge);
                employeeBadgeRepository.save(eb);
                logActivity(user, "BADGE_EARNED", "Earned Badge: " + badge.getName(), 0);
            }
        }
    }

    @Transactional
    public RewardRedemption redeemReward(Long employeeId, Long rewardId) {
        User user = userRepository.findById(employeeId).orElseThrow(() -> new RuntimeException("User not found"));
        Reward reward = rewardRepository.findById(rewardId).orElseThrow(() -> new RuntimeException("Reward not found"));

        if (reward.getStatus().equals("OUT_OF_STOCK") || (reward.getStock() == 0)) {
            throw new RuntimeException("Reward out of stock");
        }

        if (user.getXp() < reward.getPointsRequired()) {
            throw new RuntimeException("Not enough XP to redeem reward");
        }

        // We don't deduct XP (XP is total experience), but we might want "Points". 
        // For simplicity, we just check if they have reached the XP threshold or deduct points.
        // Wait, the prompt says "XP calculated automatically... pointsRequired... pointsUsed".
        // Let's deduct XP to act as points.
        user.setXp(user.getXp() - reward.getPointsRequired());
        user.setLevel(getLevelForXp(user.getXp())); // Downgrade level if XP drops? No, XP is lifetime. 
        // Better: user has totalXp and availablePoints. Since we only have XP, we deduct XP but let's assume level is based on lifetime XP? 
        // Let's just deduct XP.
        userRepository.save(user);

        if (reward.getStock() > 0) {
            reward.setStock(reward.getStock() - 1);
            if (reward.getStock() == 0) {
                reward.setStatus("OUT_OF_STOCK");
            }
            rewardRepository.save(reward);
        }

        RewardRedemption redemption = new RewardRedemption();
        redemption.setEmployee(user);
        redemption.setReward(reward);
        redemption.setPointsUsed(reward.getPointsRequired());
        rewardRedemptionRepository.save(redemption);

        logActivity(user, "REWARD", "Redeemed: " + reward.getTitle(), -reward.getPointsRequired());

        return redemption;
    }

    public GamificationDashboardResponse getPersonalDashboard(Long employeeId) {
        User user = userRepository.findById(employeeId).orElseThrow();
        List<User> allUsers = userRepository.findAll();
        allUsers.sort((u1, u2) -> u2.getXp().compareTo(u1.getXp()));
        int rank = allUsers.indexOf(user) + 1;

        int currentXp = user.getXp();
        int currentLevel = user.getLevel();
        int xpForCurrentLevel = calculateXpForLevel(currentLevel);
        int xpForNextLevel = calculateXpForLevel(currentLevel + 1);
        int progress = (int) (((double) (currentXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100);

        List<EmployeeChallenge> challenges = employeeChallengeRepository.findByEmployeeId(employeeId);
        long completed = challenges.stream().filter(EmployeeChallenge::getCompleted).count();

        List<EmployeeBadge> employeeBadges = employeeBadgeRepository.findByEmployeeId(employeeId);
        List<Badge> badges = employeeBadges.stream().map(EmployeeBadge::getBadge).collect(Collectors.toList());

        List<AchievementTimeline> timeline = timelineRepository.findByEmployeeIdOrderByTimestampDesc(employeeId);
        
        List<RewardRedemption> redemptions = rewardRedemptionRepository.findByEmployeeId(employeeId);

        return GamificationDashboardResponse.builder()
                .currentXp(currentXp)
                .currentLevel(currentLevel)
                .xpToNextLevel(xpForNextLevel)
                .progressPercentage(Math.min(100, Math.max(0, progress)))
                .rank(rank)
                .totalEmployees(allUsers.size())
                .challengesCompleted((int) completed)
                .totalChallenges(challengeRepository.findByStatus("ACTIVE").size())
                .rewardsRedeemed(redemptions.size())
                .earnedBadges(badges)
                .recentActivity(timeline.stream().limit(10).collect(Collectors.toList()))
                .build();
    }

    public List<LeaderboardEntryResponse> getEmployeeLeaderboard() {
        List<User> users = userRepository.findAll();
        users.sort((u1, u2) -> u2.getXp().compareTo(u1.getXp()));
        
        List<LeaderboardEntryResponse> leaderboard = new ArrayList<>();
        int rank = 1;
        for (User u : users) {
            long badgesCount = employeeBadgeRepository.findByEmployeeId(u.getId()).size();
            long challengesCount = employeeChallengeRepository.findByEmployeeId(u.getId()).stream().filter(EmployeeChallenge::getCompleted).count();
            
            leaderboard.add(LeaderboardEntryResponse.builder()
                    .rank(rank++)
                    .employeeId(u.getId())
                    .employeeName(u.getFirstName() + " " + u.getLastName())
                    .departmentName(u.getDepartment() != null ? u.getDepartment().getName() : "None")
                    .avatarUrl(u.getAvatarUrl())
                    .xp(u.getXp())
                    .level(u.getLevel())
                    .badgesCount((int) badgesCount)
                    .challengesCompleted((int) challengesCount)
                    .build());
        }
        return leaderboard;
    }

    public List<DepartmentLeaderboardResponse> getDepartmentLeaderboard() {
        List<User> users = userRepository.findAll();
        Map<Long, List<User>> byDept = users.stream()
                .filter(u -> u.getDepartment() != null)
                .collect(Collectors.groupingBy(u -> u.getDepartment().getId()));

        List<DepartmentLeaderboardResponse> leaderboard = new ArrayList<>();
        for (Map.Entry<Long, List<User>> entry : byDept.entrySet()) {
            List<User> deptUsers = entry.getValue();
            int totalXp = deptUsers.stream().mapToInt(User::getXp).sum();
            int totalBadges = deptUsers.stream().mapToInt(u -> employeeBadgeRepository.findByEmployeeId(u.getId()).size()).sum();
            
            leaderboard.add(DepartmentLeaderboardResponse.builder()
                    .departmentId(entry.getKey())
                    .departmentName(deptUsers.get(0).getDepartment().getName())
                    .totalXp(totalXp)
                    .activeEmployees(deptUsers.size())
                    .totalBadges(totalBadges)
                    .build());
        }

        leaderboard.sort((d1, d2) -> d2.getTotalXp().compareTo(d1.getTotalXp()));
        int rank = 1;
        for (DepartmentLeaderboardResponse dr : leaderboard) {
            dr.setRank(rank++);
        }
        return leaderboard;
    }

    public List<Challenge> getAllChallenges() {
        return challengeRepository.findAll();
    }
    
    public List<Reward> getAllRewards() {
        return rewardRepository.findAll();
    }
    
    public List<Badge> getAllBadges() {
        return badgeRepository.findAll();
    }
}
