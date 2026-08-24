package com.resumescreener.service;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class LlmServiceTest {

    private final LlmService llmService = new LlmService();

    @Test
    void testExtractResumeDataFallback() {
        String sampleResumeText = """
                Alex Morgan
                alex.morgan@gmail.com
                +1 555-0199
                
                Skills: Java, Spring Boot, MySQL, REST API, Microservices
                Experience: Senior Java Developer - 3 years experience at TechCorp
                Education: B.Tech Computer Science
                """;

        Map<String, Object> data = llmService.extractResumeData(sampleResumeText);

        assertNotNull(data);
        assertEquals("alex.morgan@gmail.com", data.get("email"));
        assertTrue(data.get("skills").toString().contains("Java"));
        assertTrue(data.get("skills").toString().contains("Spring Boot"));
    }

    @Test
    void testCheckResumeFallback() {
        String resumeText = "Java Developer skilled in Java, Spring Boot, MySQL, and REST API.";
        String jobText = "Required Skills: Java, Spring Boot, MySQL, Microservices, Docker";

        Map<String, Object> result = llmService.checkResume(resumeText, jobText);

        assertNotNull(result);
        assertTrue(result.containsKey("score"));
        double score = Double.parseDouble(result.get("score").toString());
        assertTrue(score >= 1.0 && score <= 10.0);
        assertNotNull(result.get("reason"));
    }
}
