package com.ecosphere.backend.service;

import com.ecosphere.backend.dto.RegisterRequest;
import com.ecosphere.backend.entity.Department;
import com.ecosphere.backend.entity.Role;
import com.ecosphere.backend.entity.User;
import com.ecosphere.backend.repository.DepartmentRepository;
import com.ecosphere.backend.repository.RoleRepository;
import com.ecosphere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User createUser(RegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email is already taken!");
        }
        if(request.getEmployeeId() != null && userRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new RuntimeException("Employee ID is already taken!");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setEmployeeId(request.getEmployeeId());
        
        String pwd = request.getPassword() != null && !request.getPassword().isEmpty() ? request.getPassword() : "temp123";
        user.setPassword(passwordEncoder.encode(pwd));
        
        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRole(role);

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
            user.setDepartment(dept);
        }

        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setPhone(userDetails.getPhone());
        user.setStatus(userDetails.getStatus());
        
        if (userDetails.getRole() != null && userDetails.getRole().getId() != null) {
            Role role = roleRepository.findById(userDetails.getRole().getId()).orElse(null);
            if(role != null) user.setRole(role);
        }
        if (userDetails.getDepartment() != null && userDetails.getDepartment().getId() != null) {
            Department dept = departmentRepository.findById(userDetails.getDepartment().getId()).orElse(null);
            if(dept != null) user.setDepartment(dept);
        }

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
