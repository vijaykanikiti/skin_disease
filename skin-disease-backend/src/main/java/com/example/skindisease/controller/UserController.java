package com.example.skindisease.controller;

import com.example.skindisease.entity.User;
import com.example.skindisease.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET PROFILE
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {

        try {

            User user = userService.getUserById(id);

            // Do not send password to React
            user.setPassword(null);

            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // UPDATE PROFILE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateRequest request) {

        try {

            User user = userService.updateUser(
                    id,
                    request.getName(),
                    request.getPhone(),
                    request.getLocation()
            );

            // Do not send password to React
            user.setPassword(null);

            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // UPDATE REQUEST DTO
    public static class UserUpdateRequest {

        private String name;
        private String phone;
        private String location;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }
    }
}