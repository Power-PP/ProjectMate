package com.projectmate.backend.controller;

import com.projectmate.backend.model.Notification;
import com.projectmate.backend.model.Project;
import com.projectmate.backend.model.ProjectApplication;
import com.projectmate.backend.model.User;
import com.projectmate.backend.repository.NotificationRepository;
import com.projectmate.backend.repository.ProjectApplicationRepository;
import com.projectmate.backend.repository.ProjectRepository;
import com.projectmate.backend.security.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ProjectApplicationRepository projectApplicationRepository;
    private final ProjectRepository projectRepository;
    private final NotificationRepository notificationRepository;

    public ApplicationController(ProjectApplicationRepository projectApplicationRepository,
                                 ProjectRepository projectRepository,
                                 NotificationRepository notificationRepository) {
        this.projectApplicationRepository = projectApplicationRepository;
        this.projectRepository = projectRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/incoming")
    public ResponseEntity<?> getIncomingApplications(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            User user = ((CustomUserDetails) principal).getUser();
            List<ProjectApplication> applications = projectApplicationRepository.findByOwnerIdOrderByCreatedAtDesc(user.getId());
            return ResponseEntity.ok(applications);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid principal type"));
    }

    @GetMapping("/outgoing")
    public ResponseEntity<?> getOutgoingApplications(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            User user = ((CustomUserDetails) principal).getUser();
            List<ProjectApplication> applications = projectApplicationRepository.findByApplicantIdOrderByCreatedAtDesc(user.getId());
            return ResponseEntity.ok(applications);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid principal type"));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<?> acceptApplication(Authentication authentication, @PathVariable String id) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            User currentUser = ((CustomUserDetails) principal).getUser();
            ProjectApplication application = projectApplicationRepository.findById(id).orElse(null);
            if (application == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Application not found"));
            }

            if (!application.getOwnerId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only the owner can accept applications"));
            }

            if (!"Pending".equals(application.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Application is already processed"));
            }

            Project project = projectRepository.findById(application.getProjectId()).orElse(null);
            if (project == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Associated project not found"));
            }

            // Move applicant from applicantIds to memberIds
            project.getApplicantIds().remove(application.getApplicantId());
            if (!project.getMemberIds().contains(application.getApplicantId())) {
                project.getMemberIds().add(application.getApplicantId());
            }
            projectRepository.save(project);

            // Update application status
            application.setStatus("Accepted");
            projectApplicationRepository.save(application);

            // Send notification to the applicant
            Notification notification = Notification.builder()
                    .recipientId(application.getApplicantId())
                    .senderId(currentUser.getId())
                    .senderName(currentUser.getName())
                    .projectId(project.getId())
                    .projectTitle(project.getTitle())
                    .message(currentUser.getName() + " accepted your application for " + project.getTitle() + ".")
                    .read(false)
                    .createdAt(Instant.now())
                    .build();
            notificationRepository.save(notification);

            return ResponseEntity.ok(Map.of("message", "Application accepted successfully"));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid principal type"));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectApplication(Authentication authentication, @PathVariable String id) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            User currentUser = ((CustomUserDetails) principal).getUser();
            ProjectApplication application = projectApplicationRepository.findById(id).orElse(null);
            if (application == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Application not found"));
            }

            if (!application.getOwnerId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only the owner can decline applications"));
            }

            if (!"Pending".equals(application.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Application is already processed"));
            }

            Project project = projectRepository.findById(application.getProjectId()).orElse(null);
            if (project != null) {
                project.getApplicantIds().remove(application.getApplicantId());
                projectRepository.save(project);
            }

            // Update application status
            application.setStatus("Rejected");
            projectApplicationRepository.save(application);

            // Send notification to the applicant
            Notification notification = Notification.builder()
                    .recipientId(application.getApplicantId())
                    .senderId(currentUser.getId())
                    .senderName(currentUser.getName())
                    .projectId(application.getProjectId())
                    .projectTitle(application.getProjectTitle())
                    .message(currentUser.getName() + " declined your application for " + application.getProjectTitle() + ".")
                    .read(false)
                    .createdAt(Instant.now())
                    .build();
            notificationRepository.save(notification);

            return ResponseEntity.ok(Map.of("message", "Application declined successfully"));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid principal type"));
    }
}
