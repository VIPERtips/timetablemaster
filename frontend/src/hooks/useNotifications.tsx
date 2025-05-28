
import { useState, useEffect } from 'react';
import { format, differenceInMinutes, isToday } from 'date-fns';
import { Lesson } from '../types';
import { toast } from '@/hooks/use-toast';
import { parseJavaLocalDateTime } from '../lib/dateUtils';

export const useNotifications = (lessons: Lesson[]) => {
  const [notifiedLessons, setNotifiedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      
      // Filter lessons that are today
      const todaysLessons = lessons.filter(lesson => {
        try {
          const lessonDate = parseJavaLocalDateTime(lesson.startTime);
          return isToday(lessonDate);
        } catch (error) {
          console.error('Error parsing lesson date:', lesson.startTime, error);
          return false;
        }
      });
      
      todaysLessons.forEach((lesson) => {
        try {
          const lessonStart = parseJavaLocalDateTime(lesson.startTime);
          const minutesUntil = differenceInMinutes(lessonStart, now);
          
          const notificationKey30 = `${lesson.lessonId}-30`;
          const notificationKey10 = `${lesson.lessonId}-10`;
          
          // 30-minute notification (between 25-30 minutes)
          if (minutesUntil <= 30 && minutesUntil > 25 && !notifiedLessons.has(notificationKey30)) {
            toast({
              title: "Lesson Reminder",
              description: `${lesson.title} starts in 30 minutes at ${format(lessonStart, 'HH:mm')}`,
              duration: 10000,
            });
            setNotifiedLessons(prev => new Set(prev).add(notificationKey30));
          }
          
          // 10-minute notification (between 5-10 minutes)
          if (minutesUntil <= 10 && minutesUntil > 5 && !notifiedLessons.has(notificationKey10)) {
            toast({
              title: "Lesson Starting Soon!",
              description: `${lesson.title} starts in 10 minutes at ${format(lessonStart, 'HH:mm')}`,
              duration: 10000,
            });
            setNotifiedLessons(prev => new Set(prev).add(notificationKey10));
          }
        } catch (error) {
          console.error('Error processing lesson notification:', lesson, error);
        }
      });
    };

    // Check immediately
    checkNotifications();
    
    // Set up interval to check every minute
    const interval = setInterval(checkNotifications, 60000);
    
    return () => clearInterval(interval);
  }, [lessons, notifiedLessons]);

  // Reset notifications at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      setNotifiedLessons(new Set());
    }, msUntilMidnight);
    
    return () => clearTimeout(timeout);
  }, []);
};
