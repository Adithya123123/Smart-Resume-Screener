package com.resumescreener.service;

import com.resumescreener.dto.ResultDto;
import com.resumescreener.entity.Job;
import com.resumescreener.entity.Result;
import com.resumescreener.entity.Resume;
import com.resumescreener.repository.ResultRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ResultService {

    private final ResumeService resumeService;
    private final JobService jobService;
    private final LlmService llmService;
    private final ResultRepository resultRepository;

    public ResultService(ResumeService resumeService, JobService jobService, LlmService llmService, ResultRepository resultRepository) {
        this.resumeService = resumeService;
        this.jobService = jobService;
        this.llmService = llmService;
        this.resultRepository = resultRepository;
    }

    /**
     * Compare a candidate resume against a job description using LLM and save screening result.
     */
    public ResultDto screenResume(Long resumeId, Long jobId) {
        Resume resume = resumeService.getResumeEntityById(resumeId);
        Job job = jobService.getJobEntityById(jobId);

        String jobFullText = "Title: " + job.getTitle() + "\nRequired Skills: " + job.getRequiredSkills() + "\nDescription:\n" + job.getDescription();
        Map<String, Object> screenOutput = llmService.checkResume(resume.getRawText(), jobFullText);

        Double score = parseScore(screenOutput.get("score"));
        String matchingSkills = formatListOrString(screenOutput.get("matchingSkills"));
        String missingSkills = formatListOrString(screenOutput.get("missingSkills"));
        Boolean experienceMatch = parseBoolean(screenOutput.get("experienceMatch"));
        Boolean educationMatch = parseBoolean(screenOutput.get("educationMatch"));
        String reason = String.valueOf(screenOutput.getOrDefault("reason", "Evaluation complete."));

        // Check if result already exists for this resume + job pair
        Result result = resultRepository.findByResumeIdAndJobId(resumeId, jobId);
        if (result == null) {
            result = new Result(resumeId, jobId, score, matchingSkills, missingSkills, experienceMatch, educationMatch, reason);
        } else {
            result.setScore(score);
            result.setMatchingSkills(matchingSkills);
            result.setMissingSkills(missingSkills);
            result.setExperienceMatch(experienceMatch);
            result.setEducationMatch(educationMatch);
            result.setReason(reason);
        }

        Result saved = resultRepository.save(result);
        return convertToDto(saved, resume, job);
    }

    public ResultDto getResultById(Long id) {
        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Result not found with ID: " + id));
        Resume resume = resumeService.getResumeEntityById(result.getResumeId());
        Job job = jobService.getJobEntityById(result.getJobId());
        return convertToDto(result, resume, job);
    }

    public List<ResultDto> getResultsByJobId(Long jobId) {
        Job job = jobService.getJobEntityById(jobId);
        List<Result> results = resultRepository.findByJobIdOrderByScoreDesc(jobId);

        return results.stream().map(result -> {
            Resume resume = resumeService.getResumeEntityById(result.getResumeId());
            return convertToDto(result, resume, job);
        }).toList();
    }

    public List<ResultDto> getAllResults() {
        return resultRepository.findAll().stream().map(result -> {
            Resume resume = resumeService.getResumeEntityById(result.getResumeId());
            Job job = jobService.getJobEntityById(result.getJobId());
            return convertToDto(result, resume, job);
        }).toList();
    }

    private ResultDto convertToDto(Result result, Resume resume, Job job) {
        ResultDto dto = new ResultDto();
        dto.setId(result.getId());
        dto.setResumeId(result.getResumeId());
        dto.setJobId(result.getJobId());
        dto.setScore(result.getScore());
        dto.setMatchingSkills(result.getMatchingSkills());
        dto.setMissingSkills(result.getMissingSkills());
        dto.setExperienceMatch(result.getExperienceMatch());
        dto.setEducationMatch(result.getEducationMatch());
        dto.setReason(result.getReason());
        dto.setCreatedAt(result.getCreatedAt());

        if (resume != null) {
            dto.setCandidateName(resume.getName());
            dto.setCandidateEmail(resume.getEmail());
            dto.setCandidatePhone(resume.getPhone());
        }
        if (job != null) {
            dto.setJobTitle(job.getTitle());
        }
        return dto;
    }

    private Double parseScore(Object scoreObj) {
        if (scoreObj == null) return 5.0;
        try {
            double s = Double.parseDouble(scoreObj.toString());
            return Math.min(10.0, Math.max(1.0, s));
        } catch (Exception e) {
            return 5.0;
        }
    }

    private Boolean parseBoolean(Object boolObj) {
        if (boolObj == null) return true;
        if (boolObj instanceof Boolean) return (Boolean) boolObj;
        return Boolean.parseBoolean(boolObj.toString());
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
