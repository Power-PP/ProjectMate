package com.projectmate.backend.controller;

import com.projectmate.backend.model.User;
import com.projectmate.backend.repository.UserRepository;
import com.projectmate.backend.security.CustomUserDetails;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/developers")
public class DeveloperController {

    private final UserRepository userRepository;

    public DeveloperController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllDevelopers(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            User currentUser = ((CustomUserDetails) principal).getUser();
            
            List<DeveloperResponse> developers = userRepository.findAll().stream()
                    // Exclude the current user from the list
                    .filter(u -> !u.getId().equals(currentUser.getId()))
                    // Map to projected safe Developer DTO
                    .map(u -> DeveloperResponse.builder()
                            .id(u.getId())
                            .name(u.getName())
                            .email(u.getEmail())
                            .role(u.getRole() != null ? u.getRole() : "Developer")
                            .skills(u.getSkills() != null ? u.getSkills() : List.of())
                            .education(u.getEducation())
                            .bio(u.getBio())
                            .githubUrl(u.getGithubUrl())
                            .linkedinUrl(u.getLinkedinUrl())
                            .portfolioUrl(u.getPortfolioUrl())
                            .build())
                    .collect(Collectors.toList());
                    
            return ResponseEntity.ok(developers);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid principal type"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDeveloperById(Authentication authentication, @PathVariable String id) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        return userRepository.findById(id)
                .map(u -> {
                    DeveloperResponse response = DeveloperResponse.builder()
                            .id(u.getId())
                            .name(u.getName())
                            .email(u.getEmail())
                            .role(u.getRole() != null ? u.getRole() : "Developer")
                            .skills(u.getSkills() != null ? u.getSkills() : List.of())
                            .education(u.getEducation())
                            .bio(u.getBio())
                            .githubUrl(u.getGithubUrl())
                            .linkedinUrl(u.getLinkedinUrl())
                            .portfolioUrl(u.getPortfolioUrl())
                            .build();
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Data
    @Builder
    public static class DeveloperResponse {
        private String id;
        private String name;
        private String email;
        private String role;
        private List<String> skills;
        private User.Education education;
        private String bio;
        private String githubUrl;
        private String linkedinUrl;
        private String portfolioUrl;
    }
}
