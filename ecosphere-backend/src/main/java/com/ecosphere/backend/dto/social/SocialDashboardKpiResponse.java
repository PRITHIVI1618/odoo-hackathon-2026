package com.ecosphere.backend.dto.social;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocialDashboardKpiResponse {
    private long totalCsrActivities;
    private long activeParticipants;
    private double totalVolunteerHours;
    private long totalTrainingPrograms;
    private double averageTrainingCompletion;
    private double overallSocialScore;
    private double averageDepartmentParticipation;
}
