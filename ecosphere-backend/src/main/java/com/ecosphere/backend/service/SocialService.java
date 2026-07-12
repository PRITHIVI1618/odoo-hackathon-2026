package com.ecosphere.backend.service;

import com.ecosphere.backend.dto.social.ChartDataResponse;
import com.ecosphere.backend.dto.social.DepartmentSocialScoreResponse;
import com.ecosphere.backend.dto.social.SocialDashboardKpiResponse;
import com.ecosphere.backend.entity.*;
import com.ecosphere.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class SocialService {

    private final CSRActivityRepository csrRepository;
    private final EmployeeParticipationRepository participationRepository;
    private final TrainingProgramRepository trainingRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    // --- CSR Activities CRUD ---
    public List<CSRActivity> getAllCsrActivities() {
        return csrRepository.findAll();
    }

    public CSRActivity createCsrActivity(CSRActivity activity) {
        return csrRepository.save(activity);
    }

    public CSRActivity updateCsrActivity(Long id, CSRActivity data) {
        CSRActivity activity = csrRepository.findById(id).orElseThrow(() -> new RuntimeException("CSR Activity not found"));
        activity.setTitle(data.getTitle());
        activity.setDescription(data.getDescription());
        activity.setCategory(data.getCategory());
        activity.setDepartment(data.getDepartment());
        activity.setLocation(data.getLocation());
        activity.setStartDate(data.getStartDate());
        activity.setEndDate(data.getEndDate());
        activity.setMaxParticipants(data.getMaxParticipants());
        activity.setStatus(data.getStatus());
        return csrRepository.save(activity);
    }

    public void deleteCsrActivity(Long id) {
        csrRepository.deleteById(id);
    }

    // --- Employee Participation CRUD ---
    public List<EmployeeParticipation> getAllParticipations() {
        return participationRepository.findAll();
    }

    public EmployeeParticipation createParticipation(EmployeeParticipation participation) {
        return participationRepository.save(participation);
    }

    public EmployeeParticipation updateParticipation(Long id, EmployeeParticipation data) {
        EmployeeParticipation participation = participationRepository.findById(id).orElseThrow(() -> new RuntimeException("Participation not found"));
        participation.setEmployee(data.getEmployee());
        participation.setCsrActivity(data.getCsrActivity());
        participation.setParticipationDate(data.getParticipationDate());
        participation.setHoursContributed(data.getHoursContributed());
        participation.setApprovalStatus(data.getApprovalStatus());
        participation.setRemarks(data.getRemarks());
        return participationRepository.save(participation);
    }

    public void deleteParticipation(Long id) {
        participationRepository.deleteById(id);
    }

    // --- Training Programs CRUD ---
    public List<TrainingProgram> getAllTrainingPrograms() {
        return trainingRepository.findAll();
    }

    public TrainingProgram createTrainingProgram(TrainingProgram program) {
        return trainingRepository.save(program);
    }

    public TrainingProgram updateTrainingProgram(Long id, TrainingProgram data) {
        TrainingProgram program = trainingRepository.findById(id).orElseThrow(() -> new RuntimeException("Training not found"));
        program.setTitle(data.getTitle());
        program.setDescription(data.getDescription());
        program.setDepartment(data.getDepartment());
        program.setTrainer(data.getTrainer());
        program.setStartDate(data.getStartDate());
        program.setEndDate(data.getEndDate());
        program.setCompletionPercentage(data.getCompletionPercentage());
        program.setStatus(data.getStatus());
        return trainingRepository.save(program);
    }

    public void deleteTrainingProgram(Long id) {
        trainingRepository.deleteById(id);
    }

    // --- Dashboard Analytics ---
    
    public SocialDashboardKpiResponse getKpis() {
        long totalActivities = csrRepository.count();
        List<EmployeeParticipation> participations = participationRepository.findAll();
        
        long activeParticipants = participations.stream().map(p -> p.getEmployee().getId()).distinct().count();
        double totalHours = participations.stream().filter(p -> "APPROVED".equals(p.getApprovalStatus())).mapToDouble(EmployeeParticipation::getHoursContributed).sum();
        
        List<TrainingProgram> programs = trainingRepository.findAll();
        long totalPrograms = programs.size();
        double avgCompletion = programs.stream().mapToDouble(TrainingProgram::getCompletionPercentage).average().orElse(0.0);

        List<DepartmentSocialScoreResponse> deptScores = getDepartmentScores();
        double overallScore = deptScores.stream().mapToDouble(DepartmentSocialScoreResponse::getScore).average().orElse(0.0);

        long totalUsers = userRepository.count();
        double avgDeptParticipation = totalUsers > 0 ? ((double) activeParticipants / totalUsers) * 100 : 0.0;

        return new SocialDashboardKpiResponse(
                totalActivities, activeParticipants, totalHours, totalPrograms, avgCompletion, overallScore, avgDeptParticipation
        );
    }

    public List<DepartmentSocialScoreResponse> getDepartmentScores() {
        List<Department> departments = departmentRepository.findAll();
        List<EmployeeParticipation> approvedParticipations = participationRepository.findByApprovalStatus("APPROVED");
        List<TrainingProgram> programs = trainingRepository.findAll();
        
        List<DepartmentSocialScoreResponse> results = new ArrayList<>();

        for (Department dept : departments) {
            double participationScore = approvedParticipations.stream()
                .filter(p -> p.getEmployee().getDepartment() != null && p.getEmployee().getDepartment().getId().equals(dept.getId()))
                .mapToDouble(EmployeeParticipation::getHoursContributed)
                .sum();
            
            double trainingScore = programs.stream()
                .filter(p -> p.getDepartment() != null && p.getDepartment().getId().equals(dept.getId()))
                .mapToDouble(TrainingProgram::getCompletionPercentage)
                .average().orElse(0.0);
            
            // Normalize to a max of 100 (Simplified calculation for demonstration)
            double rawScore = (participationScore * 2) + trainingScore;
            double normalizedScore = Math.min(100.0, rawScore);
            
            results.add(new DepartmentSocialScoreResponse(dept.getId(), dept.getName(), Math.round(normalizedScore * 10.0) / 10.0));
        }

        // Sort descending
        results.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        return results;
    }

    public List<ChartDataResponse> getGenderDistribution() {
        List<User> users = userRepository.findAll();
        long male = users.stream().filter(u -> "Male".equalsIgnoreCase(u.getGender())).count();
        long female = users.stream().filter(u -> "Female".equalsIgnoreCase(u.getGender())).count();
        long other = users.stream().filter(u -> "Other".equalsIgnoreCase(u.getGender()) || u.getGender() == null).count();
        
        return List.of(
            new ChartDataResponse("Male", (double) male),
            new ChartDataResponse("Female", (double) female),
            new ChartDataResponse("Other", (double) other)
        );
    }

    public List<ChartDataResponse> getCsrTrend() {
        List<CSRActivity> activities = csrRepository.findAll();
        Map<String, Long> trend = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        
        for (CSRActivity activity : activities) {
            String month = activity.getStartDate().format(formatter);
            trend.put(month, trend.getOrDefault(month, 0L) + 1);
        }
        
        return trend.entrySet().stream()
                .map(e -> new ChartDataResponse(e.getKey(), e.getValue().doubleValue()))
                .collect(Collectors.toList()); // Note: should ideally sort by date
    }
}
