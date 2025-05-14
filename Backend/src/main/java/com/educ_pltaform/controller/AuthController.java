package com.educ_pltaform.controller;

import com.educ_pltaform.dto.RegisterRequest;
import com.educ_pltaform.entity.User;
import com.educ_pltaform.entity.UserRole;
import com.educ_pltaform.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        try {
            // Validation de l'email
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                Map<String, Object> error = new HashMap<>();
                error.put("message", "Cet email est déjà utilisé");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            }

            // Détermination du rôle
            UserRole userRole;
            try {
                userRole = "ENSEIGNANT".equalsIgnoreCase(String.valueOf(request.getRole())) ?
                        UserRole.ENSEIGNANT : UserRole.ETUDIANT;
            } catch (Exception e) {
                userRole = UserRole.ETUDIANT; // Rôle par défaut
            }

            // Création de l'utilisateur
            User user = User.builder()
                    .nom(request.getNom())
                    .prenom(request.getPrenom())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getMotDePasse()))
                    .role(userRole)
                    .build();

            log.info("Création d'un nouvel utilisateur avec le rôle: {}", userRole);
            User savedUser = userRepository.save(user);

            // Préparation de la réponse
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Inscription réussie");
            response.put("role", savedUser.getRole().toString());
            response.put("userId", savedUser.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Erreur lors de l'inscription: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Erreur lors de l'inscription : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        try {
            return userRepository.findByEmail(loginRequest.get("email"))
                    .filter(user -> passwordEncoder.matches(
                            loginRequest.get("motDePasse"),
                            user.getPassword()))
                    .map(user -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("message", "Connexion réussie");
                        response.put("userId", user.getId());
                        response.put("role", user.getRole().toString());
                        response.put("nom", user.getNom());
                        response.put("prenom", user.getPrenom());
                        log.info("Connexion réussie pour l'utilisateur: {} {}", user.getPrenom(), user.getNom());
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        log.warn("Tentative de connexion échouée pour l'email: {}", loginRequest.get("email"));
                        Map<String, Object> error = new HashMap<>();
                        error.put("message", "Email ou mot de passe incorrect");
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
                    });

        } catch (Exception e) {
            log.error("Erreur lors de la connexion: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Erreur lors de la connexion");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Déconnexion réussie");
            log.info("Déconnexion réussie");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erreur lors de la déconnexion: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Erreur lors de la déconnexion");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}