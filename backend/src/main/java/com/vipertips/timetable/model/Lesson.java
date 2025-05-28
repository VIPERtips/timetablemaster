package com.vipertips.timetable.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lessons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int lessonId;
	private String title,lessonAbout;
	private LocalDateTime startTime, endTime, createdAt, updatedAt;
	@ManyToOne
	@JoinColumn(referencedColumnName = "userId",name = "teacher_id",nullable = false)
	private User user;
	
	private Status status;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
	
	public enum Status{
		SENT,PENDING,
	}
}
