package com.ecosphere.backend.entity.gamification;

import com.ecosphere.backend.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "achievement_timeline")
public class AchievementTimeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    @Column(nullable = false)
    private String actionType; // CHALLENGE_COMPLETED, BADGE_EARNED, CSR_ACTIVITY, TRAINING, POLICY, REWARD

    @Column(nullable = false)
    private String title;

    private Integer xpEarned = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}
