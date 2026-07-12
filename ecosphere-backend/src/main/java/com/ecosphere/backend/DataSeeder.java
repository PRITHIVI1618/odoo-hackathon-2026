package com.ecosphere.backend;

import com.ecosphere.backend.entity.Department;
import com.ecosphere.backend.entity.Role;
import com.ecosphere.backend.entity.User;
import com.ecosphere.backend.repository.DepartmentRepository;
import com.ecosphere.backend.repository.RoleRepository;
import com.ecosphere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedRoles();
        seedDepartments();
        seedUsers();
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
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName("Super Admin").orElseThrow();
            Role esgRole = roleRepository.findByName("ESG Manager").orElseThrow();
            Role dhRole = roleRepository.findByName("Department Head").orElseThrow();
            Role empRole = roleRepository.findByName("Employee").orElseThrow();

            Department itDept = departmentRepository.findByCode("IT").orElseThrow();
            Department hrDept = departmentRepository.findByCode("HR").orElseThrow();

            // Admin
            User admin = new User();
            admin.setFirstName("Super");
            admin.setLastName("Admin");
            admin.setEmail("admin@ecosphere.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(adminRole);
            admin.setDepartment(itDept);
            admin.setEmployeeId("EMP-0001");
            userRepository.save(admin);

            // ESG Manager
            User esg = new User();
            esg.setFirstName("ESG");
            esg.setLastName("Manager");
            esg.setEmail("esg@ecosphere.com");
            esg.setPassword(passwordEncoder.encode("esg123"));
            esg.setRole(esgRole);
            esg.setDepartment(hrDept);
            esg.setEmployeeId("EMP-0002");
            userRepository.save(esg);

            // Department Head
            User dh = new User();
            dh.setFirstName("Tech");
            dh.setLastName("Lead");
            dh.setEmail("head@ecosphere.com");
            dh.setPassword(passwordEncoder.encode("head123"));
            dh.setRole(dhRole);
            dh.setDepartment(itDept);
            dh.setEmployeeId("EMP-0003");
            userRepository.save(dh);

            // Employee
            User emp = new User();
            emp.setFirstName("John");
            emp.setLastName("Doe");
            emp.setEmail("employee@ecosphere.com");
            emp.setPassword(passwordEncoder.encode("emp123"));
            emp.setRole(empRole);
            emp.setDepartment(itDept);
            emp.setEmployeeId("EMP-0004");
            userRepository.save(emp);
        }
    }
}
