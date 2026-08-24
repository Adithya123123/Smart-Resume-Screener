package com.resumescreener.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "results")
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long resumeId;
    private Long jobId;
    private Double score;

    @Column(columnDefinition = "TEXT")
    private String matchingSkills;

    @Column(columnDefinition = "TEXT")
    private String missingSkills;

    private Boolean experienceMatch;
    private Boolean educationMatch;

    @Column(columnDefinition = "TEXT")
    private String reason;

    private LocalDateTime createdAt;

    public Result() {
        this.createdAt = LocalDateTime.now();
    }

    public Result(Long resumeId, Long jobId, Double score, String matchingSkills, String missingSkills, Boolean experienceMatch, Boolean educationMatch, String reason) {
        this.resumeId = resumeId;
        this.jobId = jobId;
        this.score = score;
        this.matchingSkills = matchingSkills;
        this.missingSkills = missingSkills;
        this.experienceMatch = experienceMatch;
        this.educationMatch = educationMatch;
        this.reason = reason;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getMatchingSkills() {
        return matchingSkills;
    }

    public void setMatchingSkills(String matchingSkills) {
        this.matchingSkills = matchingSkills;
    }

    public String getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(String missingSkills) {
        this.missingSkills = missingSkills;
    }

    public Boolean getExperienceMatch() {
        return experienceMatch;
    }

    public void setExperienceMatch(Boolean experienceMatch) {
        this.experienceMatch = experienceMatch;
    }

    public Boolean getEducationMatch() {
        return educationMatch;
    }

    public void setEducationMatch(Boolean educationMatch) {
        this.educationMatch = educationMatch;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
