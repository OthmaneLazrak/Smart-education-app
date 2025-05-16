package com.educ_pltaform.controller;

import com.educ_pltaform.entity.Probleme;
import com.educ_pltaform.repository.ProblemeRepository;
import com.educ_pltaform.service.LLMService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class ProblemeController {

    private static final String PROBLEM_PROMPT =
            "YCrée un problème pédagogique sur : %s\\n\\n\" +\n" +
                    "    \"Format :\\n\" +\n" +
                    "    \"- Énoncé détaillé\\n\" +\n" +
                    "    \"- Questions à résoudre\\n\" +\n" +
                    "    \"- Indices de réflexion\\n\" +\n" +
                    "    \"- Solution complète";

    @Autowired
    private ProblemeRepository problemeRepository;

    @Autowired
    private LLMService llmService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateProblem(@RequestBody Probleme problemRequest) {
        try {
            String content = problemRequest.getContent();
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le contenu ne peut pas être vide");
            }   

            log.info("Génération de problème pour le contenu: {}", content);

            String generatedContent = llmService.generateContent(
                    String.format(PROBLEM_PROMPT, content),
                    "problem_generator"
            );

            Probleme probleme = new Probleme();
            probleme.setContent(generatedContent);
            probleme.setTitle("Problème - " + content.substring(0, Math.min(content.length(), 50)).trim());
            probleme.setCreatedAt(new Date());

            return ResponseEntity.ok(problemeRepository.save(probleme));

        } catch (Exception e) {
            log.error("Erreur lors de la génération du problème: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur de génération: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Probleme>> getAllProblems() {
        return ResponseEntity.ok(problemeRepository.findAll());
    }
}