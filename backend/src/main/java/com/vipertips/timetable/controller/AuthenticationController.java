package com.vipertips.timetable.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vipertips.timetable.dto.LoginDto;
import com.vipertips.timetable.dto.UserDto;
import com.vipertips.timetable.model.User.Role;
import com.vipertips.timetable.response.ApiResponse;
import com.vipertips.timetable.response.AuthenticationResponse;
import com.vipertips.timetable.service.AuthenticationService;
import com.vipertips.timetable.service.EmailSender;
import com.vipertips.timetable.service.UserService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("api/auth/")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;
    
    @Operation(summary = "User registration", description = "Registers a user with default role as TEACHER")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerUser(
            @RequestBody UserDto req) {
        try {
           
            AuthenticationResponse response = authenticationService.registerUser(req);


            Map<String, Object> responseData = new HashMap<>();
            responseData.put("user", Map.of(
                "firstName", req.getFirstName(),
                 "lastName ", req.getLastName(),
                "email", req.getEmail(),
                "role", Role.TEACHER.toString()
            ));
            responseData.put("token", response.getToken());

            return ResponseEntity.ok(new ApiResponse<>("Registration successful", true, responseData));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ex.getMessage(), false, null));
        }
    }

   

    @Operation(summary = "User login", description = "Authenticates a user and returns an authentication token.")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> login(@RequestBody LoginDto req) {
        try {
            AuthenticationResponse authResponse = authenticationService.authenticate(req);
            return ResponseEntity.ok(new ApiResponse<>("Login successful", true, authResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>("Login failed: " + e.getMessage(), false, null));
        }
    }

    @Operation(summary = "Refresh authentication token", description = "Refreshes the authentication token using a valid refresh token.")
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> refreshToken(@RequestParam String refreshToken) {
        AuthenticationResponse response = authenticationService.refreshToken(refreshToken);
        return ResponseEntity.ok(new ApiResponse<>("Token refreshed successfully", true, response));
    }

   
}
