package com.ecosphere.backend.controller;

import com.ecosphere.backend.dto.governance.DepartmentGovernanceScoreResponse;
import com.ecosphere.backend.dto.governance.GovChartDataResponse;
import com.ecosphere.backend.dto.governance.GovernanceDashboardKpiResponse;
import com.ecosphere.backend.entity.governance.*;
import com.ecosphere.backend.service.GovernanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/governance")
@RequiredArgsConstructor
public class GovernanceController {

    private final GovernanceService governanceService;

    @GetMapping("/dashboard/kpis")
    public ResponseEntity<GovernanceDashboardKpiResponse> getDashboardKpis() {
        return ResponseEntity.ok(governanceService.getDashboardKpis());
    }

    @GetMapping("/dashboard/policy-status")
    public ResponseEntity<List<GovChartDataResponse>> getPolicyStatusDistribution() {
        return ResponseEntity.ok(governanceService.getPolicyStatusDistribution());
    }

    @GetMapping("/dashboard/risk-matrix")
    public ResponseEntity<List<GovChartDataResponse>> getRiskMatrix() {
        return ResponseEntity.ok(governanceService.getRiskMatrix());
    }

    @GetMapping("/dashboard/department-scores")
    public ResponseEntity<List<DepartmentGovernanceScoreResponse>> getDepartmentScores() {
        return ResponseEntity.ok(governanceService.getDepartmentScores());
    }

    // Policies
    @GetMapping("/policies")
    public ResponseEntity<List<Policy>> getAllPolicies() {
        return ResponseEntity.ok(governanceService.getAllPolicies());
    }

    @PostMapping("/policies")
    public ResponseEntity<Policy> createPolicy(@RequestBody Policy policy) {
        return ResponseEntity.ok(governanceService.createPolicy(policy));
    }

    @PutMapping("/policies/{id}")
    public ResponseEntity<Policy> updatePolicy(@PathVariable Long id, @RequestBody Policy policy) {
        return ResponseEntity.ok(governanceService.updatePolicy(id, policy));
    }

    @DeleteMapping("/policies/{id}")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        governanceService.deletePolicy(id);
        return ResponseEntity.ok().build();
    }

    // Acknowledgements
    @GetMapping("/acknowledgements")
    public ResponseEntity<List<PolicyAcknowledgement>> getAllAcknowledgements() {
        return ResponseEntity.ok(governanceService.getAllAcknowledgements());
    }

    @GetMapping("/acknowledgements/employee/{employeeId}")
    public ResponseEntity<List<PolicyAcknowledgement>> getEmployeeAcknowledgements(@PathVariable Long employeeId) {
        return ResponseEntity.ok(governanceService.getAcknowledgementsByEmployee(employeeId));
    }

    @PutMapping("/acknowledgements/{id}/acknowledge")
    public ResponseEntity<PolicyAcknowledgement> acknowledgePolicy(@PathVariable Long id) {
        return ResponseEntity.ok(governanceService.acknowledgePolicy(id));
    }

    // Audits
    @GetMapping("/audits")
    public ResponseEntity<List<Audit>> getAllAudits() {
        return ResponseEntity.ok(governanceService.getAllAudits());
    }

    @PostMapping("/audits")
    public ResponseEntity<Audit> createAudit(@RequestBody Audit audit) {
        return ResponseEntity.ok(governanceService.createAudit(audit));
    }

    @PutMapping("/audits/{id}")
    public ResponseEntity<Audit> updateAudit(@PathVariable Long id, @RequestBody Audit audit) {
        return ResponseEntity.ok(governanceService.updateAudit(id, audit));
    }

    @DeleteMapping("/audits/{id}")
    public ResponseEntity<Void> deleteAudit(@PathVariable Long id) {
        governanceService.deleteAudit(id);
        return ResponseEntity.ok().build();
    }

    // Compliance Issues
    @GetMapping("/issues")
    public ResponseEntity<List<ComplianceIssue>> getAllIssues() {
        return ResponseEntity.ok(governanceService.getAllIssues());
    }

    @PostMapping("/issues")
    public ResponseEntity<ComplianceIssue> createIssue(@RequestBody ComplianceIssue issue) {
        return ResponseEntity.ok(governanceService.createIssue(issue));
    }

    @PutMapping("/issues/{id}")
    public ResponseEntity<ComplianceIssue> updateIssue(@PathVariable Long id, @RequestBody ComplianceIssue issue) {
        return ResponseEntity.ok(governanceService.updateIssue(id, issue));
    }

    @DeleteMapping("/issues/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id) {
        governanceService.deleteIssue(id);
        return ResponseEntity.ok().build();
    }

    // Risks
    @GetMapping("/risks")
    public ResponseEntity<List<Risk>> getAllRisks() {
        return ResponseEntity.ok(governanceService.getAllRisks());
    }

    @PostMapping("/risks")
    public ResponseEntity<Risk> createRisk(@RequestBody Risk risk) {
        return ResponseEntity.ok(governanceService.createRisk(risk));
    }

    @PutMapping("/risks/{id}")
    public ResponseEntity<Risk> updateRisk(@PathVariable Long id, @RequestBody Risk risk) {
        return ResponseEntity.ok(governanceService.updateRisk(id, risk));
    }

    @DeleteMapping("/risks/{id}")
    public ResponseEntity<Void> deleteRisk(@PathVariable Long id) {
        governanceService.deleteRisk(id);
        return ResponseEntity.ok().build();
    }

    // Corrective Actions
    @GetMapping("/corrective-actions")
    public ResponseEntity<List<CorrectiveAction>> getAllCorrectiveActions() {
        return ResponseEntity.ok(governanceService.getAllCorrectiveActions());
    }

    @PostMapping("/corrective-actions")
    public ResponseEntity<CorrectiveAction> createCorrectiveAction(@RequestBody CorrectiveAction action) {
        return ResponseEntity.ok(governanceService.createCorrectiveAction(action));
    }
}
