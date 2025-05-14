package com.educ_pltaform.controller;

import com.educ_pltaform.entity.TD;
import com.educ_pltaform.repository.TDRepository;
import com.educ_pltaform.service.LLMService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tds")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class TDController {

    private static final String TD_PROMPT =
            "Créer un TD sur le sujet suivant:\\n\" +\n" +
                    "\"%s\\n\\n\" +\n" +
                    "\"Format à suivre EXACTEMENT:\\n\" +\n" +
                    "\"Exercice 1: [titre de l'exercice]\\n\" +\n" +
                    "\"[énoncé détaillé]\\n\" +\n" +
                    "\"a) [sous-question]\\n\" +\n" +
                    "\"b) [sous-question]\\n\" +\n" +
                    "\"c) [sous-question]\\n\\n\" +\n" +
                    "\"Règles:\\n\" +\n" +
                    "\"- 3 exercices progressifs\\n\" +\n" +
                    "\"- Chaque exercice doit avoir des sous-questions\\n\" +\n" +
                    "\"- Inclure des exemples si nécessaire\\n\" +\n" +
                    "\"- Difficulté progressive\\n\" +\n" +
                    "\"- Générer tout le contenu en français";

    @Autowired
    private TDRepository tdRepository;

    @Autowired
    private LLMService llmService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateTD(@RequestBody TD tdRequest) {
        try {
            if (tdRequest.getMatiere() == null || tdRequest.getMatiere().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("La matière ne peut pas être vide");
            }

            log.info("Génération d'un TD pour la matière: {}", tdRequest.getMatiere());

            String generatedContent = llmService.generateContent(
                    String.format(TD_PROMPT, tdRequest.getMatiere()),
                    "td_generator"
            );

            TD td = new TD();
            td.setTitre("TD - " + tdRequest.getMatiere());
            td.setDescription(tdRequest.getDescription());
            td.setMatiere(tdRequest.getMatiere());
            td.setContent(generatedContent);
            td.setDateCreation(LocalDateTime.now());
            td.setEnseignant(tdRequest.getEnseignant());

            return ResponseEntity.ok(tdRepository.save(td));

        } catch (Exception e) {
            log.error("Erreur lors de la génération du TD: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur de génération: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<TD>> getAllTDs() {
        return ResponseEntity.ok(tdRepository.findAll());
    }
}