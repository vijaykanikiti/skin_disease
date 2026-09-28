package com.example.skindisease.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageStorageService {

    private final Path uploadDirectory =
            Paths.get("uploads/skin-images");

    public ImageStorageService() throws IOException {

        if (!Files.exists(uploadDirectory)) {
            Files.createDirectories(uploadDirectory);
        }
    }

    public String saveImage(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Image is required");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                (!contentType.equals("image/jpeg")
                && !contentType.equals("image/png")
                && !contentType.equals("image/webp"))) {

            throw new RuntimeException(
                    "Only JPG, PNG and WEBP images are allowed"
            );
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException(
                    "Image size must be less than 10MB"
            );
        }

        String originalName = file.getOriginalFilename();

        String extension = "";

        if (originalName != null &&
                originalName.contains(".")) {

            extension =
                    originalName.substring(
                            originalName.lastIndexOf(".")
                    );
        }

        String fileName =
                UUID.randomUUID() + extension;

        Path target =
                uploadDirectory.resolve(fileName);

        Files.copy(
                file.getInputStream(),
                target,
                StandardCopyOption.REPLACE_EXISTING
        );

        return target.toString();
    }
}