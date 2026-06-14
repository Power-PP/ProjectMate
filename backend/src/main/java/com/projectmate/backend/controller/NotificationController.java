package com.projectmate.backend.controller;

import com.projectmate.backend.model.Notification;
import com.projectmate.backend.model.User;
import com.projectmate.backend.repository.NotificationRepository;
import com.projectmate.backend.security.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public ResponseEntity<?> getNotifications(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            User user = ((CustomUserDetails) principal).getUser();
            List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId());
            long unreadCount = notificationRepository.countByRecipientIdAndReadFalse(user.getId());

            return ResponseEntity.ok(Map.of(
                    "notifications", notifications,
                    "unreadCount", unreadCount
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid principal type"));
    }

    @PostMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            User user = ((CustomUserDetails) principal).getUser();
            List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId());
            boolean updated = false;
            for (Notification n : notifications) {
                if (!n.isRead()) {
                    n.setRead(true);
                    updated = true;
                }
            }
            if (updated) {
                notificationRepository.saveAll(notifications);
            }
            return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid principal type"));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(Authentication authentication, @PathVariable String id) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            User user = ((CustomUserDetails) principal).getUser();
            return notificationRepository.findById(id)
                    .map(n -> {
                        if (!n.getRecipientId().equals(user.getId())) {
                            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Not authorized"));
                        }
                        n.setRead(true);
                        notificationRepository.save(n);
                        return ResponseEntity.ok(n);
                    })
                    .orElse(ResponseEntity.notFound().build());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid principal type"));
    }
}
