package com.ecosphere.backend.entity.governance;

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
@Table(name = "gov_risks")
public class Risk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String riskCode;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category; // e.g., Operational, Financial, Strategic, Compliance

    @Column(nullable = false)
    private Integer likelihood; // 1 to 5

    @Column(nullable = false)
    private Integer impact; // 1 to 5

    @Column(nullable = false)
    private Integer riskScore; // likelihood * impact

    @Column(columnDefinition = "TEXT")
    private String mitigationPlan;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(nullable = false)
    private String status = "Open"; // Open, Mitigated, Closed

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    @PreUpdate
    public void calculateScoreAndUpdateTime() {
        if (likelihood != null && impact != null) {
            this.riskScore = this.likelihood * this.impact;
        } else {
            this.riskScore = 0;
        }
        updatedAt = LocalDateTime.now();
    }
}
