package com.vipertips.timetable.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.vipertips.timetable.dto.LoginDto;
import com.vipertips.timetable.dto.UserDto;
import com.vipertips.timetable.model.User;
import com.vipertips.timetable.model.User.Role;
import com.vipertips.timetable.repository.UserRepository;
import com.vipertips.timetable.response.AuthenticationResponse;

@Service
public class AuthenticationService {
	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private EmailSender emailSender;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtService jwtService;

	public AuthenticationResponse registerUser(UserDto req) {
		if (req.getPassword().isEmpty()) {
			throw new RuntimeException("Passwords is required");
		}

		if (req.getEmail().isEmpty()) {
			throw new RuntimeException("Email is required");
		}

		if (userRepository.existsByEmail(req.getEmail())) {
			throw new RuntimeException("Oops, email taken. Enter a unique email.");
		}

		User user = User.builder()
				.password(passwordEncoder.encode(req.getPassword()))
				.firstName(req.getFirstName())
				.lastName(req.getLastName())
				.email(req.getEmail())
				.role(Role.TEACHER)
				.build();
		
		//save user to db or create user in db
		userRepository.save(user);
		
		//initialize fullname
		String fullname= req.getFirstName() + " " + req.getLastName();
		
		emailSender.sendWelcomeEmail(user.getEmail(), fullname);
		emailSender.sendAdminNotification(user.getEmail(), fullname);

		String token = jwtService.generateToken(user);
		String refreshToken = jwtService.generateRefreshToken(user);

		AuthenticationResponse authResponse = AuthenticationResponse.builder()
				.role(user.getRole().name())
				.token(token)
				.refreshToken(refreshToken)
				.build();
		
		return authResponse;
	}

	public AuthenticationResponse authenticate(LoginDto req) {
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

		User user = userRepository.findByEmail(req.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));

		String token = jwtService.generateToken(user);
		String refreshToken = jwtService.generateRefreshToken(user);
		AuthenticationResponse authResponse = AuthenticationResponse.builder()
				.role(user.getRole().name())
				.token(token)
				.refreshToken(refreshToken)
				.userData(user)
				.build();

		return authResponse;
	}

	public AuthenticationResponse refreshToken(String refreshToken) {
		String username = jwtService.extractUsername(refreshToken);
		User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));

		if (!jwtService.isValid(refreshToken, user)) {
			throw new RuntimeException("Invalid refresh token");
		}

		String newAccessToken = jwtService.generateToken(user);

		AuthenticationResponse authResponse = AuthenticationResponse.builder()
				.role(user.getRole().name())
				.token(newAccessToken)
				.refreshToken(refreshToken)
				.build();
		return authResponse;
	}
}
