package com.example.skindisease.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.skindisease.entity.Specialist;

public interface SpecialistRepository
        extends JpaRepository<Specialist, Long> {

    List<Specialist> findBySpecializationIgnoreCase(
            String specialization
    );
}