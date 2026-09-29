package com.example.skindisease.controller;

import com.example.skindisease.entity.Analysis;
import com.example.skindisease.entity.User;
import com.example.skindisease.repository.AnalysisRepository;
import com.example.skindisease.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class AdminController {

    private final UserRepository userRepository;
    private final AnalysisRepository analysisRepository;

    public AdminController(
            UserRepository userRepository,
            AnalysisRepository analysisRepository) {

        this.userRepository = userRepository;
        this.analysisRepository = analysisRepository;
    }

    // ==========================================
    // DASHBOARD STATISTICS
    // ==========================================

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {

        long totalUsers = userRepository.count();

        long totalAnalyses = analysisRepository.count();

        long completedAnalyses =
                analysisRepository.findAll()
                        .stream()
                        .filter(a ->
                                a.getStatus() != null &&
                                a.getStatus()
                                  .equalsIgnoreCase("COMPLETED"))
                        .count();

        return ResponseEntity.ok(
                Map.of(
                        "totalUsers", totalUsers,
                        "totalAnalyses", totalAnalyses,
                        "completedAnalyses", completedAnalyses
                )
        );
    }


    // ==========================================
    // ALL USERS
    // ==========================================

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {

        List<User> users =
                userRepository.findAll();

        users.forEach(user ->
                user.setPassword(null)
        );

        return ResponseEntity.ok(users);
    }


    // ==========================================
    // ALL ANALYSES
    // ==========================================

    @GetMapping("/analyses")
    public ResponseEntity<List<Analysis>> getAnalyses() {

        return ResponseEntity.ok(
                analysisRepository.findAll()
        );
    }


    // ==========================================
    // DELETE USER
    // ==========================================

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id) {

        if (!userRepository.existsById(id)) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        userRepository.deleteById(id);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "User deleted successfully"
                )
        );
    }


    // ==========================================
    // DELETE ANALYSIS
    // ==========================================

    @DeleteMapping("/analyses/{id}")
    public ResponseEntity<?> deleteAnalysis(
            @PathVariable Long id) {

        if (!analysisRepository.existsById(id)) {

            return ResponseEntity
                    .badRequest()
                    .body("Analysis not found");
        }

        analysisRepository.deleteById(id);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Analysis deleted successfully"
                )
        );
    }
}