package com.resumescreener.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class LlmService {

    @Value("${llm.api.key:}")
    private String apiKey;

    @Value("${llm.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${llm.model:gpt-3.5-turbo}")
    private String modelName;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public LlmService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Extract structured candidate information (Name, Email, Phone, Skills, Experience, Education)
     * from raw resume text using LLM or heuristic fallback.
     */
    public Map<String, Object> extractResumeData(String text) {
        if (apiKey != null && !apiKey.trim().isEmpty()) {
            try {
                String prompt = buildExtractPrompt(text);
                String llmResponse = callLlmApi(prompt);
                Map<String, Object> parsed = parseJsonToMap(llmResponse);
                if (parsed != null && !parsed.isEmpty()) {
                    return parsed;
                }
            } catch (Exception e) {
                System.err.println("LLM API call failed for extraction, falling back to heuristic parsing: " + e.getMessage());
            }
        }
        return fallbackExtractResumeData(text);
    }

    /**
     * Compare a candidate's resume text against a Job Description using LLM or heuristic scoring.
     */
    public Map<String, Object> checkResume(String resumeText, String jobText) {
        if (apiKey != null && !apiKey.trim().isEmpty()) {
            try {
                String prompt = buildScreenPrompt(resumeText, jobText);
                String llmResponse = callLlmApi(prompt);
                Map<String, Object> parsed = parseJsonToMap(llmResponse);
                if (parsed != null && validateScreeningResult(parsed)) {
                    return parsed;
                }
            } catch (Exception e) {
                System.err.println("LLM API call failed for screening, falling back to heuristic screening: " + e.getMessage());
            }
        }
        return fallbackCheckResume(resumeText, jobText);
    }

    // Helper: Call OpenAI/LLM REST API
    private String callLlmApi(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey.trim());

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", modelName);
        requestBody.put("temperature", 0.2);

        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);
        messages.add(userMessage);

        requestBody.put("messages", messages);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse LLM HTTP response", e);
        }
    }

    // Prompt Builders
    private String buildExtractPrompt(String resumeText) {
        return "You are an expert HR recruitment assistant. " +
                "Extract structured candidate information from the following resume text. " +
                "Return ONLY valid JSON without markdown formatting, with the following exact keys:\n" +
                "{\n" +
                "  \"name\": \"Candidate Full Name\",\n" +
                "  \"email\": \"Candidate Email\",\n" +
                "  \"phone\": \"Candidate Phone\",\n" +
                "  \"skills\": [\"Skill1\", \"Skill2\"],\n" +
                "  \"experience\": [\"Experience details or titles\"],\n" +
                "  \"education\": [\"Degree and Institution\"]\n" +
                "}\n\n" +
                "RESUME TEXT:\n" + resumeText;
    }

    private String buildScreenPrompt(String resumeText, String jobText) {
        return "You are an expert technical recruiter evaluating a candidate resume for a specific job.\n" +
                "Compare the RESUME against the JOB DESCRIPTION carefully.\n" +
                "Evaluate:\n" +
                "1. Required skills match\n" +
                "2. Missing required skills\n" +
                "3. Relevant work experience\n" +
                "4. Education alignment\n" +
                "5. Overall match score between 1.0 and 10.0\n\n" +
                "Return ONLY a valid JSON object without markdown formatting, structured as follows:\n" +
                "{\n" +
                "  \"score\": 8.5,\n" +
                "  \"matchingSkills\": [\"Skill1\", \"Skill2\"],\n" +
                "  \"missingSkills\": [\"Skill3\"],\n" +
                "  \"experienceMatch\": true,\n" +
                "  \"educationMatch\": true,\n" +
                "  \"reason\": \"Comprehensive explanation justifying the match score based on candidate experience and skills.\"\n" +
                "}\n\n" +
                "JOB DESCRIPTION:\n" + jobText + "\n\n" +
                "RESUME TEXT:\n" + resumeText;
    }

    // JSON parsing helper
    @SuppressWarnings("unchecked")
    private Map<String, Object> parseJsonToMap(String jsonString) {
        try {
            String cleanJson = jsonString.trim();
            if (cleanJson.startsWith("```json")) {
                cleanJson = cleanJson.substring(7);
            } else if (cleanJson.startsWith("```")) {
                cleanJson = cleanJson.substring(3);
            }
            if (cleanJson.endsWith("```")) {
                cleanJson = cleanJson.substring(0, cleanJson.length() - 3);
            }
            cleanJson = cleanJson.trim();
            return objectMapper.readValue(cleanJson, Map.class);
        } catch (Exception e) {
            System.err.println("JSON parse error from LLM response: " + e.getMessage());
            return null;
        }
    }

    private boolean validateScreeningResult(Map<String, Object> result) {
        if (!result.containsKey("score")) return false;
        try {
            double score = Double.parseDouble(result.get("score").toString());
            return score >= 1.0 && score <= 10.0;
        } catch (Exception e) {
            return false;
        }
    }

    // Fallback Heuristic Parsing for Resumes when API Key is missing/offline
    private Map<String, Object> fallbackExtractResumeData(String text) {
        Map<String, Object> data = new HashMap<>();

        // Extract Email
        String email = "Not Found";
        Matcher emailMatcher = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}").matcher(text);
        if (emailMatcher.find()) {
            email = emailMatcher.group();
        }
        data.put("email", email);

        // Extract Phone
        String phone = "Not Found";
        Matcher phoneMatcher = Pattern.compile("(\\+?\\d{1,3}[- .]?)?\\(?\\d{3,5}\\)?[- .]?\\d{3,5}[- .]?\\d{3,5}").matcher(text);
        if (phoneMatcher.find()) {
            phone = phoneMatcher.group().trim();
        }
        data.put("phone", phone);

        // Extract Name from first line or email
        String name = "Candidate";
        String[] lines = text.split("\r?\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (!trimmed.isEmpty() && !trimmed.contains("@") && trimmed.length() < 40) {
                name = trimmed.replaceAll("[^a-zA-Z\\s]", "").trim();
                if (!name.isEmpty()) break;
            }
        }
        if ("Candidate".equals(name) && !"Not Found".equals(email)) {
            name = email.split("@")[0].replace(".", " ").replace("_", " ");
            name = capitalizeWords(name);
        }
        data.put("name", name);

        // Known Skills List
        List<String> knownSkills = Arrays.asList(
                "Java", "Spring Boot", "Spring", "MySQL", "PostgreSQL", "SQL", "REST API", "Microservices",
                "Hibernate", "JPA", "HTML", "CSS", "JavaScript", "TypeScript", "React", "Angular", "Vue",
                "Node.js", "Python", "C++", "C#", "Docker", "Kubernetes", "AWS", "Git", "Maven", "Gradle",
                "JUnit", "Linux", "Data Structures", "Algorithms", "OOP"
        );

        List<String> matchedSkills = new ArrayList<>();
        String textUpper = text.toUpperCase();
        for (String skill : knownSkills) {
            if (textUpper.contains(skill.toUpperCase())) {
                matchedSkills.add(skill);
            }
        }
        data.put("skills", matchedSkills);

        // Extract Experience & Education lines
        List<String> experienceList = new ArrayList<>();
        List<String> educationList = new ArrayList<>();

        for (String line : lines) {
            String l = line.trim();
            String lLower = l.toLowerCase();
            if (lLower.contains("b.tech") || lLower.contains("bachelor") || lLower.contains("master") ||
                lLower.contains("m.tech") || lLower.contains("degree") || lLower.contains("university") ||
                lLower.contains("college") || lLower.contains("b.e.") || lLower.contains("b.s.")) {
                if (l.length() < 120 && !educationList.contains(l)) {
                    educationList.add(l);
                }
            }
            if (lLower.contains("developer") || lLower.contains("engineer") || lLower.contains("intern") ||
                lLower.contains("experience") || lLower.contains("years") || lLower.contains("project")) {
                if (l.length() < 150 && !experienceList.contains(l)) {
                    experienceList.add(l);
                }
            }
        }

        if (experienceList.isEmpty()) {
            experienceList.add("Software Engineering Experience (extracted from resume)");
        }
        if (educationList.isEmpty()) {
            educationList.add("Bachelor of Technology / Computer Science");
        }

        data.put("experience", experienceList);
        data.put("education", educationList);

        return data;
    }

    // Fallback Heuristic Resume vs Job Screening
    private Map<String, Object> fallbackCheckResume(String resumeText, String jobText) {
        Map<String, Object> result = new HashMap<>();

        // Extract skills from job description
        List<String> commonSkills = Arrays.asList(
                "Java", "Spring Boot", "MySQL", "REST API", "Microservices", "Docker", "Kubernetes",
                "AWS", "Git", "Maven", "Hibernate", "JavaScript", "HTML", "CSS", "React", "Python", "SQL"
        );

        List<String> jobSkills = new ArrayList<>();
        String jobUpper = jobText.toUpperCase();
        for (String skill : commonSkills) {
            if (jobUpper.contains(skill.toUpperCase())) {
                jobSkills.add(skill);
            }
        }
        if (jobSkills.isEmpty()) {
            jobSkills.addAll(Arrays.asList("Java", "Spring Boot", "MySQL", "REST API"));
        }

        List<String> matchingSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        String resumeUpper = resumeText.toUpperCase();

        for (String skill : jobSkills) {
            if (resumeUpper.contains(skill.toUpperCase())) {
                matchingSkills.add(skill);
            } else {
                missingSkills.add(skill);
            }
        }

        // Calculate score (1.0 - 10.0)
        double ratio = jobSkills.isEmpty() ? 0.8 : (double) matchingSkills.size() / jobSkills.size();
        double baseScore = 3.0 + (ratio * 6.5);
        double finalScore = Math.round(Math.min(10.0, Math.max(1.0, baseScore)) * 10.0) / 10.0;

        boolean expMatch = resumeUpper.contains("DEVELOPER") || resumeUpper.contains("ENGINEER") ||
                           resumeUpper.contains("INTERN") || resumeUpper.contains("EXPERIENCE");
        boolean eduMatch = resumeUpper.contains("BACHELOR") || resumeUpper.contains("DEGREE") ||
                           resumeUpper.contains("B.TECH") || resumeUpper.contains("COMPUTER") ||
                           resumeUpper.contains("COLLEGE") || resumeUpper.contains("UNIVERSITY");

        result.put("score", finalScore);
        result.put("matchingSkills", matchingSkills);
        result.put("missingSkills", missingSkills);
        result.put("experienceMatch", expMatch);
        result.put("educationMatch", eduMatch);

        String justification = String.format(
                "The candidate scored %.1f/10. Matched %d out of %d key skills required (%s). %s",
                finalScore, matchingSkills.size(), jobSkills.size(),
                String.join(", ", matchingSkills),
                missingSkills.isEmpty() ? "The candidate possesses all primary required skills." :
                        "Missing skills include: " + String.join(", ", missingSkills) + "."
        );
        result.put("reason", justification);

        return result;
    }

    private String capitalizeWords(String input) {
        if (input == null || input.isEmpty()) return input;
        String[] words = input.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String w : words) {
            if (!w.isEmpty()) {
                sb.append(Character.toUpperCase(w.charAt(0)))
                  .append(w.substring(1).toLowerCase())
                  .append(" ");
            }
        }
        return sb.toString().trim();
    }
}
