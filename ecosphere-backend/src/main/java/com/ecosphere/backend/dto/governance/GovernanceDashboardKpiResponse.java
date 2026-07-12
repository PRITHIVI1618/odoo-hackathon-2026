package com.ecosphere.backend.dto.governance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GovernanceDashboardKpiResponse {
    private long activePolicies;
    private long pendingAcknowledgements;
    private long upcomingAudits;
    private long openComplianceIssues;
    private long openRisks;
    private double overallGovernanceScore; // Normalized to 100
    private double policyCompliancePercentage;
    private double auditCompletionPercentage;
}
