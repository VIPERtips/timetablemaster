package com.vipertips.timetable.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vipertips.timetable.dto.UserDto;
import com.vipertips.timetable.response.ApiResponse;
import com.vipertips.timetable.service.JwtService;
import com.vipertips.timetable.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    private String extractToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        return (token != null && token.startsWith("Bearer ")) ? token.substring(7) : null;
    }

    @Operation(
        summary = "Get logged-in teacher’s profile",
        description = "Fetches the profile details (first name, last name, email, etc.) of the currently logged-in teacher. Uses the JWT from the Authorization header to identify the user."
    )
    @GetMapping
    public ResponseEntity<ApiResponse<UserDto>> getMyProfile(HttpServletRequest req) {
        try {
            String username = jwtService.extractUsername(extractToken(req));
            UserDto teacher = userService.getUserByUsername(username);
            return ResponseEntity.ok(new ApiResponse<>("Profile retrieved successfully", true, teacher));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), false, null));
        }
    }

    @Operation(
        summary = "Update logged-in teacher’s profile",
        description = "Updates the profile details (first name, last name) of the currently logged-in teacher. Uses the JWT from the Authorization header to identify the user, then updates the profile with the data provided in the request body."
    )
    @PostMapping
    public ResponseEntity<ApiResponse<UserDto>> updateMyProfile(HttpServletRequest req, @RequestBody UserDto dto) {
        try {
            String username = jwtService.extractUsername(extractToken(req));
            UserDto teacher = userService.getUserByUsername(username);
            UserDto updatedProfile = userService.updateProfile(dto, teacher.getUserId());
            return ResponseEntity.ok(new ApiResponse<>("Profile updated successfully", true, updatedProfile));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), false, null));
        }
    }
}
