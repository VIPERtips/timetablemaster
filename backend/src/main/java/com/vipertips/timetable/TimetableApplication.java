package com.vipertips.timetable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.vipertips.timetable.service.EmailSender;

@SpringBootApplication
@EnableScheduling
public class TimetableApplication {

	private final EmailSender emailSender;

	@Autowired
	public TimetableApplication(EmailSender emailSender) {
		this.emailSender = emailSender;
	}

	public static void main(String[] args) {
		SpringApplication.run(TimetableApplication.class, args);
	}

	@Bean
	public CommandLineRunner testSendEmail() {
		return args -> {

//			emailSender.sendWelcomeEmail("youngtips23@gmail.com", "Viper");
//
//			emailSender.sendAdminNotification("youngtips23@gmail.com", "Viper");
//
//			emailSender.sendLessonReminderEmail("youngtips23@gmail.com", "Viper", "Math 101", "2:00 PM", 30);
		};
	}
}
