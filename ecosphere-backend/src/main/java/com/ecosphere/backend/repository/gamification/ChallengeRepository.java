package com.ecosphere.backend.repository.gamification;

import com.ecosphere.backend.entity.gamification.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    List<Challenge> findByStatus(String status);
}
