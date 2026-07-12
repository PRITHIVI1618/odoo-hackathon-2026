package com.ecosphere.backend.dto.gamification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentLeaderboardResponse {
    private Integer rank;
    private Long departmentId;
    private String departmentName;
    private Integer totalXp;
    private Integer activeEmployees;
    private Integer totalBadges;
}
