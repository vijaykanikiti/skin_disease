package com.example.skindisease.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.skindisease.dto.RegisterRequest;
import com.example.skindisease.entity.User;
import com.example.skindisease.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ==========================================
    // REGISTER
    // ==========================================

    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setPhone(request.getPhone());
        user.setLocation(request.getLocation());
        user.setRole("USER");

        return userRepository.save(user);
    }

    // ==========================================
    // NORMAL LOGIN
    // ==========================================

    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    // ==========================================
    // GOOGLE LOGIN
    // ==========================================

    public User loginWithGoogle(
            String googleId,
            String email,
            String name,
            String picture) {

        // ------------------------------------------
        // Check whether email already exists
        // ------------------------------------------

        User user = userRepository.findByEmail(email)
                .orElse(null);

        // ------------------------------------------
        // Existing user
        // ------------------------------------------

        if (user != null) {

            System.out.println(
                    "Existing user found: " + email
            );

            return user;
        }

        // ------------------------------------------
        // New Google user
        // ------------------------------------------

        System.out.println(
                "Creating new Google user: " + email
        );

        User newUser = new User();

        newUser.setName(
                name != null && !name.isBlank()
                        ? name
                        : "Google User"
        );

        newUser.setEmail(email);

        /*
         * Password cannot be null because the User entity
         * has nullable = false.
         *
         * This password is only an internal value for
         * Google-created accounts.
         */
        newUser.setPassword(
                UUID.randomUUID().toString()
        );

        newUser.setPhone(null);

        newUser.setLocation(null);

        newUser.setRole("USER");

        return userRepository.save(newUser);
    }

    // ==========================================
    // GET USER BY ID
    // ==========================================

    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    // ==========================================
    // UPDATE USER
    // ==========================================

    public User updateUser(
            Long id,
            String name,
            String phone,
            String location) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setName(name);
        user.setPhone(phone);
        user.setLocation(location);

        return userRepository.save(user);
    }
}