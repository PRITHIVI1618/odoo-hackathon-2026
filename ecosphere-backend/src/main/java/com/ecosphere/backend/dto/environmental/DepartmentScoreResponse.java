package com.ecosphere.backend.dto.environmental;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DepartmentScoreResponse {
    private Long departmentId;
    private String departmentName;
    private Double score;
    private Double totalEmissions;
}
