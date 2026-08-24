package com.resumescreener.controller;

import com.resumescreener.dto.ResultDto;
import com.resumescreener.service.ResultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @PostMapping("/screen/{resumeId}/{jobId}")
    public ResponseEntity<ResultDto> screenResume(
            @PathVariable Long resumeId,
            @PathVariable Long jobId) {
        ResultDto result = resultService.screenResume(resumeId, jobId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultDto> getResultById(@PathVariable Long id) {
        return ResponseEntity.ok(resultService.getResultById(id));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ResultDto>> getResultsByJobId(@PathVariable Long jobId) {
        return ResponseEntity.ok(resultService.getResultsByJobId(jobId));
    }

    @GetMapping
    public ResponseEntity<List<ResultDto>> getAllResults() {
        return ResponseEntity.ok(resultService.getAllResults());
    }
}
