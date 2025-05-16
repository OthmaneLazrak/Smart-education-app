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
            "Crée un examen en français sur : %s\\n\\n\" +\n" +
                    "    \"Structure :\\n\" +\n" +
                    "    \"Durée : [minutes]\\n\" +\n" +
                    "    \"Q1 : [question]\\n\" +\n" +
                    "    \"[espace réponse]\\n\" +\n" +
                    "    \"Points : [x/20]\\n\\n\" +\n" +
                    "    \"4-5 questions, concepts clés, réponses détaillées, total 20 points.";

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private LLMService llmService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateExam(@RequestBody Exam examRequest) {
        try {
            String sujet;
            log.info("Début de la génération d'examen");

            // Vérification et traitement du contenu
            if (examRequest.getContent() != null && !examRequest.getContent().trim().isEmpty()) {
                sujet = examRequest.getContent().trim();
                log.info("Utilisation du contenu du fichier comme sujet");
            } else if (examRequest.getMatiere() != null && !examRequest.getMatiere().trim().isEmpty()) {
                sujet = examRequest.getMatiere().trim();
                log.info("Utilisation de la matière comme sujet");
            } else {
                return ResponseEntity.badRequest().body("Le contenu ou la matière doit être spécifié");
            }

            // Génération du contenu de l'examen
            String generatedContent = llmService.generateContent(
                    String.format(EXAM_PROMPT, sujet),
                    "exam_generator"
            );

            // Création de l'examen
            Exam exam = new Exam();
            exam.setTitre("Examen - " + sujet.substring(0, Math.min(sujet.length(), 50)));
            exam.setDescription(examRequest.getDescription());
            exam.setMatiere(examRequest.getMatiere() != null ?
                    examRequest.getMatiere() : "Intelligence Artificielle");
            exam.setContent(generatedContent);
            exam.setDateCreation(LocalDateTime.now());
            exam.setEnseignant(examRequest.getEnseignant());

            Exam savedExam = examRepository.save(exam);
            log.info("Examen généré et sauvegardé avec succès, ID: {}", savedExam.getId());

            return ResponseEntity.ok(savedExam);

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