package com.projectmate.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "project_applications")
public class ProjectApplication {
    @Id
    private String id;
    
    private String projectId;
    private String projectTitle;
    private String ownerId;
    
    private String applicantId;
    private String applicantName;
    private String applicantEmail;
    private String applicantRole;
    private String notes; // Cover letter or message
    
    @Builder.Default
    private String status = "Pending"; // Pending, Accepted, Rejected
    
    private Instant createdAt;
}
