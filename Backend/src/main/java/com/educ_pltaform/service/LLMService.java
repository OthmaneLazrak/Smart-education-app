package com.educ_pltaform.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class LLMService {

    @Value("${openrouter.api.url}")
    private String llmApiUrl;

    @Value("${openrouter.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public LLMService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    private void validateConfig() {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalStateException("OpenRouter API key non configurée");
        }
        if (llmApiUrl == null || llmApiUrl.trim().isEmpty()) {
            throw new IllegalStateException("OpenRouter API URL non configurée");
        }
        log.info("Configuration OpenRouter validée");
    }

    public String generateContent(String prompt, String role) {
        try {
            log.info("Début génération - Prompt: '{}', Role: '{}'", prompt, role);
            log.info("URL API: {}", llmApiUrl);
            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", role + "\n" + prompt);

            Map<String, Object> requestMap = new HashMap<>();
            requestMap.put("messages", List.of(message));
            requestMap.put("model", "mistralai/mistral-7b-instruct");
            requestMap.put("temperature", 0.7);
            requestMap.put("max_tokens", 4000);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("HTTP-Referer", "http://localhost:3000");
            headers.set("X-Title", "Education Platform");

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestMap, headers);

            log.info("Corps de la requête: {}", objectMapper.writeValueAsString(requestMap));
            ResponseEntity<String> response = restTemplate.exchange(
                    llmApiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );
            log.info("Envoi requête à OpenRouter");

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new LLMServiceException("Réponse API invalide: " + response.getStatusCode());
            }

            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            return jsonResponse.path("choices")
                    .path(0)
                    .path("message")
                    .path("content")
                    .asText();

        } catch (Exception e) {
            log.error("Erreur lors de l'appel à OpenRouter: {}", e.getMessage());
            throw new LLMServiceException("Erreur API OpenRouter: " + e.getMessage(), e);
        }
    }
}