package com.educ_pltaform.repository;

import com.educ_pltaform.entity.TD;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TDRepository extends JpaRepository<TD, Long> {
    List<TD> findByEnseignantId(Long enseignantId);
    List<TD> findByMatiere(String matiere);
}