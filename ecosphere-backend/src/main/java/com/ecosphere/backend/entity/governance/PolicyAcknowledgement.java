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
@Table(name = "gov_policy_acknowledgements")
public class PolicyAcknowledgement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    @ManyToOne(optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    private LocalDateTime acknowledgedAt;

    @Column(nullable = false)
    private String status = "Pending"; // Pending, Acknowledged

    @Column(columnDefinition = "TEXT")
    private String remarks;
}
