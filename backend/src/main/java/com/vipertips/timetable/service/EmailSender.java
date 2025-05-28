package com.vipertips.timetable.service;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.charset.*;

@Service
public class EmailSender {

    @Autowired
    private JavaMailSender javaMailSender;

    private static final String SUPPORT_EMAIL = "support@timetable.zim";
    private static final String APP_NAME = "Timetable Pro";
    private static final String ACTION_LINK = "https://timetable.zim";
    private static final String ADMIN_EMAIL = "admin@timetable.zim";

    public void sendEmail(String toEmail, String subject, String username, String messageBody, String actionText) {
        try {
            // Load the HTML template
            String htmlTemplate = loadEmailTemplate();

            // Replacing placeholders
            String htmlBody = htmlTemplate
                    .replace("${subject}", subject)
                    .replace("${username}", username)
                    .replace("${message}", messageBody)
                    .replace("${actionLink}", ACTION_LINK)
                    .replace("${actionText}", actionText)
                    .replace("${appName}", APP_NAME);

            // Prepare email
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(new InternetAddress(SUPPORT_EMAIL, APP_NAME));
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            // Send
            javaMailSender.send(message);
            System.out.println("Email sent successfully to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String userEmail, String username) {
        String subject = APP_NAME + " - Welcome to Your Timetable!";
        String messageBody = "Thanks for signing up! Start organizing your schedule with ease.";
        String actionText = "Get Started";
        sendEmail(userEmail, subject, username, messageBody, actionText);
    }

    public void sendAdminNotification(String userEmail, String username) {
        String subject = APP_NAME + " - New User Registered";
        String messageBody = "A new user just signed up: " + username + " (" + userEmail + ")";
        String actionText = "Review Users";
        sendEmail(ADMIN_EMAIL, subject, "Admin", messageBody, actionText);
    }
    
    public void sendLessonReminderEmail(String userEmail, String username, String lessonName, String lessonTime, int minutesBefore) {
        String subject = APP_NAME + " - Lesson Reminder";
        String messageBody = String.format(
            "Hey %s, your lesson <strong>%s</strong> starts at <strong>%s</strong>. " +
            "Only %d minutes left! Get ready to slay that class.",
            username, lessonName, lessonTime, minutesBefore
        );
        String actionText = "View Timetable";

        sendEmail(userEmail, subject, username, messageBody, actionText);
    }


    private String loadEmailTemplate() throws IOException {
        Path templatePath = new ClassPathResource("templates/email-template.html").getFile().toPath();
        return Files.readString(templatePath, StandardCharsets.UTF_8);
    }
}
