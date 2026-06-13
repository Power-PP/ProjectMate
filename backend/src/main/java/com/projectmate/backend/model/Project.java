package com.projectmate.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "projects")
public class Project {
    @Id
    private String id;
    
    private String title;
    private String description;
    private String ownerId;
    private String ownerName;
    
    @Builder.Default
    private String status = "Open"; // Open, Hiring, In progress, Completed
    
    private int openings;
    private boolean remote;
    
    @Builder.Default
    private List<String> roles = new ArrayList<>();
    
    @Builder.Default
    private List<String> stack = new ArrayList<>();
    
    @Builder.Default
    private List<String> memberIds = new ArrayList<>();
    
    @Builder.Default
    private List<String> applicantIds = new ArrayList<>();
}
