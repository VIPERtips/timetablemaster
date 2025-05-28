package com.vipertips.timetable.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.vipertips.timetable.dto.LessonDto;
import com.vipertips.timetable.model.Lesson;
import com.vipertips.timetable.model.Lesson.Status;
import com.vipertips.timetable.model.User;
import com.vipertips.timetable.repository.LessonRepository;
import com.vipertips.timetable.repository.UserRepository;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailSender emailSender;

    public LessonDto createLesson(LessonDto lessonDto, int teacherId) {
        User user = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        System.out.println("DTO description: " + lessonDto.getLessonAbout());

        Lesson lesson = Lesson.builder()
                .title(lessonDto.getTitle())
                .startTime(lessonDto.getStartTime())
                .endTime(lessonDto.getEndTime())
                .status(Status.PENDING)
                .lessonAbout(lessonDto.getLessonAbout())
                .user(user)
                .build();

        Lesson savedLesson = lessonRepository.save(lesson);

        return mapToDto(savedLesson);
    }

    public Page<LessonDto> getLessonsForTeacher(int teacherId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("startTime").descending());
        Page<Lesson> lessons = lessonRepository.findByUser_UserId(teacherId, pageable);

        return lessons.map(this::mapToDto);
    }

    public LessonDto updateLesson(int lessonId, LessonDto lessonDto) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        lesson.setStatus(Status.PENDING);

        if (lessonDto.getTitle() != null) {
            lesson.setTitle(lessonDto.getTitle());
        }
        if (lessonDto.getLessonAbout() != null) {
            lesson.setLessonAbout(lessonDto.getLessonAbout());
        }
        if (lessonDto.getStartTime() != null) {
            lesson.setStartTime(lessonDto.getStartTime());
        }
        if (lessonDto.getEndTime() != null) {
            lesson.setEndTime(lessonDto.getEndTime());
        }

        lessonRepository.save(lesson);
        return mapToDto(lesson);
    }


    public void deleteLesson(int lessonId) {
        lessonRepository.deleteById(lessonId);
    }
    
    public LessonDto getLessonById(int lessonId) {
    	Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
    	return mapToDto(lesson);
    }

    private LessonDto mapToDto(Lesson lesson) {
        LessonDto dto = new LessonDto();
        dto.setLessonId(lesson.getLessonId());
        dto.setTitle(lesson.getTitle());
        dto.setLessonAbout(lesson.getLessonAbout());
        dto.setStartTime(lesson.getStartTime());
        dto.setEndTime(lesson.getEndTime());
        return dto;
    }

    @Scheduled(fixedRate = 60000) 
    public void sendUpcomingLessonReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tenMinsLater = now.plusMinutes(10);
        LocalDateTime thirtyMinsLater = now.plusMinutes(30);

        List<Lesson> upcomingLessons = lessonRepository
                .findByStartTimeBetween(tenMinsLater, thirtyMinsLater);

        for (Lesson lesson : upcomingLessons) {
            System.out.println("---"+lesson.getStatus());
            if (lesson.getStatus() == Lesson.Status.PENDING) {
                try {
                    emailSender.sendLessonReminderEmail(
                            lesson.getUser().getEmail(),
                            lesson.getUser().getFirstName(),
                            lesson.getTitle(),
                            lesson.getStartTime().toString(),
                            30
                    );
                    System.out.println("Reminder sent for lesson: " + lesson.getTitle());

                    // Update the status to SENT so we don't spam
                    lesson.setStatus(Lesson.Status.SENT);
                    lessonRepository.save(lesson);
                } catch (Exception e) {
                    System.err.println("Error sending reminder: " + e.getMessage());
                }
            }
        }
    }

}
