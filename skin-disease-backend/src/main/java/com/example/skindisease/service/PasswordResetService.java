package com.example.skindisease.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.skindisease.entity.PasswordResetOtp;
import com.example.skindisease.entity.User;
import com.example.skindisease.repository.PasswordResetOtpRepository;
import com.example.skindisease.repository.UserRepository;

@Service
public class PasswordResetService {

    private final PasswordResetOtpRepository otpRepository;

    private final UserRepository userRepository;

    private final EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    public PasswordResetService(
            PasswordResetOtpRepository otpRepository,
            UserRepository userRepository,
            EmailService emailService) {

        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }


    // =========================================================
    // SEND OTP
    // =========================================================

    @Transactional
    public void sendOtp(String email) {

        // Remove unnecessary spaces
        email = email.trim().toLowerCase();


        // Check whether user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException(
                        "No account found with this email."
                    )
                );


        // Delete previous OTP
        otpRepository.deleteByEmail(email);


        // Generate 6-digit OTP
        String otp = String.format(
                "%06d",
                secureRandom.nextInt(1000000)
        );


        // OTP expires after 5 minutes
        LocalDateTime expiresAt =
                LocalDateTime.now().plusMinutes(5);


        // Create OTP record
        PasswordResetOtp passwordResetOtp =
                new PasswordResetOtp(
                        email,
                        otp,
                        expiresAt
                );


        // Save OTP in database
        otpRepository.save(passwordResetOtp);


        // Send OTP through SMTP
        emailService.sendOtpEmail(
                email,
                otp
        );
    }


    // =========================================================
    // VERIFY OTP
    // =========================================================

    @Transactional
    public boolean verifyOtp(
            String email,
            String enteredOtp) {

        email = email.trim().toLowerCase();


        // Find latest OTP
        PasswordResetOtp resetOtp =
                otpRepository
                    .findTopByEmailOrderByIdDesc(email)
                    .orElseThrow(() ->
                        new RuntimeException(
                            "No OTP found. Please request a new OTP."
                        )
                    );


        // Check whether OTP is already verified
        if (resetOtp.isVerified()) {

            throw new RuntimeException(
                "OTP has already been verified."
            );
        }


        // Check OTP expiration
        if (LocalDateTime.now().isAfter(
                resetOtp.getExpiresAt())) {

            throw new RuntimeException(
                "OTP has expired. Please request a new OTP."
            );
        }


        // Check OTP value
        if (!resetOtp.getOtp().equals(enteredOtp)) {

            throw new RuntimeException(
                "Invalid OTP. Please enter the correct OTP."
            );
        }


        // Mark OTP as verified
        resetOtp.setVerified(true);


        // Save verification status
        otpRepository.save(resetOtp);


        return true;
    }


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    @Transactional
    public void resetPassword(
            String email,
            String newPassword) {

        email = email.trim().toLowerCase();


        // Find latest OTP
        PasswordResetOtp resetOtp =
                otpRepository
                    .findTopByEmailOrderByIdDesc(email)
                    .orElseThrow(() ->
                        new RuntimeException(
                            "OTP verification required."
                        )
                    );


        // Check whether OTP was verified
        if (!resetOtp.isVerified()) {

            throw new RuntimeException(
                "Please verify the OTP first."
            );
        }


        // Check OTP expiration
        if (LocalDateTime.now().isAfter(
                resetOtp.getExpiresAt())) {

            throw new RuntimeException(
                "OTP has expired. Please request a new OTP."
            );
        }


        // Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException(
                        "User not found."
                    )
                );


        // Update password
        user.setPassword(newPassword);


        // Save new password
        userRepository.save(user);


        // Delete OTP after successful password reset
        otpRepository.deleteByEmail(email);
    }
}