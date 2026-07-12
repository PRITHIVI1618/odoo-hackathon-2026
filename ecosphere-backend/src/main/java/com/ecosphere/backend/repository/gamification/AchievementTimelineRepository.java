package com.ecosphere.backend.repository.gamification;

import com.ecosphere.backend.entity.gamification.AchievementTimeline;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AchievementTimelineRepository extends JpaRepository<AchievementTimeline, Long> {
    List<AchievementTimeline> findByEmployeeIdOrderByTimestampDesc(Long employeeId);
}
