package com.example.skindisease.controller;

import com.example.skindisease.dto.DoctorResponse;
import com.example.skindisease.dto.DoctorSearchRequest;
import com.example.skindisease.service.DoctorSearchService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

    private final DoctorSearchService doctorSearchService;

    public DoctorController(
            DoctorSearchService doctorSearchService) {

        this.doctorSearchService =
                doctorSearchService;
    }

    @PostMapping("/nearby")
    public ResponseEntity<List<DoctorResponse>> findNearbyDoctors(
            @RequestBody DoctorSearchRequest request) {

        List<DoctorResponse> doctors =
                doctorSearchService.findNearbyDoctors(
                        request.getLatitude(),
                        request.getLongitude(),
                        request.getSpecialistType()
                );

        return ResponseEntity.ok(doctors);
    }
}