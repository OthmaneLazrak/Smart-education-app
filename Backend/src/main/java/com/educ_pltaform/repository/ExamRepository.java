package com.educ_pltaform.repository;

import com.educ_pltaform.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByEnseignantId(Long enseignantId);
    List<Exam> findByMatiere(String matiere);
}