package com.educ_pltaform.service;

import com.educ_pltaform.entity.User;
import com.educ_pltaform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<String> registerUser(User user) {
        try {
            // Vérifie si l'email existe déjà
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("L'email est déjà utilisé.");
            }

            // Vérifie que le mot de passe n'est pas null ou vide
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                return ResponseEntity.badRequest().body("Le mot de passe ne peut pas être vide.");
            }

            // Crypte le mot de passe avant de l'enregistrer
            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);

            // Enregistre l'utilisateur dans la base de données
            userRepository.save(user);

            // Retourne une réponse de succès
            return ResponseEntity.status(HttpStatus.CREATED).body("Utilisateur enregistré avec succès");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'inscription de l'utilisateur : " + e.getMessage());
        }
    }
}