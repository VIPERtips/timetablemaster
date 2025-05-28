package com.vipertips.timetable.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.vipertips.timetable.model.Lesson;

public interface LessonRepository extends JpaRepository<Lesson, Integer> {

	Page<Lesson> findByUser_UserId(int teacherId,Pageable pageable);

	List<Lesson> findByStartTimeBetween(LocalDateTime tenMinsLater, LocalDateTime thirtyMinsLater);

}
