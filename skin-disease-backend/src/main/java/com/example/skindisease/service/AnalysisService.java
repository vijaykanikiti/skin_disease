package com.example.skindisease.service;

import com.example.skindisease.dto.AnalysisResponse;
import com.example.skindisease.dto.HuggingFaceResponse;
import com.example.skindisease.entity.Analysis;
import com.example.skindisease.entity.User;
import com.example.skindisease.repository.AnalysisRepository;
import com.example.skindisease.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class AnalysisService {

    private final AnalysisRepository analysisRepository;
    private final UserRepository userRepository;
    private final ImageStorageService imageStorageService;
    private final HuggingFaceService huggingFaceService;

    public AnalysisService(
            AnalysisRepository analysisRepository,
            UserRepository userRepository,
            ImageStorageService imageStorageService,
            HuggingFaceService huggingFaceService) {

        this.analysisRepository = analysisRepository;
        this.userRepository = userRepository;
        this.imageStorageService = imageStorageService;
        this.huggingFaceService = huggingFaceService;
    }

    // =========================================================
    // ANALYZE SKIN IMAGE
    // =========================================================

    public AnalysisResponse analyze(
            Long userId,
            MultipartFile image) throws Exception {

        // 1. Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 2. Validate image
        if (image == null || image.isEmpty()) {
            throw new RuntimeException("Skin image is required");
        }

        // 3. Save image locally
        String imagePath =
                imageStorageService.saveImage(image);

        // 4. Send image to Hugging Face
        HuggingFaceResponse aiResult =
                huggingFaceService.analyzeImage(image);

        if (aiResult == null) {
            throw new RuntimeException(
                    "No prediction received from Hugging Face");
        }

        // 5. Create Analysis entity
        Analysis analysis = new Analysis();

        analysis.setUser(user);

        analysis.setImageName(
                image.getOriginalFilename()
        );

        analysis.setImagePath(imagePath);

        // 6. Save AI classification
        analysis.setConditionName(
                formatConditionName(
                        aiResult.getLabel()
                )
        );

        // Hugging Face score is 0.0 - 1.0
        // Database stores confidence as 0 - 100
        analysis.setConfidence(
                aiResult.getScore() * 100
        );

        // 7. Educational information
        analysis.setInformation(
                getInformation(
                        aiResult.getLabel()
                )
        );

        analysis.setSymptoms(
                getSymptoms(
                        aiResult.getLabel()
                )
        );

        analysis.setWarningSigns(
                getWarningSigns(
                        aiResult.getLabel()
                )
        );

        analysis.setPrevention(
                getPrevention(
                        aiResult.getLabel()
                )
        );

        // 8. Status
        analysis.setStatus("COMPLETED");

        // 9. Save to MySQL
        Analysis saved =
                analysisRepository.save(analysis);

        // 10. Return response
        return convertToResponse(saved);
    }


    // =========================================================
    // GET USER HISTORY
    // =========================================================

    public List<AnalysisResponse> getUserHistory(
            Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return analysisRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // GET SINGLE ANALYSIS
    // =========================================================

    public AnalysisResponse getAnalysis(Long id) {

        Analysis analysis =
                analysisRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Analysis not found"
                                ));

        return convertToResponse(analysis);
    }


    // =========================================================
    // DELETE ANALYSIS
    // =========================================================

    public void deleteAnalysis(Long id) {

        if (!analysisRepository.existsById(id)) {

            throw new RuntimeException(
                    "Analysis not found"
            );
        }

        analysisRepository.deleteById(id);
    }


    // =========================================================
    // FORMAT CONDITION NAME
    // =========================================================

    private String formatConditionName(
            String label) {

        if (label == null || label.isBlank()) {

            return "Uncertain / Needs Professional Review";
        }

        return label
                .replace("_", " ")
                .replace("-", " ");
    }


    // =========================================================
    // CONDITION INFORMATION
    // =========================================================

    private String getInformation(
            String label) {

        if (label == null) {

            return "No condition information is available.";
        }

        switch (label) {

            case "melanocytic_Nevi":

                return "Melanocytic nevi are commonly known "
                        + "as moles. They are collections of "
                        + "pigment-producing cells. Changes in "
                        + "a mole should be evaluated by a "
                        + "qualified healthcare professional.";

            case "melanoma":

                return "Melanoma is a type of skin cancer "
                        + "involving pigment-producing cells. "
                        + "An AI classification cannot confirm "
                        + "melanoma. Professional medical "
                        + "evaluation is important when "
                        + "melanoma is suspected.";

            case "basal_cell_carcinoma":

                return "Basal cell carcinoma is a common "
                        + "type of skin cancer. It can appear "
                        + "as a persistent skin growth or "
                        + "changing lesion. Professional "
                        + "evaluation is recommended.";

            case "actinic_keratoses":

                return "Actinic keratoses are rough or "
                        + "scaly skin changes often associated "
                        + "with long-term sun exposure. "
                        + "A healthcare professional should "
                        + "evaluate suspicious or persistent "
                        + "lesions.";

            case "benign_keratosis-like_lesions":

                return "This category represents lesions "
                        + "classified by the model as benign "
                        + "keratosis-like lesions. Clinical "
                        + "examination is required to determine "
                        + "the actual nature of a skin lesion.";

            case "vascular_lesions":

                return "Vascular lesions involve blood "
                        + "vessels in the skin. Their appearance "
                        + "can vary significantly, and "
                        + "professional assessment may be "
                        + "necessary.";

            case "dermatofibroma":

                return "Dermatofibromas are commonly benign "
                        + "skin growths. A healthcare professional "
                        + "should evaluate any new or changing "
                        + "skin lesion.";

            default:

                return "The AI model classified this image "
                        + "as " + formatConditionName(label)
                        + ". This result is for educational "
                        + "purposes only and does not establish "
                        + "a medical diagnosis.";
        }
    }


    // =========================================================
    // SYMPTOMS
    // =========================================================

    private String getSymptoms(
            String label) {

        if (label == null) {

            return "Unable to provide condition-specific "
                    + "information.";
        }

        switch (label) {

            case "melanoma":

                return "Possible warning features can include "
                        + "changes in size, shape, color, or "
                        + "appearance of a mole or lesion.";

            case "basal_cell_carcinoma":

                return "Possible features include a persistent "
                        + "skin growth, sore, shiny area, or "
                        + "lesion that changes over time.";

            case "actinic_keratoses":

                return "Possible features include rough, dry, "
                        + "scaly, or crust-like patches on "
                        + "sun-exposed skin.";

            case "melanocytic_Nevi":

                return "Moles can vary in color, size, and "
                        + "shape. Changes in an existing mole "
                        + "should be evaluated.";

            case "vascular_lesions":

                return "Vascular lesions may appear as visible "
                        + "red, purple, or other blood-vessel "
                        + "related changes in the skin.";

            case "dermatofibroma":

                return "Dermatofibromas commonly appear as "
                        + "firm skin growths. A healthcare "
                        + "professional can evaluate a "
                        + "persistent or changing lesion.";

            default:

                return "Symptoms vary depending on the "
                        + "condition. Professional assessment "
                        + "is recommended.";
        }
    }


    // =========================================================
    // WARNING SIGNS
    // =========================================================

    private String getWarningSigns(
            String label) {

        return "Seek professional medical evaluation for "
                + "a lesion that is rapidly changing, bleeding, "
                + "repeatedly crusting, painful, non-healing, "
                + "or otherwise concerning.";
    }


    // =========================================================
    // PREVENTION
    // =========================================================

    private String getPrevention(
            String label) {

        return "Protect skin from excessive ultraviolet "
                + "exposure, use appropriate sun protection, "
                + "avoid tanning beds, and regularly observe "
                + "existing and new skin lesions. Consult a "
                + "qualified healthcare professional for "
                + "concerning changes.";
    }


    // =========================================================
    // CONVERT ENTITY TO RESPONSE
    // =========================================================

    private AnalysisResponse convertToResponse(
            Analysis analysis) {

        AnalysisResponse response =
                new AnalysisResponse();

        response.setId(
                analysis.getId()
        );

        response.setImageName(
                analysis.getImageName()
        );

        response.setConditionName(
                analysis.getConditionName()
        );

        response.setConfidence(
                analysis.getConfidence()
        );

        response.setInformation(
                analysis.getInformation()
        );

        response.setSymptoms(
                analysis.getSymptoms()
        );

        response.setWarningSigns(
                analysis.getWarningSigns()
        );

        response.setPrevention(
                analysis.getPrevention()
        );

        response.setStatus(
                analysis.getStatus()
        );

        response.setCreatedAt(
                analysis.getCreatedAt()
        );

        return response;
    }
}