package com.projectmate.backend.repository;

import com.projectmate.backend.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByOwnerId(String ownerId);
    List<Project> findByMemberIdsContaining(String memberId);
    List<Project> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrStackContainingIgnoreCase(
            String title, String description, String stack);
}
