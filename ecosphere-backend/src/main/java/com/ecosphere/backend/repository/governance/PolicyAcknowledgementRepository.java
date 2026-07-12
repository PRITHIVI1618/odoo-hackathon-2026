package com.ecosphere.backend.repository.governance;

import com.ecosphere.backend.entity.governance.PolicyAcknowledgement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PolicyAcknowledgementRepository extends JpaRepository<PolicyAcknowledgement, Long> {
    List<PolicyAcknowledgement> findByEmployeeId(Long employeeId);
    List<PolicyAcknowledgement> findByPolicyId(Long policyId);
    Optional<PolicyAcknowledgement> findByPolicyIdAndEmployeeId(Long policyId, Long employeeId);
}
