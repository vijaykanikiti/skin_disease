package com.example.skindisease.controller;

import com.example.skindisease.service.ImageStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class ImageUploadController {

    private final ImageStorageService imageStorageService;

    public ImageUploadController(
            ImageStorageService imageStorageService) {

        this.imageStorageService = imageStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("image") MultipartFile image) {

        try {

            String path =
                    imageStorageService.saveImage(image);

            return ResponseEntity.ok(
                    "Image uploaded successfully: " + path
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}