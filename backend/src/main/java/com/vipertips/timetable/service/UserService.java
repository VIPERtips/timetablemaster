package com.vipertips.timetable.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.vipertips.timetable.dto.UserDto;
import com.vipertips.timetable.model.User;
import com.vipertips.timetable.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	private UserRepository userRepository;

	public User findByEmail(String email) {
		return userRepository.findByEmail(email).orElseThrow();
	}

	public UserDto updateProfile(UserDto dto, int userId) {
	    User existingUser = getUserBy_Id(userId);

	    if (dto.getFirstName() != null) {
	        existingUser.setFirstName(dto.getFirstName());
	    }
	    if (dto.getLastName() != null) {
	        existingUser.setLastName(dto.getLastName());
	    }
	    if (dto.getBio() != null) {
	        existingUser.setBio(dto.getBio());
	    }
	    
	    if (dto.getSubject() != null) {
	        existingUser.setSubject(dto.getSubject());
	    }
	   

	    userRepository.save(existingUser);

	    return UserDto.builder()
	            .userId(existingUser.getUserId())
	            .firstName(existingUser.getFirstName())
	            .lastName(existingUser.getLastName())
	            .email(existingUser.getEmail())
	            .bio(existingUser.getBio())
				.subject(existingUser.getSubject())
	            .build();
	}


	public UserDto getUserById(int id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

		return UserDto.builder()
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.email(user.getEmail())
				.bio(user.getBio())
				.subject(user.getSubject())
				.build();
	}

	public User getUserBy_Id(int id) {
		return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
	}

	public void deleteUserById(int id) {
		if (!userRepository.existsById(id)) {
			throw new RuntimeException("User not found with ID: " + id);
		}
		userRepository.deleteById(id);
	}

	public UserDto getUserByUsername(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found for username " + email));
		return UserDto.builder()
				.userId(user.getUserId())
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.bio(user.getBio())
				.subject(user.getSubject())
				.email(user.getEmail())
				.build();
		
	}
}
