package com.ecosphere.backend.controller;

import com.ecosphere.backend.dto.gamification.DepartmentLeaderboardResponse;
import com.ecosphere.backend.dto.gamification.GamificationDashboardResponse;
import com.ecosphere.backend.dto.gamification.LeaderboardEntryResponse;
import com.ecosphere.backend.entity.gamification.Badge;
import com.ecosphere.backend.entity.gamification.Challenge;
import com.ecosphere.backend.entity.gamification.Reward;
import com.ecosphere.backend.entity.gamification.RewardRedemption;
import com.ecosphere.backend.service.GamificationEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gamification")
@RequiredArgsConstructor
public class GamificationController {

    private final GamificationEngineService gamificationService;

    @GetMapping("/dashboard/{employeeId}")
    public ResponseEntity<GamificationDashboardResponse> getPersonalDashboard(@PathVariable Long employeeId) {
        return ResponseEntity.ok(gamificationService.getPersonalDashboard(employeeId));
    }

    @GetMapping("/leaderboard/employee")
    public ResponseEntity<List<LeaderboardEntryResponse>> getEmployeeLeaderboard() {
        return ResponseEntity.ok(gamificationService.getEmployeeLeaderboard());
    }

    @GetMapping("/leaderboard/department")
    public ResponseEntity<List<DepartmentLeaderboardResponse>> getDepartmentLeaderboard() {
        return ResponseEntity.ok(gamificationService.getDepartmentLeaderboard());
    }

    @GetMapping("/challenges")
    public ResponseEntity<List<Challenge>> getAllChallenges() {
        return ResponseEntity.ok(gamificationService.getAllChallenges());
    }

    @GetMapping("/badges")
    public ResponseEntity<List<Badge>> getAllBadges() {
        return ResponseEntity.ok(gamificationService.getAllBadges());
    }

    @GetMapping("/rewards")
    public ResponseEntity<List<Reward>> getAllRewards() {
        return ResponseEntity.ok(gamificationService.getAllRewards());
    }

    @PostMapping("/rewards/{rewardId}/redeem/{employeeId}")
    public ResponseEntity<RewardRedemption> redeemReward(
            @PathVariable Long rewardId,
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(gamificationService.redeemReward(employeeId, rewardId));
    }
}
