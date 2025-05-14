package com.educ_pltaform.repository;

import com.educ_pltaform.entity.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UploadedFileRepository extends JpaRepository<UploadedFile, Long> {
    // Custom query methods can be defined here if needed
    // For example, to find files by user or other criteria
}
