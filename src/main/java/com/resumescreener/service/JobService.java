package com.resumescreener.service;

import com.resumescreener.dto.JobDto;
import com.resumescreener.entity.Job;
import com.resumescreener.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public JobDto createJob(JobDto jobDto) {
        if (jobDto.getTitle() == null || jobDto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Job title cannot be empty");
        }
        if (jobDto.getDescription() == null || jobDto.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Job description cannot be empty");
        }

        Job job = new Job(
                jobDto.getTitle().trim(),
                jobDto.getDescription().trim(),
                jobDto.getRequiredSkills() != null ? jobDto.getRequiredSkills().trim() : ""
        );

        Job saved = jobRepository.save(job);
        return convertToDto(saved);
    }

    public List<JobDto> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::convertToDto)
                .toList();
    }

    public JobDto getJobById(Long id) {
        Job job = getJobEntityById(id);
        return convertToDto(job);
    }

    public Job getJobEntityById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + id));
    }

    private JobDto convertToDto(Job job) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setCreatedAt(job.getCreatedAt());
        return dto;
    }
}
