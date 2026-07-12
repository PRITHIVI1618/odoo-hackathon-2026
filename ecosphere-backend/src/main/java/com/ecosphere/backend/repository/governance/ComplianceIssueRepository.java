package com.ecosphere.backend.repository.governance;

import com.ecosphere.backend.entity.governance.ComplianceIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplianceIssueRepository extends JpaRepository<ComplianceIssue, Long> {
    List<ComplianceIssue> findByDepartmentId(Long departmentId);
    List<ComplianceIssue> findByAuditId(Long auditId);
    List<ComplianceIssue> findByStatus(String status);
}
