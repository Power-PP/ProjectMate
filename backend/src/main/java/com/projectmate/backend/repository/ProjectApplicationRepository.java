package com.projectmate.backend.repository;

import com.projectmate.backend.model.ProjectApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectApplicationRepository extends MongoRepository<ProjectApplication, String> {
    List<ProjectApplication> findByOwnerIdOrderByCreatedAtDesc(String ownerId);
    List<ProjectApplication> findByApplicantIdOrderByCreatedAtDesc(String applicantId);
    Optional<ProjectApplication> findByProjectIdAndApplicantId(String projectId, String applicantId);
}
