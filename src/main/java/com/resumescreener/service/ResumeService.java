package com.resumescreener.service;

import com.resumescreener.dto.ResumeDto;
import com.resumescreener.entity.Resume;
import com.resumescreener.repository.ResumeRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public class ResumeService {

    private final PdfService pdfService;
    private final LlmService llmService;
    private final ResumeRepository resumeRepository;

    public ResumeService(PdfService pdfService, LlmService llmService, ResumeRepository resumeRepository) {
        this.pdfService = pdfService;
        this.llmService = llmService;
        this.resumeRepository = resumeRepository;
    }

    /**
     * Processes an uploaded PDF resume, extracts raw text, extracts structured
     * candidate data using LLM, and persists the entity in MySQL.
     */
    public ResumeDto uploadResume(MultipartFile file) {
        // 1. Extract plain text using PDFBox
        String rawText = pdfService.extractText(file);

        // 2. Extract candidate information using LLM / heuristic service
        Map<String, Object> extractedData = llmService.extractResumeData(rawText);

        String name = String.valueOf(extractedData.getOrDefault("name", "Candidate"));
        String email = String.valueOf(extractedData.getOrDefault("email", "Not Found"));
        String phone = String.valueOf(extractedData.getOrDefault("phone", "Not Found"));

        String skills = formatListOrString(extractedData.get("skills"));
        String experience = formatListOrString(extractedData.get("experience"));
        String education = formatListOrString(extractedData.get("education"));

        // 3. Create & save entity
        Resume resume = new Resume(
                name,
                email,
                phone,
                skills,
                experience,
                education,
                file.getOriginalFilename(),
                rawText
        );

        Resume saved = resumeRepository.save(resume);
        return convertToDto(saved);
    }

    public List<ResumeDto> getAllResumes() {
        return resumeRepository.findAll().stream()
                .map(this::convertToDto)
                .toList();
    }

    public ResumeDto getResumeById(Long id) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found with ID: " + id));
        return convertToDto(resume);
    }

    public Resume getResumeEntityById(Long id) {
        return resumeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found with ID: " + id));
    }

    private ResumeDto convertToDto(Resume resume) {
        ResumeDto dto = new ResumeDto();
        dto.setId(resume.getId());
        dto.setName(resume.getName());
        dto.setEmail(resume.getEmail());
        dto.setPhone(resume.getPhone());
        dto.setSkills(resume.getSkills());
        dto.setExperience(resume.getExperience());
        dto.setEducation(resume.getEducation());
        dto.setFileName(resume.getFileName());
        dto.setRawText(resume.getRawText());
        dto.setCreatedAt(resume.getCreatedAt());
        return dto;
    }

    @SuppressWarnings("unchecked")
    private String formatListOrString(Object obj) {
        if (obj == null) return "";
        if (obj instanceof List) {
            List<String> list = (List<String>) obj;
            return String.join(", ", list);
        }
        return obj.toString();
    }
}
