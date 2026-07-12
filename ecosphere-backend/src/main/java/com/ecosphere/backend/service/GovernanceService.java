package com.ecosphere.backend.service;

import com.ecosphere.backend.dto.governance.DepartmentGovernanceScoreResponse;
import com.ecosphere.backend.dto.governance.GovChartDataResponse;
import com.ecosphere.backend.dto.governance.GovernanceDashboardKpiResponse;
import com.ecosphere.backend.entity.Department;
import com.ecosphere.backend.entity.User;
import com.ecosphere.backend.entity.governance.*;
import com.ecosphere.backend.repository.DepartmentRepository;
import com.ecosphere.backend.repository.UserRepository;
import com.ecosphere.backend.repository.governance.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GovernanceService {

    private final PolicyRepository policyRepository;
    private final PolicyAcknowledgementRepository acknowledgementRepository;
    private final AuditRepository auditRepository;
    private final ComplianceIssueRepository issueRepository;
    private final RiskRepository riskRepository;
    private final CorrectiveActionRepository correctiveActionRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final GamificationEngineService gamificationService;

    public GovernanceDashboardKpiResponse getDashboardKpis() {
        long activePolicies = policyRepository.findByStatus("Published").size();
        long pendingAck = acknowledgementRepository.findAll().stream()
                .filter(ack -> "Pending".equals(ack.getStatus())).count();
        long upcomingAudits = auditRepository.findByStatus("Planned").size();
        long openIssues = issueRepository.findByStatus("Open").size() + issueRepository.findByStatus("Investigating").size();
        long openRisks = riskRepository.findByStatus("Open").size();

        double policyCompliance = calculateOverallPolicyCompliance();
        double auditCompletion = calculateOverallAuditCompletion();
        double overallScore = (policyCompliance + auditCompletion) / 2.0;

        return new GovernanceDashboardKpiResponse(
                activePolicies, pendingAck, upcomingAudits, openIssues, openRisks,
                Math.round(overallScore * 10.0) / 10.0,
                Math.round(policyCompliance * 10.0) / 10.0,
                Math.round(auditCompletion * 10.0) / 10.0
        );
    }

    private double calculateOverallPolicyCompliance() {
        long total = acknowledgementRepository.count();
        if (total == 0) return 100.0;
        long ack = acknowledgementRepository.findAll().stream().filter(a -> "Acknowledged".equals(a.getStatus())).count();
        return ((double) ack / total) * 100;
    }

    private double calculateOverallAuditCompletion() {
        long total = auditRepository.count();
        if (total == 0) return 100.0;
        long completed = auditRepository.findByStatus("Completed").size();
        return ((double) completed / total) * 100;
    }

    public List<GovChartDataResponse> getPolicyStatusDistribution() {
        return policyRepository.findAll().stream()
                .collect(Collectors.groupingBy(Policy::getStatus, Collectors.counting()))
                .entrySet().stream()
                .map(e -> new GovChartDataResponse(e.getKey(), e.getValue(), getColorForPolicyStatus(e.getKey())))
                .collect(Collectors.toList());
    }

    private String getColorForPolicyStatus(String status) {
        switch (status) {
            case "Published": return "#10b981";
            case "Approved": return "#3b82f6";
            case "Under Review": return "#f59e0b";
            case "Draft": return "#64748b";
            default: return "#94a3b8";
        }
    }

    public List<GovChartDataResponse> getRiskMatrix() {
        // Group by RiskScore ranges or Category for visual matrix
        return riskRepository.findAll().stream()
                .collect(Collectors.groupingBy(Risk::getCategory, Collectors.counting()))
                .entrySet().stream()
                .map(e -> new GovChartDataResponse(e.getKey(), e.getValue(), "#ef4444")) // simple red for risks
                .collect(Collectors.toList());
    }

    public List<DepartmentGovernanceScoreResponse> getDepartmentScores() {
        List<Department> depts = departmentRepository.findAll();
        List<DepartmentGovernanceScoreResponse> res = new ArrayList<>();
        for (Department d : depts) {
            double score = Math.random() * 20 + 80; // Mock calculation 80-100
            res.add(new DepartmentGovernanceScoreResponse(d.getName(), Math.round(score * 10.0) / 10.0));
        }
        res.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        return res;
    }

    // CRUD Policies
    public List<Policy> getAllPolicies() { return policyRepository.findAll(); }
    public Policy createPolicy(Policy policy) { return policyRepository.save(policy); }
    public Policy updatePolicy(Long id, Policy data) {
        Policy p = policyRepository.findById(id).orElseThrow();
        p.setTitle(data.getTitle());
        p.setCategory(data.getCategory());
        p.setDescription(data.getDescription());
        p.setStatus(data.getStatus());
        p.setVersion(data.getVersion());
        return policyRepository.save(p);
    }
    public void deletePolicy(Long id) { policyRepository.deleteById(id); }

    // Policy Acknowledgment
    public PolicyAcknowledgement acknowledgePolicy(Long ackId) {
        PolicyAcknowledgement ack = acknowledgementRepository.findById(ackId).orElseThrow();
        boolean wasPending = "Pending".equals(ack.getStatus());
        
        ack.setStatus("Acknowledged");
        ack.setAcknowledgedAt(LocalDateTime.now());
        PolicyAcknowledgement saved = acknowledgementRepository.save(ack);
        
        if (wasPending) {
            gamificationService.awardXp(saved.getEmployee(), 50, "POLICY", "Acknowledged Policy: " + saved.getPolicy().getTitle());
        }
        
        return saved;
    }
    
    public List<PolicyAcknowledgement> getAcknowledgementsByEmployee(Long employeeId) {
        return acknowledgementRepository.findByEmployeeId(employeeId);
    }
    
    public List<PolicyAcknowledgement> getAllAcknowledgements() {
        return acknowledgementRepository.findAll();
    }

    // Audits
    public List<Audit> getAllAudits() { return auditRepository.findAll(); }
    public Audit createAudit(Audit audit) { return auditRepository.save(audit); }
    public Audit updateAudit(Long id, Audit data) {
        Audit a = auditRepository.findById(id).orElseThrow();
        a.setAuditName(data.getAuditName());
        a.setStatus(data.getStatus());
        a.setSummary(data.getSummary());
        return auditRepository.save(a);
    }
    public void deleteAudit(Long id) { auditRepository.deleteById(id); }

    // Issues
    public List<ComplianceIssue> getAllIssues() { return issueRepository.findAll(); }
    public ComplianceIssue createIssue(ComplianceIssue issue) { return issueRepository.save(issue); }
    public ComplianceIssue updateIssue(Long id, ComplianceIssue data) {
        ComplianceIssue i = issueRepository.findById(id).orElseThrow();
        i.setTitle(data.getTitle());
        i.setStatus(data.getStatus());
        return issueRepository.save(i);
    }
    public void deleteIssue(Long id) { issueRepository.deleteById(id); }

    // Risks
    public List<Risk> getAllRisks() { return riskRepository.findAll(); }
    public Risk createRisk(Risk risk) { return riskRepository.save(risk); }
    public Risk updateRisk(Long id, Risk data) {
        Risk r = riskRepository.findById(id).orElseThrow();
        r.setLikelihood(data.getLikelihood());
        r.setImpact(data.getImpact());
        r.setStatus(data.getStatus());
        return riskRepository.save(r);
    }
    public void deleteRisk(Long id) { riskRepository.deleteById(id); }

    // Corrective Actions
    public List<CorrectiveAction> getAllCorrectiveActions() { return correctiveActionRepository.findAll(); }
    public CorrectiveAction createCorrectiveAction(CorrectiveAction action) { return correctiveActionRepository.save(action); }
}
