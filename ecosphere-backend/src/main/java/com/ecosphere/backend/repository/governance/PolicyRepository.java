package com.ecosphere.backend.repository.governance;

import com.ecosphere.backend.entity.governance.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {
    boolean existsByPolicyCode(String policyCode);
    List<Policy> findByStatus(String status);
    List<Policy> findByOwnerDepartmentId(Long departmentId);
}
