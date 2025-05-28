
import axios from 'axios';
import { Lesson, LessonFormData, ApiResponse, PaginatedResponse } from '../types';
import { formatForJavaLocalDateTime, createDateTimeFromInputs } from '../lib/dateUtils';

const API_BASE_URL = 'http://localhost:8080/api';

export const lessonApi = {
  getTeacherLessons: async (page = 0, size = 50): Promise<ApiResponse<PaginatedResponse<Lesson>>> => {
    const response = await axios.get(`${API_BASE_URL}/lesson/teacher`, {
      params: { page, size }
    });
    return response.data;
  },

  createLesson: async (lessonData: LessonFormData): Promise<ApiResponse<Lesson>> => {
    const startDateTime = createDateTimeFromInputs(lessonData.lessonDate, lessonData.startTime);
    const endDateTime = createDateTimeFromInputs(lessonData.lessonDate, lessonData.endTime);

    console.log('Creating lesson with dates:', {
      start: formatForJavaLocalDateTime(startDateTime),
      end: formatForJavaLocalDateTime(endDateTime)
    });

    const response = await axios.post(`${API_BASE_URL}/lesson`, {
      title: lessonData.title,
      startTime: formatForJavaLocalDateTime(startDateTime),
      endTime: formatForJavaLocalDateTime(endDateTime),
      lessonAbout: lessonData.lessonAbout || ''
    });
    return response.data;
  },

  updateLesson: async (lessonId: number, lessonData: LessonFormData): Promise<ApiResponse<Lesson>> => {
    const startDateTime = createDateTimeFromInputs(lessonData.lessonDate, lessonData.startTime);
    const endDateTime = createDateTimeFromInputs(lessonData.lessonDate, lessonData.endTime);

    console.log('Updating lesson with dates:', {
      start: formatForJavaLocalDateTime(startDateTime),
      end: formatForJavaLocalDateTime(endDateTime)
    });

    const response = await axios.put(`${API_BASE_URL}/lesson/${lessonId}`, {
      title: lessonData.title,
      startTime: formatForJavaLocalDateTime(startDateTime),
      endTime: formatForJavaLocalDateTime(endDateTime),
      lessonAbout: lessonData.lessonAbout || ''
    });
    return response.data;
  },

  deleteLesson: async (lessonId: number): Promise<ApiResponse<{}>> => {
    const response = await axios.delete(`${API_BASE_URL}/lesson/${lessonId}`);
    return response.data;
  },
};
