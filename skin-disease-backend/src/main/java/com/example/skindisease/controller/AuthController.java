package com.example.skindisease.controller;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.skindisease.dto.GoogleLoginRequest;
import com.example.skindisease.dto.LoginRequest;
import com.example.skindisease.dto.RegisterRequest;
import com.example.skindisease.entity.User;
import com.example.skindisease.service.UserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.skindisease.service.EmailService;

import com.example.skindisease.service.PasswordResetService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

	private final UserService userService;
	private final EmailService emailService;
	private final PasswordResetService passwordResetService;
	
	
    // ==========================================
    // GOOGLE CLIENT ID
    // ==========================================

    @Value("${google.client.id}")
    private String googleClientId;

    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public AuthController(
            UserService userService,
            EmailService emailService,
            PasswordResetService passwordResetService) {

        this.userService = userService;
        this.emailService = emailService;
        this.passwordResetService = passwordResetService;
    }

    // ==========================================
    // REGISTER
    // ==========================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        try {

            User user = userService.register(request);

            // Never send password to frontend
            user.setPassword(null);

            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // ==========================================
    // NORMAL LOGIN
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            User user = userService.login(
                    request.getEmail(),
                    request.getPassword()
            );

            // Never send password to frontend
            user.setPassword(null);

            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // ==========================================
    // GOOGLE LOGIN
    // ==========================================

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(
            @RequestBody GoogleLoginRequest request) {

        try {

            // ------------------------------------------
            // CHECK REQUEST
            // ------------------------------------------

            if (request == null ||
                    request.getCredential() == null ||
                    request.getCredential().isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body("Google credential is required.");
            }

            // ------------------------------------------
            // CHECK CLIENT ID
            // ------------------------------------------

            if (googleClientId == null ||
                    googleClientId.isBlank() ||
                    googleClientId.equals("YOUR_GOOGLE_CLIENT_ID")) {

                return ResponseEntity
                        .internalServerError()
                        .body(
                                "Google Client ID is not configured in application.properties."
                        );
            }

            System.out.println("-----------------------------------");
            System.out.println("Google Login Request Received");
            System.out.println("Google Client ID configured: "
                    + googleClientId);
            System.out.println("-----------------------------------");

            // ------------------------------------------
            // CREATE GOOGLE TOKEN VERIFIER
            // ------------------------------------------

            GoogleIdTokenVerifier verifier =
                    new GoogleIdTokenVerifier.Builder(
                            new NetHttpTransport(),
                            GsonFactory.getDefaultInstance()
                    )
                    .setAudience(
                            Collections.singletonList(
                                    googleClientId
                            )
                    )
                    .build();

            // ------------------------------------------
            // VERIFY GOOGLE CREDENTIAL
            // ------------------------------------------

            GoogleIdToken idToken =
                    verifier.verify(
                            request.getCredential()
                    );

            // ------------------------------------------
            // INVALID TOKEN
            // ------------------------------------------

            if (idToken == null) {

                System.out.println(
                        "Google token verification FAILED."
                );

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Invalid Google credential."
                        );
            }

            // ------------------------------------------
            // GET GOOGLE PAYLOAD
            // ------------------------------------------

            GoogleIdToken.Payload payload =
                    idToken.getPayload();

            String googleId =
                    payload.getSubject();

            String email =
                    payload.getEmail();

            String name =
                    (String) payload.get("name");

            String picture =
                    (String) payload.get("picture");

            Boolean emailVerified =
                    payload.getEmailVerified();

            // ------------------------------------------
            // PRINT GOOGLE USER INFORMATION
            // ------------------------------------------

            System.out.println(
                    "Google ID: " + googleId
            );

            System.out.println(
                    "Google Email: " + email
            );

            System.out.println(
                    "Google Name: " + name
            );

            System.out.println(
                    "Google Picture: " + picture
            );

            System.out.println(
                    "Google Email Verified: "
                            + emailVerified
            );

            // ------------------------------------------
            // CHECK EMAIL
            // ------------------------------------------

            if (email == null || email.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Google account email could not be retrieved."
                        );
            }

            // ------------------------------------------
            // CHECK EMAIL VERIFICATION
            // ------------------------------------------

            if (!Boolean.TRUE.equals(emailVerified)) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Google email is not verified."
                        );
            }

            // ------------------------------------------
            // FIND OR CREATE USER
            // ------------------------------------------

            User user =
                    userService.loginWithGoogle(
                            googleId,
                            email,
                            name,
                            picture
                    );

            // ------------------------------------------
            // NEVER RETURN PASSWORD
            // ------------------------------------------

            user.setPassword(null);

            System.out.println(
                    "Google login successful for: "
                            + email
            );

            System.out.println("-----------------------------------");

            // ------------------------------------------
            // RETURN USER
            // ------------------------------------------

            return ResponseEntity.ok(user);

        } catch (Exception e) {

            System.out.println(
                    "Google login exception:"
            );

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Google login failed: "
                                    + e.getMessage()
                    );
        }
        
    }
    
    
    @GetMapping("/test-email")
    public ResponseEntity<?> testEmail(
            @RequestParam String email) {

        try {

            emailService.sendTestEmail(email);

            return ResponseEntity.ok(
                "Test email sent successfully."
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest()
                    .body(
                        "Email sending failed: "
                        + e.getMessage()
                    );
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody java.util.Map<String, String> request) {

        try {

            String email = request.get("email");

            if (email == null || email.isBlank()) {

                return ResponseEntity.badRequest()
                        .body("Email is required.");
            }

            passwordResetService.sendOtp(email);

            return ResponseEntity.ok(
                    "OTP sent successfully to your email."
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("Failed to send OTP.");
        }
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody java.util.Map<String, String> request) {

        try {

            String email = request.get("email");
            String otp = request.get("otp");

            if (email == null || email.isBlank()) {

                return ResponseEntity.badRequest()
                        .body("Email is required.");
            }

            if (otp == null || otp.isBlank()) {

                return ResponseEntity.badRequest()
                        .body("OTP is required.");
            }

            if (otp.length() != 6) {

                return ResponseEntity.badRequest()
                        .body("OTP must contain 6 digits.");
            }

            passwordResetService.verifyOtp(
                    email,
                    otp
            );

            return ResponseEntity.ok(
                    "OTP verified successfully."
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("OTP verification failed.");
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody java.util.Map<String, String> request) {

        try {

            String email = request.get("email");
            String newPassword = request.get("newPassword");

            if (email == null || email.isBlank()) {

                return ResponseEntity.badRequest()
                        .body("Email is required.");
            }

            if (newPassword == null || newPassword.isBlank()) {

                return ResponseEntity.badRequest()
                        .body("New password is required.");
            }

            if (newPassword.length() < 6) {

                return ResponseEntity.badRequest()
                        .body(
                            "Password must contain at least 6 characters."
                        );
            }

            passwordResetService.resetPassword(
                    email,
                    newPassword
            );

            return ResponseEntity.ok(
                    "Password reset successfully."
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("Password reset failed.");
        }
    }
}