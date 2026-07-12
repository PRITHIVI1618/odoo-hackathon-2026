package com.ecosphere.backend.repository;

import com.ecosphere.backend.entity.EmployeeParticipation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeParticipationRepository extends JpaRepository<EmployeeParticipation, Long> {
    List<EmployeeParticipation> findByEmployeeId(Long employeeId);
    List<EmployeeParticipation> findByCsrActivityId(Long csrActivityId);
    List<EmployeeParticipation> findByApprovalStatus(String status);
}
