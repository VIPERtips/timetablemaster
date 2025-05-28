
import { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { Lesson } from '../types';
import { ModernButton } from '@/components/ui/modern-button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface WeeklyCalendarProps {
  lessons: Lesson[];
  onCreateLesson: () => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: string) => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MOBILE_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const WeeklyCalendar = ({ 
  lessons, 
  onCreateLesson, 
  onEditLesson, 
  onDeleteLesson 
}: WeeklyCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDayMobile, setSelectedDayMobile] = useState<number | null>(null);
  
  const weekStart = startOfWeek(currentWeek);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Updated lesson filtering to use actual lesson dates
  const getLessonsForDay = (dayIndex: number) => {
    const targetDate = weekDays[dayIndex];
    return lessons.filter(lesson => {
      try {
        const lessonDate = parseISO(lesson.startTime);
        const isSameDate = isSameDay(lessonDate, targetDate);
        console.log(`Checking lesson ${lesson.title} for day ${format(targetDate, 'yyyy-MM-dd')}: ${isSameDate}`);
        return isSameDate;
      } catch (e) {
        console.error('Invalid date format for lesson:', lesson.startTime);
        return false;
      }
    });
  };

  const formatTime = (timeString: string) => {
    try {
      const date = parseISO(timeString);
      return format(date, 'HH:mm');
    } catch {
      return timeString;
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
    setSelectedDayMobile(null); // Reset mobile selection when navigating
    console.log('Navigated to week starting:', format(startOfWeek(newWeek), 'yyyy-MM-dd'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Calendar className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Weekly Timetable
              </h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <ModernButton variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </ModernButton>
              <span className="text-sm font-medium min-w-[140px] text-center px-3 py-2 glass-button rounded-lg">
                {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
              </span>
              <ModernButton variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                <ChevronRight className="h-4 w-4" />
              </ModernButton>
            </div>
            
            <ModernButton onClick={onCreateLesson} className="flex items-center space-x-2 hidden sm:flex">
              <Plus className="h-4 w-4" />
              <span>Add Lesson</span>
            </ModernButton>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Day Selector */}
      <div className="block md:hidden">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, dayIndex) => {
                const dayLessons = getLessonsForDay(dayIndex);
                const isSelected = selectedDayMobile === dayIndex;
                return (
                  <ModernButton
                    key={dayIndex}
                    variant={isSelected ? "primary" : "ghost"}
                    size="sm"
                    className="flex-col h-16 p-2"
                    onClick={() => setSelectedDayMobile(isSelected ? null : dayIndex)}
                  >
                    <span className="text-xs font-medium">{MOBILE_DAYS[dayIndex]}</span>
                    <span className="text-xs">{format(day, 'd')}</span>
                    {dayLessons.length > 0 && (
                      <div className="w-1 h-1 bg-current rounded-full mt-1"></div>
                    )}
                  </ModernButton>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Selected Day Lessons */}
        {selectedDayMobile !== null && (
          <Card className="glass-card animate-fade-in">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-lg">
                {DAYS_OF_WEEK[selectedDayMobile]} - {format(weekDays[selectedDayMobile], 'MMM d')}
              </h3>
              <div className="space-y-3">
                {getLessonsForDay(selectedDayMobile).map((lesson) => (
                  <Card key={lesson.lessonId} className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                        <div className="text-sm text-blue-600 font-medium">
                          {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                        </div>
                        {lesson.lessonAbout && (
                          <p className="text-sm text-gray-600">{lesson.lessonAbout}</p>
                        )}
                        <div className="flex space-x-2">
                          <ModernButton
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditLesson(lesson)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </ModernButton>
                          <ModernButton
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => onDeleteLesson(lesson.lessonId.toString())}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </ModernButton>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {getLessonsForDay(selectedDayMobile).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No lessons scheduled for this day</p>
                    <ModernButton
                      variant="outline"
                      size="sm"
                      onClick={onCreateLesson}
                      className="mt-3"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </ModernButton>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop Calendar Grid */}
      <div className="hidden md:block">
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
              {weekDays.map((day, dayIndex) => (
                <div key={dayIndex} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-r border-gray-200 last:border-r-0">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {DAYS_OF_WEEK[dayIndex]}
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {format(day, 'd')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(day, 'MMM')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-0 min-h-[500px]">
              {weekDays.map((day, dayIndex) => (
                <div key={dayIndex} className="border-r border-gray-200 last:border-r-0 p-2 space-y-2">
                  {getLessonsForDay(dayIndex).map((lesson) => (
                    <Card key={lesson.lessonId} className="bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300 hover:shadow-md transition-all duration-200 hover-scale">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-gray-900 leading-tight">
                            {lesson.title}
                          </h4>
                          <div className="text-xs text-blue-600 font-semibold">
                            {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                          </div>
                          {lesson.lessonAbout && (
                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                              {lesson.lessonAbout}
                            </p>
                          )}
                          <div className="flex space-x-1 pt-1">
                            <ModernButton
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => onEditLesson(lesson)}
                            >
                              <Edit className="h-3 w-3" />
                            </ModernButton>
                            <ModernButton
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                              onClick={() => onDeleteLesson(lesson.lessonId.toString())}
                            >
                              <Trash2 className="h-3 w-3" />
                            </ModernButton>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Add lesson button for empty days */}
                  {getLessonsForDay(dayIndex).length === 0 && (
                    <ModernButton
                      variant="ghost"
                      className="w-full h-16 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      onClick={onCreateLesson}
                    >
                      <Plus className="h-5 w-5 text-gray-400" />
                    </ModernButton>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
