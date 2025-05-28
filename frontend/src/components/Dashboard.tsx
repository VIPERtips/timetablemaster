
import { useState, useEffect } from 'react';
import { Lesson, LessonFormData } from '../types';
import { lessonApi } from '../services/api';
import { useNotifications } from '../hooks/useNotifications';
import { toast } from '@/hooks/use-toast';
import { Header } from './Header';
import { ProfileModal } from './ProfileModal';
import { LessonModal } from './LessonModal';
import { WeeklyCalendar } from './WeeklyCalendar';
import { ModernButton } from '@/components/ui/modern-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, Clock, BookOpen } from 'lucide-react';
import { isToday, parseISO } from 'date-fns';

export const Dashboard = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Enable notifications
  useNotifications(lessons);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await lessonApi.getTeacherLessons();
      //console.log('API response:', response);
      
      if (response.success) {
        // Convert backend lessons to frontend format with proper compatibility
        const formattedLessons = response.data.content.map(lesson => ({
          ...lesson,
          id: lesson.lessonId.toString(), // Legacy compatibility
          lessonAbout: lesson.lessonAbout || '', // Ensure this field exists
        }));
        //console.log('Formatted lessons:', formattedLessons);
        setLessons(formattedLessons);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      toast({
        title: "Error",
        description: "Failed to load lessons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = () => {
    setEditingLesson(null);
    setLessonModalOpen(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonModalOpen(true);
  };

  const handleSaveLesson = async (lessonData: LessonFormData) => {
    try {
      if (editingLesson) {
        const response = await lessonApi.updateLesson(editingLesson.lessonId, lessonData);
        if (response.success) {
          toast({
            title: "Success",
            description: "Lesson updated successfully!",
          });
        }
      } else {
        const response = await lessonApi.createLesson(lessonData);
        if (response.success) {
          toast({
            title: "Success",
            description: "Lesson created successfully!",
          });
        }
      }
      await fetchLessons();
    } catch (error) {
      console.error('Failed to save lesson:', error);
      toast({
        title: "Error",
        description: "Failed to save lesson",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      const response = await lessonApi.deleteLesson(parseInt(lessonId));
      if (response.success) {
        toast({
          title: "Success",
          description: "Lesson deleted successfully!",
        });
        await fetchLessons();
      }
    } catch (error) {
      console.error('Failed to delete lesson:', error);
      toast({
        title: "Error",
        description: "Failed to delete lesson",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header onProfileClick={() => setProfileModalOpen(true)} />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 font-medium">Loading your lessons...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate today's lessons using actual lesson dates
  const todayLessons = lessons.filter(lesson => {
    try {
      const lessonDate = parseISO(lesson.startTime);
      return isToday(lessonDate);
    } catch (error) {
      console.error('Error parsing lesson date:', lesson.startTime, error);
      return false;
    }
  });

  const upcomingLessons = lessons.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header onProfileClick={() => setProfileModalOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Cards - Mobile Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
              <BookOpen className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lessons.length}</div>
              <p className="text-xs text-blue-100">Across all days</p>
            </CardContent>
          </Card>

          <Card className="glass-card bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Lessons</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayLessons.length}</div>
              <p className="text-xs text-green-100">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card className="glass-card bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lessons.length}</div>
              <p className="text-xs text-orange-100">Total lessons</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <ModernButton 
            onClick={handleCreateLesson} 
            className="flex items-center space-x-2 hover-scale"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Lesson</span>
          </ModernButton>
        </div>

        {/* Main Calendar */}
        <WeeklyCalendar
          lessons={lessons}
          onCreateLesson={handleCreateLesson}
          onEditLesson={handleEditLesson}
          onDeleteLesson={handleDeleteLesson}
        />

        {/* Upcoming Lessons - Mobile Friendly */}
        {upcomingLessons.length > 0 && (
          <Card className="mt-8 glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Upcoming Lessons</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingLessons.map((lesson) => (
                  <div 
                    key={lesson.lessonId} 
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(lesson.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(lesson.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <ModernButton 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditLesson(lesson)}
                    >
                      Edit
                    </ModernButton>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      <LessonModal
        isOpen={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        onSave={handleSaveLesson}
        lesson={editingLesson}
      />

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <ModernButton
          onClick={handleCreateLesson}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg animate-glow"
        >
          <Plus className="h-6 w-6" />
        </ModernButton>
      </div>
    </div>
  );
};
