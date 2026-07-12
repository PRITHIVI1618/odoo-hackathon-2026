package com.ecosphere.backend;

import com.ecosphere.backend.entity.*;
import com.ecosphere.backend.entity.governance.*;
import com.ecosphere.backend.entity.gamification.*;
import com.ecosphere.backend.repository.*;
import com.ecosphere.backend.repository.governance.*;
import com.ecosphere.backend.repository.gamification.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CSRActivityRepository csrRepository;
    private final TrainingProgramRepository trainingRepository;
    private final EmployeeParticipationRepository participationRepository;

    private final PolicyRepository policyRepository;
    private final PolicyAcknowledgementRepository policyAckRepository;
    private final AuditRepository auditRepository;
    private final ComplianceIssueRepository complianceIssueRepository;
    private final RiskRepository riskRepository;
    private final CorrectiveActionRepository correctiveActionRepository;

    private final ChallengeRepository challengeRepository;
    private final EmployeeChallengeRepository employeeChallengeRepository;
    private final BadgeRepository badgeRepository;
    private final EmployeeBadgeRepository employeeBadgeRepository;
    private final RewardRepository rewardRepository;
    private final RewardRedemptionRepository rewardRedemptionRepository;
    private final AchievementTimelineRepository timelineRepository;

    @Override
    public void run(String... args) throws Exception {
        seedRoles();
        seedDepartments();
        seedUsers();
        seedSocialData();
        seedGovernanceData();
        seedGamificationData();
    }

    private void seedRoles() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(null, "Super Admin", "Has full system access"));
            roleRepository.save(new Role(null, "ESG Manager", "Manages ESG reports and dashboards"));
            roleRepository.save(new Role(null, "Department Head", "Manages a specific department"));
            roleRepository.save(new Role(null, "Employee", "Standard employee access"));
        }
    }

    private void seedDepartments() {
        if (departmentRepository.count() == 0) {
            departmentRepository.save(new Department(null, "Human Resources", "HR", "Manages employees", null, 10, "ACTIVE"));
            departmentRepository.save(new Department(null, "Information Technology", "IT", "Manages tech infrastructure", null, 25, "ACTIVE"));
            departmentRepository.save(new Department(null, "Finance", "FIN", "Manages budgets and expenses", null, 15, "ACTIVE"));
            departmentRepository.save(new Department(null, "Operations", "OPS", "Manages day-to-day operations", null, 50, "ACTIVE"));
            departmentRepository.save(new Department(null, "Marketing", "MKT", "Manages marketing campaigns", null, 20, "ACTIVE"));
        }
    }

    private void seedUsers() {
        Role adminRole = roleRepository.findByName("Super Admin").orElseThrow();
        Role esgRole = roleRepository.findByName("ESG Manager").orElseThrow();
        Role dhRole = roleRepository.findByName("Department Head").orElseThrow();
        Role empRole = roleRepository.findByName("Employee").orElseThrow();

        Department itDept = departmentRepository.findByCode("IT").orElseThrow();
        Department hrDept = departmentRepository.findByCode("HR").orElseThrow();
        Department opsDept = departmentRepository.findByCode("OPS").orElseThrow();

        // Admin
        if (userRepository.findByEmail("admin@ecosphere.com").isEmpty()) {
            User admin = new User();
            admin.setFirstName("Alex");
            admin.setLastName("Smith");
            admin.setEmail("admin@ecosphere.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(adminRole);
            admin.setDepartment(itDept);
            admin.setEmployeeId("EMP-0001");
            admin.setGender("Male");
            userRepository.save(admin);
        }

        // ESG Manager
        if (userRepository.findByEmail("esg@ecosphere.com").isEmpty()) {
            User esg = new User();
            esg.setFirstName("Sarah");
            esg.setLastName("Connor");
            esg.setEmail("esg@ecosphere.com");
            esg.setPassword(passwordEncoder.encode("esg123"));
            esg.setRole(esgRole);
            esg.setDepartment(hrDept);
            esg.setEmployeeId("EMP-0002");
            esg.setGender("Female");
            userRepository.save(esg);
        }

        // Department Head
        if (userRepository.findByEmail("head@ecosphere.com").isEmpty()) {
            User dh = new User();
            dh.setFirstName("David");
            dh.setLastName("Tech");
            dh.setEmail("head@ecosphere.com");
            dh.setPassword(passwordEncoder.encode("head123"));
            dh.setRole(dhRole);
            dh.setDepartment(itDept);
            dh.setEmployeeId("EMP-0003");
            dh.setGender("Male");
            userRepository.save(dh);
        }

        // Employee 1
        if (userRepository.findByEmail("employee@ecosphere.com").isEmpty()) {
            User emp1 = new User();
            emp1.setFirstName("John");
            emp1.setLastName("Doe");
            emp1.setEmail("employee@ecosphere.com");
            emp1.setPassword(passwordEncoder.encode("emp123"));
            emp1.setRole(empRole);
            emp1.setDepartment(itDept);
            emp1.setEmployeeId("EMP-0004");
            emp1.setGender("Male");
            userRepository.save(emp1);
        }

        // Employee 2
        if (userRepository.findByEmail("emily@ecosphere.com").isEmpty()) {
            User emp2 = new User();
            emp2.setFirstName("Emily");
            emp2.setLastName("Davis");
            emp2.setEmail("emily@ecosphere.com");
            emp2.setPassword(passwordEncoder.encode("emp123"));
            emp2.setRole(empRole);
            emp2.setDepartment(opsDept);
            emp2.setEmployeeId("EMP-0005");
            emp2.setGender("Female");
            userRepository.save(emp2);
        }

        // Employee 3
        if (userRepository.findByEmail("taylor@ecosphere.com").isEmpty()) {
            User emp3 = new User();
            emp3.setFirstName("Taylor");
            emp3.setLastName("Morgan");
            emp3.setEmail("taylor@ecosphere.com");
            emp3.setPassword(passwordEncoder.encode("emp123"));
            emp3.setRole(empRole);
            emp3.setDepartment(hrDept);
            emp3.setEmployeeId("EMP-0006");
            emp3.setGender("Other");
            userRepository.save(emp3);
        }
    }

    private void seedSocialData() {
        if (csrRepository.count() == 0) {
            Department hrDept = departmentRepository.findByCode("HR").orElseThrow();
            Department itDept = departmentRepository.findByCode("IT").orElseThrow();
            
            User esg = userRepository.findByEmail("esg@ecosphere.com").orElseThrow();
            User emp1 = userRepository.findByEmail("employee@ecosphere.com").orElseThrow();
            User emp2 = userRepository.findByEmail("emily@ecosphere.com").orElseThrow();
            User emp3 = userRepository.findByEmail("taylor@ecosphere.com").orElseThrow();

            // 1. CSR Activities
            CSRActivity tree = new CSRActivity();
            tree.setTitle("Annual Tree Plantation");
            tree.setDescription("Planting 500 saplings in the city outskirts.");
            tree.setCategory("Environment");
            tree.setDepartment(hrDept);
            tree.setLocation("City Park");
            tree.setStartDate(LocalDate.now().minusDays(10));
            tree.setEndDate(LocalDate.now().minusDays(9));
            tree.setMaxParticipants(50);
            tree.setStatus("Completed");
            csrRepository.save(tree);

            CSRActivity beach = new CSRActivity();
            beach.setTitle("Beach Cleanup Drive");
            beach.setDescription("Clearing plastics from the central beach.");
            beach.setCategory("Environment");
            beach.setDepartment(null); // Org wide
            beach.setLocation("Central Beach");
            beach.setStartDate(LocalDate.now().plusDays(5));
            beach.setEndDate(LocalDate.now().plusDays(6));
            beach.setMaxParticipants(100);
            beach.setStatus("Active");
            csrRepository.save(beach);

            // 2. Employee Participations
            EmployeeParticipation p1 = new EmployeeParticipation();
            p1.setEmployee(emp1);
            p1.setCsrActivity(tree);
            p1.setParticipationDate(tree.getStartDate());
            p1.setHoursContributed(8.0);
            p1.setApprovalStatus("APPROVED");
            p1.setRemarks("Great effort!");
            participationRepository.save(p1);

            EmployeeParticipation p2 = new EmployeeParticipation();
            p2.setEmployee(emp2);
            p2.setCsrActivity(tree);
            p2.setParticipationDate(tree.getStartDate());
            p2.setHoursContributed(8.0);
            p2.setApprovalStatus("APPROVED");
            participationRepository.save(p2);

            EmployeeParticipation p3 = new EmployeeParticipation();
            p3.setEmployee(emp3);
            p3.setCsrActivity(beach);
            p3.setParticipationDate(LocalDate.now());
            p3.setHoursContributed(4.0);
            p3.setApprovalStatus("PENDING");
            participationRepository.save(p3);

            // 3. Training Programs
            TrainingProgram t1 = new TrainingProgram();
            t1.setTitle("Diversity & Inclusion Workshop");
            t1.setDescription("Mandatory D&I training for all employees.");
            t1.setDepartment(hrDept);
            t1.setTrainer(esg); // User relation
            t1.setStartDate(LocalDate.now().minusDays(30));
            t1.setEndDate(LocalDate.now().minusDays(29));
            t1.setCompletionPercentage(85.5);
            t1.setStatus("Completed");
            trainingRepository.save(t1);

            TrainingProgram t2 = new TrainingProgram();
            t2.setTitle("Sustainable Coding Practices");
            t2.setDescription("Training IT staff on energy-efficient software design.");
            t2.setDepartment(itDept);
            t2.setTrainer(esg); // User relation
            t2.setStartDate(LocalDate.now().minusDays(5));
            t2.setEndDate(LocalDate.now().plusDays(5));
            t2.setCompletionPercentage(40.0);
            t2.setStatus("In Progress");
            trainingRepository.save(t2);
        }
    }

    private void seedGovernanceData() {
        if (policyRepository.count() == 0) {
            Department hrDept = departmentRepository.findByCode("HR").orElseThrow();
            Department itDept = departmentRepository.findByCode("IT").orElseThrow();
            User esg = userRepository.findByEmail("esg@ecosphere.com").orElseThrow();
            User emp1 = userRepository.findByEmail("employee@ecosphere.com").orElseThrow();

            // Policies
            Policy p1 = new Policy();
            p1.setTitle("Code of Conduct");
            p1.setPolicyCode("POL-001");
            p1.setCategory("Compliance");
            p1.setVersion("2.1");
            p1.setDescription("Standard employee code of conduct and ethics.");
            p1.setEffectiveDate(LocalDate.now().minusYears(1));
            p1.setReviewDate(LocalDate.now().plusMonths(2));
            p1.setOwnerDepartment(hrDept);
            p1.setStatus("Published");
            policyRepository.save(p1);

            Policy p2 = new Policy();
            p2.setTitle("Information Security");
            p2.setPolicyCode("POL-002");
            p2.setCategory("Security");
            p2.setVersion("1.0");
            p2.setDescription("Data protection and IT security guidelines.");
            p2.setEffectiveDate(LocalDate.now().minusMonths(6));
            p2.setReviewDate(LocalDate.now().plusMonths(6));
            p2.setOwnerDepartment(itDept);
            p2.setStatus("Published");
            policyRepository.save(p2);

            Policy p3 = new Policy();
            p3.setTitle("Environmental Policy");
            p3.setPolicyCode("POL-003");
            p3.setCategory("ESG");
            p3.setVersion("1.0");
            p3.setDescription("Sustainability goals and green office rules.");
            p3.setEffectiveDate(LocalDate.now().minusDays(10));
            p3.setReviewDate(LocalDate.now().plusYears(1));
            p3.setOwnerDepartment(hrDept);
            p3.setStatus("Under Review");
            policyRepository.save(p3);

            // Acknowledgements
            PolicyAcknowledgement ack1 = new PolicyAcknowledgement();
            ack1.setPolicy(p1);
            ack1.setEmployee(emp1);
            ack1.setStatus("Acknowledged");
            ack1.setAcknowledgedAt(LocalDateTime.now().minusDays(5));
            policyAckRepository.save(ack1);

            PolicyAcknowledgement ack2 = new PolicyAcknowledgement();
            ack2.setPolicy(p2);
            ack2.setEmployee(emp1);
            ack2.setStatus("Pending");
            policyAckRepository.save(ack2);

            // Audits
            Audit a1 = new Audit();
            a1.setAuditName("Internal ESG Audit");
            a1.setDepartment(hrDept);
            a1.setAuditor(esg);
            a1.setScheduledDate(LocalDate.now().minusMonths(1));
            a1.setCompletedDate(LocalDate.now().minusDays(15));
            a1.setScope("Review ESG metrics for Q1");
            a1.setStatus("Completed");
            a1.setSummary("Overall good performance, few missing trainings.");
            auditRepository.save(a1);

            Audit a2 = new Audit();
            a2.setAuditName("Security Audit");
            a2.setDepartment(itDept);
            a2.setAuditor(esg);
            a2.setScheduledDate(LocalDate.now().plusDays(10));
            a2.setScope("Check access logs and compliance");
            a2.setStatus("Planned");
            auditRepository.save(a2);

            // Issues
            ComplianceIssue issue1 = new ComplianceIssue();
            issue1.setAudit(a1);
            issue1.setDepartment(hrDept);
            issue1.setTitle("Missing Training");
            issue1.setDescription("5 employees have not completed diversity training.");
            issue1.setSeverity("Medium");
            issue1.setOwner(esg);
            issue1.setDueDate(LocalDate.now().plusDays(5));
            issue1.setStatus("Open");
            complianceIssueRepository.save(issue1);

            ComplianceIssue issue2 = new ComplianceIssue();
            issue2.setAudit(a1);
            issue2.setDepartment(hrDept);
            issue2.setTitle("Late Policy Acknowledgement");
            issue2.setDescription("InfoSec policy not acknowledged by IT team.");
            issue2.setSeverity("High");
            issue2.setOwner(esg);
            issue2.setDueDate(LocalDate.now().minusDays(2));
            issue2.setStatus("Investigating");
            complianceIssueRepository.save(issue2);

            // Risks
            Risk r1 = new Risk();
            r1.setRiskCode("RSK-001");
            r1.setTitle("Cyber Security Breach");
            r1.setCategory("Security");
            r1.setLikelihood(2);
            r1.setImpact(5);
            r1.setMitigationPlan("Upgrade firewalls and enforce MFA.");
            r1.setOwner(esg);
            r1.setStatus("Open");
            riskRepository.save(r1);

            Risk r2 = new Risk();
            r2.setRiskCode("RSK-002");
            r2.setTitle("Supplier Compliance Failure");
            r2.setCategory("Operational");
            r2.setLikelihood(3);
            r2.setImpact(4);
            r2.setMitigationPlan("Monthly audits of tier 1 suppliers.");
            r2.setOwner(esg);
            r2.setStatus("Mitigated");
            riskRepository.save(r2);

            // Corrective Actions
            CorrectiveAction ca1 = new CorrectiveAction();
            ca1.setIssue(issue1);
            ca1.setActionDescription("Send reminders to employees for training.");
            ca1.setAssignedTo(esg);
            ca1.setTargetDate(LocalDate.now().plusDays(2));
            ca1.setStatus("In Progress");
            correctiveActionRepository.save(ca1);
        }
    }

    private void seedGamificationData() {
        if (challengeRepository.count() == 0) {
            User emp1 = userRepository.findByEmail("employee@ecosphere.com").orElseThrow();
            User admin = userRepository.findByEmail("admin@ecosphere.com").orElseThrow();
            Department itDept = departmentRepository.findByCode("IT").orElseThrow();

            // Seed Badges
            Badge b1 = new Badge(null, "Green Champion", "Leaf", "Awarded for completing 5 environmental challenges.", "Complete 5 Env Challenges", "Environmental", LocalDateTime.now());
            Badge b2 = new Badge(null, "CSR Hero", "Heart", "Awarded for 20 hours of volunteering.", "20 Volunteer Hours", "Social", LocalDateTime.now());
            Badge b3 = new Badge(null, "Policy Pro", "Shield", "Awarded for acknowledging all policies on time.", "Acknowledge 5 Policies", "Governance", LocalDateTime.now());
            badgeRepository.save(b1);
            badgeRepository.save(b2);
            badgeRepository.save(b3);

            // Seed Rewards
            Reward r1 = new Reward(null, "Coffee Voucher", "Free coffee at the cafeteria.", 500, 100, "AVAILABLE", LocalDateTime.now());
            Reward r2 = new Reward(null, "Amazon Gift Card ($50)", "A $50 gift card.", 2000, 10, "AVAILABLE", LocalDateTime.now());
            Reward r3 = new Reward(null, "Extra Leave Day", "One extra day of paid leave.", 5000, 5, "AVAILABLE", LocalDateTime.now());
            rewardRepository.save(r1);
            rewardRepository.save(r2);
            rewardRepository.save(r3);

            // Seed Challenges
            Challenge c1 = new Challenge(null, "Plant 10 Trees", "Participate in a tree plantation drive and plant 10 trees.", "Environmental", "CSR_HOURS", 10.0, 300, b1, null, LocalDateTime.now().minusDays(5), LocalDateTime.now().plusDays(25), "ACTIVE", LocalDateTime.now(), LocalDateTime.now());
            Challenge c2 = new Challenge(null, "Complete Security Training", "Finish the annual infosec training.", "Social", "TRAINING_COMPLETED", 1.0, 150, null, itDept, LocalDateTime.now().minusDays(1), LocalDateTime.now().plusDays(10), "ACTIVE", LocalDateTime.now(), LocalDateTime.now());
            Challenge c3 = new Challenge(null, "Zero Plastic Week", "Do not use any single-use plastics for a week.", "Environmental", "MANUAL", 1.0, 200, null, null, LocalDateTime.now(), LocalDateTime.now().plusDays(7), "ACTIVE", LocalDateTime.now(), LocalDateTime.now());
            challengeRepository.save(c1);
            challengeRepository.save(c2);
            challengeRepository.save(c3);

            // Seed Employee Challenge Progress
            EmployeeChallenge ec1 = new EmployeeChallenge(null, emp1, c1, 5.0, false, null, 0, "IN_PROGRESS");
            EmployeeChallenge ec2 = new EmployeeChallenge(null, emp1, c2, 1.0, true, LocalDateTime.now().minusDays(1), 150, "COMPLETED");
            employeeChallengeRepository.save(ec1);
            employeeChallengeRepository.save(ec2);

            // Seed Employee Badges
            EmployeeBadge eb1 = new EmployeeBadge(null, emp1, b2, LocalDateTime.now().minusDays(10));
            employeeBadgeRepository.save(eb1);

            // Update user XP manually for seeding
            emp1.setXp(850);
            emp1.setLevel(3);
            userRepository.save(emp1);

            admin.setXp(2500);
            admin.setLevel(5);
            userRepository.save(admin);

            // Seed Timeline
            AchievementTimeline t1 = new AchievementTimeline(null, emp1, "CHALLENGE_COMPLETED", "Completed Security Training", 150, LocalDateTime.now().minusDays(1));
            AchievementTimeline t2 = new AchievementTimeline(null, emp1, "BADGE_EARNED", "Earned CSR Hero Badge", 0, LocalDateTime.now().minusDays(10));
            timelineRepository.save(t1);
            timelineRepository.save(t2);

            // Seed Redemptions
            RewardRedemption rr1 = new RewardRedemption(null, admin, r1, LocalDateTime.now().minusDays(2), 500, "COMPLETED");
            rewardRedemptionRepository.save(rr1);
        }
    }
}
