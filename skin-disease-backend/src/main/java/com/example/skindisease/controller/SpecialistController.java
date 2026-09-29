package com.example.skindisease.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.skindisease.entity.Specialist;
import com.example.skindisease.repository.SpecialistRepository;

@RestController
@RequestMapping("/api/specialists")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class SpecialistController {

    private final SpecialistRepository specialistRepository;

    public SpecialistController(SpecialistRepository specialistRepository) {
        this.specialistRepository = specialistRepository;
    }

    @GetMapping
    public List<Specialist> getAllSpecialists() {
        return specialistRepository.findAll();
    }

    @GetMapping("/specialization/{specialization}")
    public List<Specialist> getBySpecialization(
            @PathVariable String specialization) {

        return specialistRepository
                .findBySpecializationIgnoreCase(specialization);
    }

    @PostMapping
    public Specialist addSpecialist(
            @RequestBody Specialist specialist) {

        return specialistRepository.save(specialist);
    }
}