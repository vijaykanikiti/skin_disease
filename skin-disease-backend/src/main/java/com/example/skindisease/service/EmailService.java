package com.example.skindisease.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Existing SMTP test email
    public void sendTestEmail(String to) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);

        message.setSubject(
            "SkinAI - SMTP Test Email"
        );

        message.setText(
            "Hello,\n\n"
            + "This is a test email from your "
            + "Skin Disease AI application.\n\n"
            + "SMTP is working successfully.\n\n"
            + "SkinAI"
        );

        mailSender.send(message);
    }

    // Password reset OTP email
    public void sendOtpEmail(String to, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);

        message.setSubject(
            "SkinAI - Password Reset OTP"
        );

        message.setText(
            "Hello,\n\n"
            + "You requested to reset your password "
            + "for SkinAI.\n\n"
            + "Your Password Reset OTP is:\n\n"
            + otp
            + "\n\n"
            + "This OTP is valid for 5 minutes.\n\n"
            + "If you did not request a password reset, "
            + "please ignore this email.\n\n"
            + "Regards,\n"
            + "SkinAI Team"
        );

        mailSender.send(message);
    }
}