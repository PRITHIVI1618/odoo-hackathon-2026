package com.ecosphere.backend.repository.governance;

import com.ecosphere.backend.entity.governance.CorrectiveAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CorrectiveActionRepository extends JpaRepository<CorrectiveAction, Long> {
    List<CorrectiveAction> findByIssueId(Long issueId);
}
