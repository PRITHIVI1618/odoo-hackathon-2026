package com.ecosphere.backend.controller;

import com.ecosphere.backend.dto.social.ChartDataResponse;
import com.ecosphere.backend.dto.social.DepartmentSocialScoreResponse;
import com.ecosphere.backend.dto.social.SocialDashboardKpiResponse;
import com.ecosphere.backend.entity.CSRActivity;
import com.ecosphere.backend.entity.EmployeeParticipation;
import com.ecosphere.backend.entity.TrainingProgram;
import com.ecosphere.backend.service.SocialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
public class SocialController {

    private final SocialService socialService;

    // --- CSR Activities ---
    @GetMapping("/csr")
    public ResponseEntity<List<CSRActivity>> getAllCsrActivities() {
        return ResponseEntity.ok(socialService.getAllCsrActivities());
    }

    @PostMapping("/csr")
    public ResponseEntity<CSRActivity> createCsrActivity(@RequestBody CSRActivity activity) {
        return ResponseEntity.ok(socialService.createCsrActivity(activity));
    }

    @PutMapping("/csr/{id}")
    public ResponseEntity<CSRActivity> updateCsrActivity(@PathVariable Long id, @RequestBody CSRActivity activity) {
        return ResponseEntity.ok(socialService.updateCsrActivity(id, activity));
    }

    @DeleteMapping("/csr/{id}")
    public ResponseEntity<Void> deleteCsrActivity(@PathVariable Long id) {
        socialService.deleteCsrActivity(id);
        return ResponseEntity.noContent().build();
    }

    // --- Employee Participation ---
    @GetMapping("/participations")
    public ResponseEntity<List<EmployeeParticipation>> getAllParticipations() {
        return ResponseEntity.ok(socialService.getAllParticipations());
    }

    @PostMapping("/participations")
    public ResponseEntity<EmployeeParticipation> createParticipation(@RequestBody EmployeeParticipation participation) {
        return ResponseEntity.ok(socialService.createParticipation(participation));
    }

    @PutMapping("/participations/{id}")
    public ResponseEntity<EmployeeParticipation> updateParticipation(@PathVariable Long id, @RequestBody EmployeeParticipation participation) {
        return ResponseEntity.ok(socialService.updateParticipation(id, participation));
    }

    @DeleteMapping("/participations/{id}")
    public ResponseEntity<Void> deleteParticipation(@PathVariable Long id) {
        socialService.deleteParticipation(id);
        return ResponseEntity.noContent().build();
    }

    // --- Training Programs ---
    @GetMapping("/training")
    public ResponseEntity<List<TrainingProgram>> getAllTrainingPrograms() {
        return ResponseEntity.ok(socialService.getAllTrainingPrograms());
    }

    @PostMapping("/training")
    public ResponseEntity<TrainingProgram> createTrainingProgram(@RequestBody TrainingProgram program) {
        return ResponseEntity.ok(socialService.createTrainingProgram(program));
    }

    @PutMapping("/training/{id}")
    public ResponseEntity<TrainingProgram> updateTrainingProgram(@PathVariable Long id, @RequestBody TrainingProgram program) {
        return ResponseEntity.ok(socialService.updateTrainingProgram(id, program));
    }

    @DeleteMapping("/training/{id}")
    public ResponseEntity<Void> deleteTrainingProgram(@PathVariable Long id) {
        socialService.deleteTrainingProgram(id);
        return ResponseEntity.noContent().build();
    }

    // --- Dashboard Analytics ---
    @GetMapping("/dashboard/kpis")
    public ResponseEntity<SocialDashboardKpiResponse> getKpis() {
        return ResponseEntity.ok(socialService.getKpis());
    }

    @GetMapping("/dashboard/department-scores")
    public ResponseEntity<List<DepartmentSocialScoreResponse>> getDepartmentScores() {
        return ResponseEntity.ok(socialService.getDepartmentScores());
    }

    @GetMapping("/dashboard/gender-distribution")
    public ResponseEntity<List<ChartDataResponse>> getGenderDistribution() {
        return ResponseEntity.ok(socialService.getGenderDistribution());
    }

    @GetMapping("/dashboard/csr-trend")
    public ResponseEntity<List<ChartDataResponse>> getCsrTrend() {
        return ResponseEntity.ok(socialService.getCsrTrend());
    }
}
