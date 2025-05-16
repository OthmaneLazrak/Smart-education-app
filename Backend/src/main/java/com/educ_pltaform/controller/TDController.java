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
            "Crée 3 exercices sur : %s\\n\\n\" +\n" +
                    "    \"Format :\\n\" +\n" +
                    "    \"Ex1 : [titre]\\n\" +\n" +
                    "    \"[énoncé]\\n\" +\n" +
                    "    \"a) [question]\\n\" +\n" +
                    "    \"b) [question]\\n\" +\n" +
                    "    \"c) [question]\\n\\n\" +\n" +
                    "    \"Difficulté progressive, avec exemples";

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