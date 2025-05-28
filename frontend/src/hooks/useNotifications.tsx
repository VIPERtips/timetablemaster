
import { useState, useEffect } from 'react';
import { format, differenceInMinutes, parseISO, isToday } from 'date-fns';
import { Lesson } from '../types';
import { toast } from '@/hooks/use-toast';

export const useNotifications = (lessons: Lesson[]) => {
  const [notifiedLessons, setNotifiedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      console.log('Checking notifications at:', now);
      
      // Filter lessons that are today
      const todaysLessons = lessons.filter(lesson => {
        try {
          const lessonDate = parseISO(lesson.startTime);
          return isToday(lessonDate);
        } catch (error) {
          console.error('Error parsing lesson date:', lesson.startTime, error);
          return false;
        }
      });

      console.log('Today\'s lessons:', todaysLessons);
      
      todaysLessons.forEach((lesson) => {
        try {
          const lessonStart = parseISO(lesson.startTime);
          const minutesUntil = differenceInMinutes(lessonStart, now);
          
          console.log(`Lesson "${lesson.title}" starts in ${minutesUntil} minutes`);
          
          const notificationKey30 = `${lesson.lessonId}-30`;
          const notificationKey10 = `${lesson.lessonId}-10`;
          
          // 30-minute notification (between 25-30 minutes)
          if (minutesUntil <= 30 && minutesUntil > 25 && !notifiedLessons.has(notificationKey30)) {
            console.log('Showing 30-minute notification for:', lesson.title);
            toast({
              title: "Lesson Reminder",
              description: `${lesson.title} starts in 30 minutes at ${format(lessonStart, 'HH:mm')}`,
              duration: 10000,
            });
            setNotifiedLessons(prev => new Set(prev).add(notificationKey30));
          }
          
          // 10-minute notification (between 5-10 minutes)
          if (minutesUntil <= 10 && minutesUntil > 5 && !notifiedLessons.has(notificationKey10)) {
            console.log('Showing 10-minute notification for:', lesson.title);
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
      console.log('Resetting notifications at midnight');
      setNotifiedLessons(new Set());
    }, msUntilMidnight);
    
    return () => clearTimeout(timeout);
  }, []);
};
