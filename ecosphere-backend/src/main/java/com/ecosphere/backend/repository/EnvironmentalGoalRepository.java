package com.ecosphere.backend.repository;

import com.ecosphere.backend.entity.EnvironmentalGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnvironmentalGoalRepository extends JpaRepository<EnvironmentalGoal, Long> {
    List<EnvironmentalGoal> findByDepartmentId(Long departmentId);
    List<EnvironmentalGoal> findByStatus(String status);
}
