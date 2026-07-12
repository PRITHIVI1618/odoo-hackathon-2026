package com.ecosphere.backend.dto.ai;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AiDashboardResponse {
    private double overallEsgScore;
    private String healthStatus;
    private int criticalRisks;
    private String topRecommendation;
    private NewsResponse latestNews;
    private WeatherResponse weather;
}
