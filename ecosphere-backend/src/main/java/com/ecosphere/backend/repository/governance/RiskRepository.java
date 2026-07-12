package com.ecosphere.backend.repository.governance;

import com.ecosphere.backend.entity.governance.Risk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiskRepository extends JpaRepository<Risk, Long> {
    boolean existsByRiskCode(String riskCode);
    List<Risk> findByStatus(String status);
}
