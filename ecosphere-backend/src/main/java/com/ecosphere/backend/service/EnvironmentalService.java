package com.ecosphere.backend.service;

import com.ecosphere.backend.dto.environmental.*;
import com.ecosphere.backend.entity.*;
import com.ecosphere.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnvironmentalService {

    private final EmissionFactorRepository emissionFactorRepository;
    private final CarbonTransactionRepository carbonTransactionRepository;
    private final EnvironmentalGoalRepository environmentalGoalRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    // --- EMISSION FACTORS ---
    public List<EmissionFactor> getAllEmissionFactors() {
        return emissionFactorRepository.findAll();
    }

    public EmissionFactor createEmissionFactor(EmissionFactor factor) {
        return emissionFactorRepository.save(factor);
    }

    public EmissionFactor updateEmissionFactor(Long id, EmissionFactor factorDetails) {
        EmissionFactor factor = emissionFactorRepository.findById(id).orElseThrow();
        factor.setName(factorDetails.getName());
        factor.setSource(factorDetails.getSource());
        factor.setCategory(factorDetails.getCategory());
        factor.setUnit(factorDetails.getUnit());
        factor.setEmissionFactor(factorDetails.getEmissionFactor());
        factor.setDescription(factorDetails.getDescription());
        factor.setStatus(factorDetails.getStatus());
        return emissionFactorRepository.save(factor);
    }

    public void deleteEmissionFactor(Long id) {
        emissionFactorRepository.deleteById(id);
    }

    // --- CARBON TRANSACTIONS ---
    public List<CarbonTransaction> getAllTransactions() {
        return carbonTransactionRepository.findAll();
    }

    public CarbonTransaction createTransaction(CarbonTransaction tx) {
        if (tx.getQuantity() < 0) throw new IllegalArgumentException("Quantity cannot be negative");
        if (tx.getDate().isAfter(LocalDate.now())) throw new IllegalArgumentException("Date cannot be in the future");
        
        EmissionFactor factor = emissionFactorRepository.findById(tx.getEmissionFactor().getId()).orElseThrow();
        tx.setEmissionFactor(factor);
        tx.setSource(factor.getSource());
        
        // Automatic Calculation
        tx.setCalculatedEmission(tx.getQuantity() * factor.getEmissionFactor());
        
        return carbonTransactionRepository.save(tx);
    }

    public CarbonTransaction updateTransaction(Long id, CarbonTransaction txDetails) {
        CarbonTransaction tx = carbonTransactionRepository.findById(id).orElseThrow();
        if (txDetails.getQuantity() < 0) throw new IllegalArgumentException("Quantity cannot be negative");
        
        EmissionFactor factor = emissionFactorRepository.findById(txDetails.getEmissionFactor().getId()).orElseThrow();
        tx.setEmissionFactor(factor);
        tx.setSource(factor.getSource());
        tx.setQuantity(txDetails.getQuantity());
        tx.setCalculatedEmission(txDetails.getQuantity() * factor.getEmissionFactor());
        tx.setDate(txDetails.getDate());
        tx.setNotes(txDetails.getNotes());
        
        if(txDetails.getDepartment() != null) {
            tx.setDepartment(departmentRepository.findById(txDetails.getDepartment().getId()).orElse(tx.getDepartment()));
        }
        if(txDetails.getEmployee() != null) {
            tx.setEmployee(userRepository.findById(txDetails.getEmployee().getId()).orElse(tx.getEmployee()));
        }
        
        return carbonTransactionRepository.save(tx);
    }

    public void deleteTransaction(Long id) {
        carbonTransactionRepository.deleteById(id);
    }

    // --- ENVIRONMENTAL GOALS ---
    public List<EnvironmentalGoal> getAllGoals() {
        return environmentalGoalRepository.findAll();
    }

    public EnvironmentalGoal createGoal(EnvironmentalGoal goal) {
        return environmentalGoalRepository.save(goal);
    }

    public EnvironmentalGoal updateGoal(Long id, EnvironmentalGoal goalDetails) {
        EnvironmentalGoal goal = environmentalGoalRepository.findById(id).orElseThrow();
        goal.setTitle(goalDetails.getTitle());
        goal.setTargetReduction(goalDetails.getTargetReduction());
        goal.setCurrentReduction(goalDetails.getCurrentReduction());
        goal.setStartDate(goalDetails.getStartDate());
        goal.setEndDate(goalDetails.getEndDate());
        goal.setStatus(goalDetails.getStatus());
        if(goalDetails.getDepartment() != null && goalDetails.getDepartment().getId() != null) {
             goal.setDepartment(departmentRepository.findById(goalDetails.getDepartment().getId()).orElse(null));
        } else {
             goal.setDepartment(null);
        }
        return environmentalGoalRepository.save(goal);
    }

    public void deleteGoal(Long id) {
        environmentalGoalRepository.deleteById(id);
    }

    // --- DASHBOARD ANALYTICS ---

    public DashboardKpiResponse getDashboardKpis() {
        List<CarbonTransaction> transactions = carbonTransactionRepository.findAll();
        List<EnvironmentalGoal> goals = environmentalGoalRepository.findAll();

        double total = transactions.stream().mapToDouble(CarbonTransaction::getCalculatedEmission).sum();
        
        LocalDate today = LocalDate.now();
        double todays = transactions.stream()
                .filter(t -> t.getDate().isEqual(today))
                .mapToDouble(CarbonTransaction::getCalculatedEmission).sum();
                
        double monthly = transactions.stream()
                .filter(t -> t.getDate().getMonth() == today.getMonth() && t.getDate().getYear() == today.getYear())
                .mapToDouble(CarbonTransaction::getCalculatedEmission).sum();
                
        double avg = transactions.isEmpty() ? 0.0 : total / transactions.size();
        
        int activeGoals = (int) goals.stream().filter(g -> "ACTIVE".equals(g.getStatus())).count();
        int completedGoals = (int) goals.stream().filter(g -> "ACHIEVED".equals(g.getStatus())).count();

        return new DashboardKpiResponse(total, todays, monthly, avg, activeGoals, completedGoals);
    }

    public List<DepartmentScoreResponse> getDepartmentScores() {
        List<Department> departments = departmentRepository.findAll();
        List<CarbonTransaction> transactions = carbonTransactionRepository.findAll();
        
        List<DepartmentScoreResponse> scores = new ArrayList<>();
        
        for (Department dept : departments) {
            double totalEmissions = transactions.stream()
                .filter(t -> t.getDepartment().getId().equals(dept.getId()))
                .mapToDouble(CarbonTransaction::getCalculatedEmission).sum();
                
            // Simple normalization: 100 - (Total Emissions / 50). Cap between 0 and 100.
            double score = Math.max(0.0, Math.min(100.0, 100.0 - (totalEmissions / 50.0)));
            // Round to 1 decimal place
            score = Math.round(score * 10.0) / 10.0;
            
            scores.add(new DepartmentScoreResponse(dept.getId(), dept.getName(), score, totalEmissions));
        }
        
        scores.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        return scores;
    }

    public List<MonthlyTrendResponse> getMonthlyTrend() {
        List<CarbonTransaction> transactions = carbonTransactionRepository.findAll();
        
        Map<String, Double> monthlyTotals = new LinkedHashMap<>();
        
        // Initialize last 6 months for clean charts
        for (int i = 5; i >= 0; i--) {
            LocalDate d = LocalDate.now().minusMonths(i);
            monthlyTotals.put(d.format(DateTimeFormatter.ofPattern("MMM")), 0.0);
        }
        
        for (CarbonTransaction tx : transactions) {
            if (tx.getDate().isAfter(LocalDate.now().minusMonths(6))) {
                String month = tx.getDate().format(DateTimeFormatter.ofPattern("MMM"));
                if (monthlyTotals.containsKey(month)) {
                    monthlyTotals.put(month, monthlyTotals.get(month) + tx.getCalculatedEmission());
                }
            }
        }
        
        List<MonthlyTrendResponse> result = new ArrayList<>();
        monthlyTotals.forEach((month, emission) -> result.add(new MonthlyTrendResponse(month, emission)));
        return result;
    }

    public List<SourceDistributionResponse> getSourceDistribution() {
        List<CarbonTransaction> transactions = carbonTransactionRepository.findAll();
        Map<String, Double> sourceTotals = new HashMap<>();
        
        for (CarbonTransaction tx : transactions) {
            sourceTotals.merge(tx.getSource(), tx.getCalculatedEmission(), Double::sum);
        }
        
        List<SourceDistributionResponse> result = new ArrayList<>();
        sourceTotals.forEach((source, val) -> result.add(new SourceDistributionResponse(source, val)));
        return result;
    }
}
