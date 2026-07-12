package com.ecosphere.backend.entity.governance;

import com.ecosphere.backend.entity.Department;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "gov_policies")
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String policyCode;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String version = "1.0"; // Policy versioning

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDate effectiveDate;

    private LocalDate reviewDate;

    @ManyToOne
    @JoinColumn(name = "owner_department_id")
    private Department ownerDepartment;

    @Column(nullable = false)
    private String status = "Draft"; // Draft, Under Review, Approved, Published, Archived

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
