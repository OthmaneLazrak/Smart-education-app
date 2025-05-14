package com.educ_pltaform.controller;

import com.educ_pltaform.entity.Exam;
import com.educ_pltaform.repository.ExamRepository;
import com.educ_pltaform.service.LLMService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class ExamController {

    private static final String EXAM_PROMPT =
            "Créer un examen sur le sujet suivant:\\n\" +\n" +
                    "\"%s\\n\\n\" +\n" +
                    "\"Format à suivre EXACTEMENT:\\n\" +\n" +
                    "\"Durée: [durée en minutes]\\n\" +\n" +
                    "\"Question 1: [question sur le contenu]\\n\" +\n" +
                    "\"[espace pour réponse]\\n\" +\n" +
                    "\"Points: [nombre de points]\\n\\n\" +\n" +
                    "\"Règles:\\n\" +\n" +
                    "\"- Les questions doivent couvrir les concepts principaux\\n\" +\n" +
                    "\"- Prévoir suffisamment d'espace pour les réponses\\n\" +\n" +
                    "\"- Questions claires et précises\\n\" +\n" +
                    "\"- 4 à 5 questions au total\\n\" +\n" +
                    "\"- Total des points doit être sur 20\\n" +
                    "\"- Générer tout le contenu en français";

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private LLMService llmService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateExam(@RequestBody Exam examRequest) {
        try {
            if (examRequest.getMatiere() == null || examRequest.getMatiere().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("La matière ne peut pas être vide");
            }

            log.info("Génération d'un examen pour la matière: {}", examRequest.getMatiere());

            String generatedContent = llmService.generateContent(
                    String.format(EXAM_PROMPT, examRequest.getMatiere()),
                    "exam_generator"
            );

            Exam exam = new Exam();
            exam.setTitre("Examen - " + examRequest.getMatiere());
            exam.setDescription(examRequest.getDescription());
            exam.setMatiere(examRequest.getMatiere());
            exam.setContent(generatedContent);
            exam.setDateCreation(LocalDateTime.now());
            exam.setEnseignant(examRequest.getEnseignant());


            return ResponseEntity.ok(examRepository.save(exam));

        } catch (Exception e) {
            log.error("Erreur lors de la génération de l'examen: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur de génération: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Exam>> getAllExams() {
        return ResponseEntity.ok(examRepository.findAll());
    }
}