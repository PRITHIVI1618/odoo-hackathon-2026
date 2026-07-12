package com.ecosphere.backend.dto.governance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GovChartDataResponse {
    private String name;
    private Number value;
    private String fill; // For colored charts like Risk Matrix
}
