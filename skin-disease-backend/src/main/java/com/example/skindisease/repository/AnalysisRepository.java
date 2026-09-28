package com.example.skindisease.repository;

import com.example.skindisease.entity.Analysis;
import com.example.skindisease.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnalysisRepository extends JpaRepository<Analysis, Long> {

    List<Analysis> findByUserOrderByCreatedAtDesc(User user);

    long countByUser(User user);
}