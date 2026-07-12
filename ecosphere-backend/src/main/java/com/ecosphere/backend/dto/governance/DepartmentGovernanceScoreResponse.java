package com.ecosphere.backend.dto.governance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentGovernanceScoreResponse {
    private String departmentName;
    private double score;
}
