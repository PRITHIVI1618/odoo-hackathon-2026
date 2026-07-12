package com.ecosphere.backend.controller;

import com.ecosphere.backend.dto.environmental.*;
import com.ecosphere.backend.entity.*;
import com.ecosphere.backend.service.EnvironmentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/environmental")
@RequiredArgsConstructor
public class EnvironmentalController {

    private final EnvironmentalService environmentalService;

    // --- EMISSION FACTORS ---
    @GetMapping("/factors")
    public ResponseEntity<List<EmissionFactor>> getEmissionFactors() {
        return ResponseEntity.ok(environmentalService.getAllEmissionFactors());
    }

    @PostMapping("/factors")
    public ResponseEntity<EmissionFactor> createEmissionFactor(@RequestBody EmissionFactor factor) {
        return ResponseEntity.ok(environmentalService.createEmissionFactor(factor));
    }

    @PutMapping("/factors/{id}")
    public ResponseEntity<EmissionFactor> updateEmissionFactor(@PathVariable Long id, @RequestBody EmissionFactor factor) {
        return ResponseEntity.ok(environmentalService.updateEmissionFactor(id, factor));
    }

    @DeleteMapping("/factors/{id}")
    public ResponseEntity<Void> deleteEmissionFactor(@PathVariable Long id) {
        environmentalService.deleteEmissionFactor(id);
        return ResponseEntity.noContent().build();
    }

    // --- CARBON TRANSACTIONS ---
    @GetMapping("/transactions")
    public ResponseEntity<List<CarbonTransaction>> getTransactions() {
        return ResponseEntity.ok(environmentalService.getAllTransactions());
    }

    @PostMapping("/transactions")
    public ResponseEntity<CarbonTransaction> createTransaction(@RequestBody CarbonTransaction transaction) {
        return ResponseEntity.ok(environmentalService.createTransaction(transaction));
    }

    @PutMapping("/transactions/{id}")
    public ResponseEntity<CarbonTransaction> updateTransaction(@PathVariable Long id, @RequestBody CarbonTransaction transaction) {
        return ResponseEntity.ok(environmentalService.updateTransaction(id, transaction));
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        environmentalService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }

    // --- ENVIRONMENTAL GOALS ---
    @GetMapping("/goals")
    public ResponseEntity<List<EnvironmentalGoal>> getGoals() {
        return ResponseEntity.ok(environmentalService.getAllGoals());
    }

    @PostMapping("/goals")
    public ResponseEntity<EnvironmentalGoal> createGoal(@RequestBody EnvironmentalGoal goal) {
        return ResponseEntity.ok(environmentalService.createGoal(goal));
    }

    @PutMapping("/goals/{id}")
    public ResponseEntity<EnvironmentalGoal> updateGoal(@PathVariable Long id, @RequestBody EnvironmentalGoal goal) {
        return ResponseEntity.ok(environmentalService.updateGoal(id, goal));
    }

    @DeleteMapping("/goals/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        environmentalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }

    // --- DASHBOARD ANALYTICS ---
    @GetMapping("/dashboard/kpis")
    public ResponseEntity<DashboardKpiResponse> getDashboardKpis() {
        return ResponseEntity.ok(environmentalService.getDashboardKpis());
    }

    @GetMapping("/dashboard/department-scores")
    public ResponseEntity<List<DepartmentScoreResponse>> getDepartmentScores() {
        return ResponseEntity.ok(environmentalService.getDepartmentScores());
    }

    @GetMapping("/dashboard/monthly-trend")
    public ResponseEntity<List<MonthlyTrendResponse>> getMonthlyTrend() {
        return ResponseEntity.ok(environmentalService.getMonthlyTrend());
    }

    @GetMapping("/dashboard/source-distribution")
    public ResponseEntity<List<SourceDistributionResponse>> getSourceDistribution() {
        return ResponseEntity.ok(environmentalService.getSourceDistribution());
    }
}
