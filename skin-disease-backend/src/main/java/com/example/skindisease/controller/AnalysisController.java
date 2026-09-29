package com.example.skindisease.controller;

import com.example.skindisease.dto.AnalysisResponse;
import com.example.skindisease.service.AnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(
            AnalysisService analysisService) {

        this.analysisService = analysisService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyze(
            @RequestParam("userId") Long userId,
            @RequestParam("image") MultipartFile image) {

        try {

            AnalysisResponse response =
                    analysisService.analyze(
                            userId,
                            image
                    );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserHistory(
            @PathVariable Long userId) {

        try {

            List<AnalysisResponse> history =
                    analysisService.getUserHistory(
                            userId
                    );

            return ResponseEntity.ok(history);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAnalysis(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    analysisService.getAnalysis(id)
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnalysis(
            @PathVariable Long id) {

        try {

            analysisService.deleteAnalysis(id);

            return ResponseEntity.ok(
                    "Analysis deleted successfully"
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}