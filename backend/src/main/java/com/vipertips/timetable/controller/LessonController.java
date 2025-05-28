package com.vipertips.timetable.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vipertips.timetable.dto.LessonDto;
import com.vipertips.timetable.dto.UserDto;
import com.vipertips.timetable.response.ApiResponse;
import com.vipertips.timetable.service.JwtService;
import com.vipertips.timetable.service.LessonService;
import com.vipertips.timetable.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/lesson")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    private String extractToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        return (token != null && token.startsWith("Bearer ")) ? token.substring(7) : null;
    }

    @Operation(
        summary = "Create a new lesson",
        description = "Creates a new lesson for the logged-in teacher. You need to provide the lesson’s title, start time, end time, and other details in the request body."
    )
    @PostMapping
    public ResponseEntity<ApiResponse<LessonDto>> createLesson(@RequestBody LessonDto lessonDto, HttpServletRequest req) {
        try {
            String username = jwtService.extractUsername(extractToken(req));
            UserDto teacher = userService.getUserByUsername(username);
            LessonDto created = lessonService.createLesson(lessonDto, teacher.getUserId());
            return ResponseEntity.ok(new ApiResponse<>("Lesson created successfully", true, created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), false, null));
        }
    }

    @Operation(
        summary = "Update an existing lesson",
        description = "Updates the details of an existing lesson using its ID and the new lesson information in the request body."
    )
    @PutMapping("/{lessonId}")
    public ResponseEntity<ApiResponse<LessonDto>> updateLesson(@PathVariable int lessonId, @RequestBody LessonDto lessonDto, HttpServletRequest req) {
        try {
            LessonDto updated = lessonService.updateLesson(lessonId, lessonDto);
            return ResponseEntity.ok(new ApiResponse<>("Lesson updated successfully", true, updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), false, null));
        }
    }

    @Operation(
        summary = "Delete a lesson",
        description = "Deletes a lesson by its ID. The lesson will be permanently removed from the teacher’s schedule."
    )
    @DeleteMapping("/{lessonId}")
    public ResponseEntity<ApiResponse<?>> deleteLesson(@PathVariable int lessonId) {
        try {
            lessonService.deleteLesson(lessonId);
            return ResponseEntity.ok(new ApiResponse<>("Lesson deleted successfully", true, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), false, null));
        }
    }

    @Operation(
        summary = "Get all lessons for the logged-in teacher",
        description = "Fetches a paginated list of lessons assigned to the logged-in teacher. Provide page number and size as query params."
    )
    @GetMapping("/teacher")
    public ResponseEntity<ApiResponse<Page<LessonDto>>> getLessonsForTeacher(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, HttpServletRequest req) {
        try {
            String username = jwtService.extractUsername(extractToken(req));
            UserDto teacher = userService.getUserByUsername(username);
            Page<LessonDto> lessons = lessonService.getLessonsForTeacher(teacher.getUserId(), page, size);
            return ResponseEntity.ok(new ApiResponse<>("Lesson(s) retrieved successfully", true, lessons));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), false, null));
        }
    }
}
