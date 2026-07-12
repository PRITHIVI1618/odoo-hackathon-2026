package com.ecosphere.backend.service;

import com.ecosphere.backend.dto.AuthResponse;
import com.ecosphere.backend.dto.LoginRequest;
import com.ecosphere.backend.dto.RegisterRequest;
import com.ecosphere.backend.entity.User;
import com.ecosphere.backend.entity.Role;
import com.ecosphere.backend.entity.Department;
import com.ecosphere.backend.repository.RoleRepository;
import com.ecosphere.backend.repository.DepartmentRepository;
import com.ecosphere.backend.repository.UserRepository;
import com.ecosphere.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setLastLogin(java.time.LocalDateTime.now());
        userRepository.save(user);

        return new AuthResponse(
            token, 
            user.getEmail(), 
            user.getFirstName(), 
            user.getLastName(), 
            user.getRole().getName(), 
            user.getDepartment() != null ? user.getDepartment().getName() : null,
            user.getAvatarUrl()
        );
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if(userRepository.existsByEmail(registerRequest.getEmail())){
            throw new RuntimeException("Email is already taken!");
        }
        if(registerRequest.getEmployeeId() != null && userRepository.existsByEmployeeId(registerRequest.getEmployeeId())) {
            throw new RuntimeException("Employee ID is already taken!");
        }

        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setEmployeeId(registerRequest.getEmployeeId());
        user.setGender(registerRequest.getGender() != null ? registerRequest.getGender() : "Other");
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        
        Role role = roleRepository.findByName(registerRequest.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRole(role);

        if (registerRequest.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(registerRequest.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
            user.setDepartment(dept);
        }

        userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        return new AuthResponse(
            token, 
            user.getEmail(), 
            user.getFirstName(), 
            user.getLastName(), 
            user.getRole().getName(), 
            user.getDepartment() != null ? user.getDepartment().getName() : null,
            user.getAvatarUrl()
        );
    }

    public String forgotPassword(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new RuntimeException("User not found with email: " + email);
        }
        // Mock email sending
        System.out.println("Mock Email: Sent password reset link to " + email);
        return "Password reset instructions sent to " + email;
    }
}
