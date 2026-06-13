package com.projectmate.backend.controller;

import com.projectmate.backend.model.Project;
import com.projectmate.backend.model.User;
import com.projectmate.backend.repository.ProjectRepository;
import com.projectmate.backend.security.CustomUserDetails;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(@RequestParam(required = false) String search) {
        if (StringUtils.hasText(search)) {
            return ResponseEntity.ok(projectRepository
                    .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrStackContainingIgnoreCase(
                            search, search, search));
        }
        return ResponseEntity.ok(projectRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createProject(Authentication authentication, @RequestBody CreateProjectRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            User user = ((CustomUserDetails) principal).getUser();
            
            Project project = Project.builder()
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .ownerId(user.getId())
                    .ownerName(user.getName())
                    .status(request.getStatus() != null ? request.getStatus() : "Open")
                    .openings(request.getOpenings())
                    .remote(request.isRemote())
                    .roles(request.getRoles() != null ? request.getRoles() : new ArrayList<>())
                    .stack(request.getStack() != null ? request.getStack() : new ArrayList<>())
                    .build();

            Project saved = projectRepository.save(project);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid principal type"));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyProjects(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            User user = ((CustomUserDetails) principal).getUser();
            
            List<Project> owned = projectRepository.findByOwnerId(user.getId());
            List<Project> joined = projectRepository.findByMemberIdsContaining(user.getId());
            
            Map<String, List<Project>> response = new HashMap<>();
            response.put("owned", owned);
            response.put("joined", joined);
            
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid principal type"));
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<?> applyToProject(Authentication authentication, @PathVariable String id) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            User user = ((CustomUserDetails) principal).getUser();
            
            Project project = projectRepository.findById(id).orElse(null);
            if (project == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Project not found"));
            }

            if (project.getOwnerId().equals(user.getId())) {
                return ResponseEntity.badRequest().body(Map.of("error", "You cannot apply to your own project"));
            }

            if (project.getMemberIds().contains(user.getId())) {
                return ResponseEntity.badRequest().body(Map.of("error", "You are already a member of this project"));
            }

            if (project.getApplicantIds().contains(user.getId())) {
                return ResponseEntity.badRequest().body(Map.of("error", "You have already applied to this project"));
            }

            project.getApplicantIds().add(user.getId());
            projectRepository.save(project);
            
            return ResponseEntity.ok(Map.of("message", "Application submitted successfully"));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid principal type"));
    }

    @PostMapping("/{id}/accept/{userId}")
    public ResponseEntity<?> acceptApplicant(Authentication authentication, @PathVariable String id, @PathVariable String userId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            User user = ((CustomUserDetails) principal).getUser();
            
            Project project = projectRepository.findById(id).orElse(null);
            if (project == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Project not found"));
            }

            if (!project.getOwnerId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only the owner can accept applicants"));
            }

            if (!project.getApplicantIds().contains(userId)) {
                return ResponseEntity.badRequest().body(Map.of("error", "User is not a pending applicant"));
            }

            project.getApplicantIds().remove(userId);
            project.getMemberIds().add(userId);
            projectRepository.save(project);
            
            return ResponseEntity.ok(Map.of("message", "Applicant accepted successfully"));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid principal type"));
    }

    @Data
    public static class CreateProjectRequest {
        private String title;
        private String description;
        private String status;
        private int openings;
        private boolean remote;
        private List<String> roles;
        private List<String> stack;
    }
}
