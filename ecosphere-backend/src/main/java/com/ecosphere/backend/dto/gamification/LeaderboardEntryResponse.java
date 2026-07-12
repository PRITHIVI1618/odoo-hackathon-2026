package com.ecosphere.backend.dto.gamification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryResponse {
    private Integer rank;
    private Long employeeId;
    private String employeeName;
    private String departmentName;
    private String avatarUrl;
    private Integer xp;
    private Integer level;
    private Integer badgesCount;
    private Integer challengesCompleted;
}
