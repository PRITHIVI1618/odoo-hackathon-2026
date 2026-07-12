package com.ecosphere.backend;

import com.ecosphere.backend.entity.*;
import com.ecosphere.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

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

    @Override
    public void run(String... args) throws Exception {
        seedRoles();
        seedDepartments();
        seedUsers();
        seedSocialData();
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
}
