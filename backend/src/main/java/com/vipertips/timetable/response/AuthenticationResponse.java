package com.vipertips.timetable.response;

import com.vipertips.timetable.dto.UserDto;
import com.vipertips.timetable.model.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationResponse {
	private String token;
	private String role;
	private String refreshToken;
	private String message;
	private String status;
	private User userData;
}
