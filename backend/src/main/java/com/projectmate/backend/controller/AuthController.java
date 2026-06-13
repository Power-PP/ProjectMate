package com.projectmate.backend.controller;

import com.projectmate.backend.model.User;
import com.projectmate.backend.model.User.AuthProvider;
import com.projectmate.backend.repository.UserRepository;
import com.projectmate.backend.security.CustomUserDetails;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Email address already in use."));
        }

        User user = User.builder()
                .name(signupRequest.getName())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .role(signupRequest.getRole())
                .skills(signupRequest.getSkills())
                .provider(AuthProvider.LOCAL)
                .build();

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "User registered successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            User user = ((CustomUserDetails) principal).getUser();
            return userRepository.findById(user.getId())
                    .map(u -> {
                        u.setPassword(null);
                        return ResponseEntity.ok(u);
                    })
                    .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid principal type"));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody ProfileUpdateRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            User user = ((CustomUserDetails) principal).getUser();
            return userRepository.findById(user.getId())
                    .map(u -> {
                        if (request.getName() != null) u.setName(request.getName());
                        if (request.getRole() != null) u.setRole(request.getRole());
                        if (request.getSkills() != null) u.setSkills(request.getSkills());

                        User.Education edu = u.getEducation();
                        if (edu == null) {
                            edu = new User.Education();
                        }
                        if (request.getCollege() != null) edu.setCollege(request.getCollege());
                        if (request.getDegree() != null) edu.setDegree(request.getDegree());
                        if (request.getFieldOfStudy() != null) edu.setFieldOfStudy(request.getFieldOfStudy());
                        if (request.getGraduationYear() != null) edu.setGraduationYear(request.getGraduationYear());
                        u.setEducation(edu);

                        if (request.getBio() != null) u.setBio(request.getBio());
                        if (request.getGithubUrl() != null) u.setGithubUrl(request.getGithubUrl());
                        if (request.getLinkedinUrl() != null) u.setLinkedinUrl(request.getLinkedinUrl());
                        if (request.getPortfolioUrl() != null) u.setPortfolioUrl(request.getPortfolioUrl());

                        userRepository.save(u);

                        // Sync in-memory session user object
                        ((CustomUserDetails) principal).getUser().setName(u.getName());
                        ((CustomUserDetails) principal).getUser().setRole(u.getRole());
                        ((CustomUserDetails) principal).getUser().setSkills(u.getSkills());
                        ((CustomUserDetails) principal).getUser().setEducation(u.getEducation());
                        ((CustomUserDetails) principal).getUser().setBio(u.getBio());
                        ((CustomUserDetails) principal).getUser().setGithubUrl(u.getGithubUrl());
                        ((CustomUserDetails) principal).getUser().setLinkedinUrl(u.getLinkedinUrl());
                        ((CustomUserDetails) principal).getUser().setPortfolioUrl(u.getPortfolioUrl());

                        u.setPassword(null);
                        return ResponseEntity.ok(u);
                    })
                    .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid principal type"));
    }

    @Data
    public static class SignupRequest {
        private String name;
        private String email;
        private String password;
        private String role;
        private List<String> skills;
    }

    @Data
    public static class ProfileUpdateRequest {
        private String name;
        private String role;
        private List<String> skills;
        private String college;
        private String degree;
        private String fieldOfStudy;
        private String graduationYear;
        private String bio;
        private String githubUrl;
        private String linkedinUrl;
        private String portfolioUrl;
    }
}
