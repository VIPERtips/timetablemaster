package com.vipertips.timetable.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class LessonDto {
    private int lessonId;
    private String title,lessonAbout;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
