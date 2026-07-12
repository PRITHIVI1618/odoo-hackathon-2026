package com.ecosphere.backend.repository.gamification;

import com.ecosphere.backend.entity.gamification.EmployeeBadge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeBadgeRepository extends JpaRepository<EmployeeBadge, Long> {
    List<EmployeeBadge> findByEmployeeId(Long employeeId);
    Optional<EmployeeBadge> findByEmployeeIdAndBadgeId(Long employeeId, Long badgeId);
}
