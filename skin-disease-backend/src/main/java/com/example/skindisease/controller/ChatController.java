package com.example.skindisease.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.skindisease.dto.ChatRequest;
import com.example.skindisease.dto.ChatResponse;
import com.example.skindisease.service.ChatService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(
            @RequestBody ChatRequest request) {

        String response =
                chatService.generateResponse(
                        request.getMessage()
                );

        return ResponseEntity.ok(
                new ChatResponse(response)
        );
    }
}