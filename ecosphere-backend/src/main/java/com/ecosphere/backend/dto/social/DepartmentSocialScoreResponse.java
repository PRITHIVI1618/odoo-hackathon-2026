package com.ecosphere.backend.dto.social;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentSocialScoreResponse {
    private Long departmentId;
    private String departmentName;
    private double score; // 0 to 100
}
