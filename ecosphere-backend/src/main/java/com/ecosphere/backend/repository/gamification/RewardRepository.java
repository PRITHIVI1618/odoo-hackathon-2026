package com.ecosphere.backend.repository.gamification;

import com.ecosphere.backend.entity.gamification.Reward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RewardRepository extends JpaRepository<Reward, Long> {
    List<Reward> findByStatus(String status);
}
