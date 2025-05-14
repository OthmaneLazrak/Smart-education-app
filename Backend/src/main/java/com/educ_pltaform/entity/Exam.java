package com.educ_pltaform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;
    private LocalDateTime dateCreation;
    private String filePath;
    @Column(columnDefinition = "TEXT")
    private String content;
    private String matiere;

    @ManyToOne
    @JoinColumn(name = "enseignant_id")
    private User enseignant;
}