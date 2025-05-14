package com.educ_pltaform.repository;

import com.educ_pltaform.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    // Custom query methods can be defined here if needed
    // For example, to find quizzes by user or other criteria
}
