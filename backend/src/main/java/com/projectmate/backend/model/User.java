package com.projectmate.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    private String name;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;
    private String role;
    private List<String> skills;
    private AuthProvider provider;
    private String providerId;
    private Education education;
    private String bio;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Education {
        private String college;
        private String degree;
        private String fieldOfStudy;
        private String graduationYear;
    }

    public enum AuthProvider {
        LOCAL, GOOGLE, GITHUB
    }
}
