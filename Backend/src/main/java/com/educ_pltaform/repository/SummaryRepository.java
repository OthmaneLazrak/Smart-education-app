package com.educ_pltaform.repository;

import com.educ_pltaform.entity.Summary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SummaryRepository extends JpaRepository<Summary, Long> {
    // Custom query methods can be defined here if needed
    // For example, to find summaries by user or other criteria
}
