package com.ecosphere.backend.dto.ai;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class EsgContextDto {
    private Environmental environmental;
    private Social social;
    private Governance governance;
    private Gamification gamification;

    @Data
    @Builder
    public static class Environmental {
        private double totalCarbonFootprint;
        private double totalEnergyConsumption;
        private double totalWasteRecycled;
        private double totalWaterUsage;
    }

    @Data
    @Builder
    public static class Social {
        private double totalCsrHours;
        private double averageTrainingCompletion;
        private int totalVolunteers;
    }

    @Data
    @Builder
    public static class Governance {
        private int totalOpenRisks;
        private int criticalIssues;
        private double policyAcknowledgementRate;
    }

    @Data
    @Builder
    public static class Gamification {
        private int totalEmployees;
        private int totalChallengesCompleted;
        private int totalBadgesAwarded;
    }
}
