package com.example.skindisease.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.skindisease.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}