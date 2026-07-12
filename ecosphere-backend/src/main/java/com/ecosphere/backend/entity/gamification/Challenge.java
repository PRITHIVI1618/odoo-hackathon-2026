package com.ecosphere.backend.entity.gamification;

import com.ecosphere.backend.entity.Department;
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
@Table(name = "challenges")
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category; // e.g., Environmental, Social, Governance

    private String targetType; // e.g., CSR_HOURS, TRAINING_COMPLETED, POLICY_ACK

    private Double targetValue;

    @Column(nullable = false)
    private Integer xpReward;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "badge_reward_id")
    private Badge badgeReward;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, EXPIRED

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
}
