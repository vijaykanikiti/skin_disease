package com.example.skindisease.service;

import org.springframework.stereotype.Service;

@Service
public class ChatService {

    public String generateResponse(String message) {

        if (message == null || message.trim().isEmpty()) {
            return "Please enter a question.";
        }

        String question = message.toLowerCase().trim();

        if (question.contains("eczema")) {

            return "Eczema is a skin condition that can cause "
                    + "dryness, itching, redness and irritation. "
                    + "For an accurate diagnosis and treatment, "
                    + "please consult a qualified dermatologist.";

        }

        if (question.contains("acne")) {

            return "Acne is a common skin condition that can "
                    + "cause pimples, blackheads and whiteheads. "
                    + "A dermatologist can recommend appropriate "
                    + "treatment based on your skin condition.";

        }

        if (question.contains("psoriasis")) {

            return "Psoriasis is a chronic skin condition that "
                    + "can cause patches of thick, scaly skin. "
                    + "A dermatologist should evaluate the condition "
                    + "and recommend appropriate treatment.";

        }

        if (question.contains("doctor")
                || question.contains("dermatologist")
                || question.contains("specialist")) {

            return "A dermatologist is the appropriate medical "
                    + "specialist for evaluating skin conditions. "
                    + "You should consult a qualified dermatologist "
                    + "for professional assessment.";

        }

        if (question.contains("precaution")
                || question.contains("care")
                || question.contains("what should i do")) {

            return "For general skin care, keep the skin clean and "
                    + "moisturized, avoid products that irritate your "
                    + "skin, and protect exposed skin from excessive "
                    + "sun exposure. If symptoms persist or worsen, "
                    + "consult a dermatologist.";

        }

        return "I can help with general information about skin "
                + "conditions, skin care and when to consult a "
                + "dermatologist. Please ask me a specific question.";
    }
}