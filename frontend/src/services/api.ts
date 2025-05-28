
import axios from 'axios';
import { Lesson, LessonFormData, ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to format date for Java LocalDateTime
const formatForJavaLocalDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19); // YYYY-MM-DDTHH:mm:ss format
};

export const lessonApi = {
  getTeacherLessons: async (page = 0, size = 50): Promise<ApiResponse<PaginatedResponse<Lesson>>> => {
    const response = await axios.get(`${API_BASE_URL}/lesson/teacher`, {
      params: { page, size }
    });
    return response.data;
  },

  createLesson: async (lessonData: LessonFormData): Promise<ApiResponse<Lesson>> => {
    const response = await axios.post(`${API_BASE_URL}/lesson`, {
      title: lessonData.title,
      startTime: formatForJavaLocalDateTime(lessonData.startTime),
      endTime: formatForJavaLocalDateTime(lessonData.endTime),
      lessonAbout: lessonData.lessonAbout || ''
    });
    return response.data;
  },

  updateLesson: async (lessonId: number, lessonData: LessonFormData): Promise<ApiResponse<Lesson>> => {
    const response = await axios.put(`${API_BASE_URL}/lesson/${lessonId}`, {
      title: lessonData.title,
      startTime: formatForJavaLocalDateTime(lessonData.startTime),
      endTime: formatForJavaLocalDateTime(lessonData.endTime),
      lessonAbout: lessonData.lessonAbout || ''
    });
    return response.data;
  },

  deleteLesson: async (lessonId: number): Promise<ApiResponse<{}>> => {
    const response = await axios.delete(`${API_BASE_URL}/lesson/${lessonId}`);
    return response.data;
  },
};
