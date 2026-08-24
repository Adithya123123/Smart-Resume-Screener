package com.resumescreener.repository;

import com.resumescreener.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {

    // Retrieve screening results for a given job ordered by score descending
    List<Result> findByJobIdOrderByScoreDesc(Long jobId);

    // Optional check if a result already exists for resume and job
    Result findByResumeIdAndJobId(Long resumeId, Long jobId);
}
