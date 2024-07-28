package com.example.Chatbot.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class GeminiService {

    @Autowired
    private RestTemplate restTemplate;

    private final String API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=%s";

    public String callApi(String prompt, String geminiKey) {
        System.out.println("Calling Gemini API with prompt: " + prompt);
        String apiUrl = String.format(API_URL_TEMPLATE, geminiKey);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode contentNode = objectMapper.createObjectNode();
        ObjectNode partsNode = objectMapper.createObjectNode();
        partsNode.put("text", prompt);
        contentNode.set("parts", objectMapper.createArrayNode().add(partsNode));
        ObjectNode requestBodyNode = objectMapper.createObjectNode();
        requestBodyNode.set("contents", objectMapper.createArrayNode().add(contentNode));

        String requestBody;
        try {
            requestBody = objectMapper.writeValueAsString(requestBodyNode);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to construct JSON request body", e);
        }

        System.out.println("Request body: " + requestBody);

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response;
        try {
            response = restTemplate.exchange(apiUrl, HttpMethod.POST, request, String.class);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error calling Gemini API", e);
        }

        System.out.println("Response from Gemini API: " + response.getBody());

        // Parse the response to extract the text content
        String extractedText;
        try {
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            JsonNode candidatesNode = rootNode.path("candidates");
            if (candidatesNode.isArray() && candidatesNode.size() > 0) {
                JsonNode firstCandidate = candidatesNode.get(0);
                JsonNode contentNodeResponse = firstCandidate.path("content");
                JsonNode partsArray = contentNodeResponse.path("parts");
                if (partsArray.isArray() && partsArray.size() > 0) {
                    extractedText = partsArray.get(0).path("text").asText();
                } else {
                    extractedText = "No text content found in the response.";
                }
            } else {
                extractedText = "No candidates found in the response.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error parsing Gemini API response", e);
        }

        return extractedText;
    }
}
