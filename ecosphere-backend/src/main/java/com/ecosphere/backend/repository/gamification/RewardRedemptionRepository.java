package com.ecosphere.backend.repository.gamification;

import com.ecosphere.backend.entity.gamification.RewardRedemption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RewardRedemptionRepository extends JpaRepository<RewardRedemption, Long> {
    List<RewardRedemption> findByEmployeeId(Long employeeId);
}
