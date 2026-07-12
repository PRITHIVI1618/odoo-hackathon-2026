package com.ecosphere.backend.repository.gamification;

import com.ecosphere.backend.entity.gamification.EmployeeChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeChallengeRepository extends JpaRepository<EmployeeChallenge, Long> {
    List<EmployeeChallenge> findByEmployeeId(Long employeeId);
    Optional<EmployeeChallenge> findByEmployeeIdAndChallengeId(Long employeeId, Long challengeId);
}
