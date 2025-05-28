
export interface User {
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  // Legacy properties for compatibility
  id?: string;
  name?: string;
  subject?: string;
  bio?: string;
}

export interface Lesson {
  lessonId: number;
  title: string;
  startTime: string;
  endTime: string;
  // Legacy properties for compatibility
  id?: string;
  lessonAbout?: string;
  dayOfWeek?: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  loading: boolean;
}

export interface LessonFormData {
  title: string;
  startTime: string;
  endTime: string;
  lessonAbout?: string;
  dayOfWeek?: number;
}

// API Response wrapper type
export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

// Paginated response type
export interface PaginatedResponse<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
