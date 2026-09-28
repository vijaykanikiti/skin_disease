package com.example.skindisease.dto;

public class HuggingFaceResponse {

    private String label;
    private Double score;

    public HuggingFaceResponse() {
    }

    public HuggingFaceResponse(String label, Double score) {
        this.label = label;
        this.score = score;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }
}