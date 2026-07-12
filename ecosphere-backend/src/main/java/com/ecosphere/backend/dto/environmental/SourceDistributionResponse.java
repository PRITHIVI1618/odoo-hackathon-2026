package com.ecosphere.backend.dto.environmental;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SourceDistributionResponse {
    private String source;
    private Double value;
}
