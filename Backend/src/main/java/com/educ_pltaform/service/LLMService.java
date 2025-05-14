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

    @Value("${huggingface.api.url}")
    private String llmApiUrl;

    @Value("${huggingface.api.key}")
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
            throw new IllegalStateException("HuggingFace API key non configurée");
        }
        if (llmApiUrl == null || llmApiUrl.trim().isEmpty()) {
            throw new IllegalStateException("HuggingFace API URL non configurée");
        }
        log.info("Configuration HuggingFace validée");
    }

    public String generateContent(String prompt, String role) {
        try {
            Map<String, Object> requestMap = new HashMap<>();
            requestMap.put("inputs", role + "\n" + prompt);
            requestMap.put("parameters", Map.of(
                    "max_length", 4000,
                    "temperature", 0.5,
                    "top_p", 1.0,
                    "return_full_text", false
            ));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestMap, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    llmApiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new LLMServiceException("Réponse API invalide: " + response.getStatusCode());
            }

            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            return jsonResponse.path(0).path("generated_text").asText();

        } catch (Exception e) {
            log.error("Erreur lors de l'appel à HuggingFace: {}", e.getMessage());
            throw new LLMServiceException("Erreur API HuggingFace: " + e.getMessage(), e);
        }
    }
}