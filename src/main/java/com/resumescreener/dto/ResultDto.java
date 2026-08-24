package com.resumescreener.dto;

import java.time.LocalDateTime;

public class ResultDto {

    private Long id;
    private Long resumeId;
    private Long jobId;
    private Double score;
    private String matchingSkills;
    private String missingSkills;
    private Boolean experienceMatch;
    private Boolean educationMatch;
    private String reason;
    private LocalDateTime createdAt;

    // Additional metadata for display
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;
    private String jobTitle;

    public ResultDto() {
    }

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

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public String getCandidatePhone() {
        return candidatePhone;
    }

    public void setCandidatePhone(String candidatePhone) {
        this.candidatePhone = candidatePhone;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }
}
