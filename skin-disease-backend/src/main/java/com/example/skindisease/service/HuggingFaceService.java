package com.example.skindisease.service;

import com.example.skindisease.dto.HuggingFaceResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@Service
public class HuggingFaceService {

    private static final String MODEL =
            "Anwarkh1/Skin_Cancer-Image_Classification";

    private static final String API_URL =
            "https://router.huggingface.co/hf-inference/models/"
            + MODEL;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public HuggingFaceService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public HuggingFaceResponse analyzeImage(
            MultipartFile image) throws Exception {

        String token = System.getenv("HF_TOKEN");

        if (token == null || token.isBlank()) {
            throw new RuntimeException(
                    "HF_TOKEN environment variable is not configured"
            );
        }

        if (image == null || image.isEmpty()) {
            throw new RuntimeException("Image is required");
        }

        byte[] imageBytes = image.getBytes();

        String contentType = image.getContentType();

        if (contentType == null) {
            contentType = "image/jpeg";
        }

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL))
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", contentType)
                .POST(HttpRequest.BodyPublishers.ofByteArray(imageBytes))
                .build();

        HttpResponse<String> response =
                httpClient.send(
                        request,
                        HttpResponse.BodyHandlers.ofString()
                );

        System.out.println(
                "Hugging Face HTTP Status: "
                + response.statusCode()
        );

        System.out.println(
                "Hugging Face Response: "
                + response.body()
        );

        if (response.statusCode() != 200) {
            throw new RuntimeException(
                    "Hugging Face API error: "
                    + response.body()
            );
        }

        List<HuggingFaceResponse> results =
                objectMapper.readValue(
                        response.body(),
                        new TypeReference<List<HuggingFaceResponse>>() {}
                );

        if (results == null || results.isEmpty()) {
            throw new RuntimeException(
                    "Hugging Face returned no prediction"
            );
        }

        return results.get(0);
    }
}