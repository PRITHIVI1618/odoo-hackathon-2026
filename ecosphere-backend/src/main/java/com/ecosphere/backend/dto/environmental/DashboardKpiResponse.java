package com.ecosphere.backend.dto.environmental;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardKpiResponse {
    private Double totalCarbonEmissions;
    private Double todaysEmissions;
    private Double monthlyEmissions;
    private Double averageEmission;
    private Integer activeGoals;
    private Integer completedGoals;
}
