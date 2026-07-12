package com.ecosphere.backend.service.ai;

import com.ecosphere.backend.dto.environmental.DashboardKpiResponse;
import com.ecosphere.backend.dto.environmental.DepartmentScoreResponse;
import com.ecosphere.backend.dto.governance.GovernanceDashboardKpiResponse;
import com.ecosphere.backend.dto.social.SocialDashboardKpiResponse;
import com.ecosphere.backend.dto.social.DepartmentSocialScoreResponse;
import com.ecosphere.backend.repository.UserRepository;
import com.ecosphere.backend.repository.gamification.EmployeeBadgeRepository;
import com.ecosphere.backend.repository.gamification.EmployeeChallengeRepository;
import com.ecosphere.backend.repository.governance.ComplianceIssueRepository;
import com.ecosphere.backend.repository.governance.RiskRepository;
import com.ecosphere.backend.service.EnvironmentalService;
import com.ecosphere.backend.service.GovernanceService;
import com.ecosphere.backend.service.SocialService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromptBuilderService {

    private final EnvironmentalService environmentalService;
    private final SocialService socialService;
    private final GovernanceService governanceService;
    private final UserRepository userRepository;
    private final EmployeeBadgeRepository employeeBadgeRepository;
    private final EmployeeChallengeRepository employeeChallengeRepository;
    private final RiskRepository riskRepository;
    private final ComplianceIssueRepository complianceIssueRepository;

    public String buildEsgContext() {
        DashboardKpiResponse envKpi = environmentalService.getDashboardKpis();
        List<DepartmentScoreResponse> envDeptScores = environmentalService.getDepartmentScores();
        
        SocialDashboardKpiResponse socialKpi = socialService.getKpis();
        List<DepartmentSocialScoreResponse> socialDeptScores = socialService.getDepartmentScores();
        
        GovernanceDashboardKpiResponse govKpi = governanceService.getDashboardKpis();
        
        long totalEmployees = userRepository.count();
        long totalBadges = employeeBadgeRepository.count();
        long completedChallenges = employeeChallengeRepository.findAll().stream()
                .filter(ec -> "COMPLETED".equals(ec.getStatus())).count();

        String topEnvDept = envDeptScores.isEmpty() ? "N/A" : envDeptScores.get(0).getDepartmentName();
        String worstEnvDept = envDeptScores.isEmpty() ? "N/A" : envDeptScores.get(envDeptScores.size() - 1).getDepartmentName();
        String topSocialDept = socialDeptScores.isEmpty() ? "N/A" : socialDeptScores.get(0).getDepartmentName();

        // Critical issues
        long criticalIssues = complianceIssueRepository.findAll().stream()
                .filter(i -> "High".equals(i.getSeverity()) || "Critical".equals(i.getSeverity()))
                .filter(i -> "Open".equals(i.getStatus()) || "Investigating".equals(i.getStatus()))
                .count();

        return String.format("""
                === EcoSphere AI - Live ESG Performance Context ===
                
                [ENVIRONMENTAL]
                - Total Carbon Footprint: %.2f kg CO2e (all time)
                - Monthly Emissions: %.2f kg CO2e
                - Active Environmental Goals: %d
                - Completed Environmental Goals: %d
                - Best performing department (lowest emissions): %s
                - Worst performing department (highest emissions): %s
                
                [SOCIAL]
                - Total CSR Activities: %d
                - Total Approved Volunteer Hours: %.1f hours
                - Active Volunteers: %d
                - Number of Training Programs: %d
                - Average Training Completion: %.1f%%
                - Best performing department (social score): %s
                
                [GOVERNANCE]
                - Active Policies: %d
                - Pending Policy Acknowledgements: %d
                - Upcoming Audits: %d
                - Open Compliance Issues: %d
                - High/Critical Compliance Issues: %d
                - Open Risks: %d
                - Policy Compliance Rate: %.1f%%
                - Audit Completion Rate: %.1f%%
                - Overall Governance Score: %.1f/100
                
                [GAMIFICATION & ENGAGEMENT]
                - Total Employees: %d
                - Challenges Completed: %d
                - Badges Awarded: %d
                
                ===================================================
                """,
                envKpi.getTotalCarbonEmissions(), envKpi.getMonthlyEmissions(),
                envKpi.getActiveGoals(), envKpi.getCompletedGoals(),
                topEnvDept, worstEnvDept,
                socialKpi.getTotalCsrActivities(), socialKpi.getTotalVolunteerHours(),
                socialKpi.getActiveParticipants(), socialKpi.getTotalTrainingPrograms(),
                socialKpi.getAverageTrainingCompletion(), topSocialDept,
                govKpi.getActivePolicies(), govKpi.getPendingAcknowledgements(),
                govKpi.getUpcomingAudits(), govKpi.getOpenComplianceIssues(), criticalIssues,
                govKpi.getOpenRisks(), govKpi.getPolicyCompliancePercentage(),
                govKpi.getAuditCompletionPercentage(), govKpi.getOverallGovernanceScore(),
                totalEmployees, completedChallenges, totalBadges
        );
    }
}
