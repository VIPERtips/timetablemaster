
import { useState, useEffect } from 'react';
import { Lesson, LessonFormData } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lessonData: LessonFormData) => Promise<void>;
  lesson?: Lesson | null;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export const LessonModal = ({ isOpen, onClose, onSave, lesson }: LessonModalProps) => {
  const [formData, setFormData] = useState<LessonFormData>({
    title: '',
    lessonAbout: '',
    startTime: '',
    endTime: '',
    dayOfWeek: new Date().getDay(),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lesson) {
      try {
        const start = new Date(lesson.startTime);
        const end = new Date(lesson.endTime);

        const startTime = start.toTimeString().slice(0, 5);
        const endTime = end.toTimeString().slice(0, 5);

        setFormData({
          title: lesson.title,
          lessonAbout: lesson.lessonAbout || '',
          startTime,
          endTime,
          dayOfWeek: start.getDay(),
        });
      } catch (error) {
        console.error('Error parsing lesson dates:', error);
        setFormData({
          title: lesson.title,
          lessonAbout: lesson.lessonAbout || '',
          startTime: '',
          endTime: '',
          dayOfWeek: new Date().getDay(),
        });
      }
    } else {
      setFormData({
        title: '',
        lessonAbout: '',
        startTime: '',
        endTime: '',
        dayOfWeek: new Date().getDay(),
      });
    }
  }, [lesson, isOpen]);

  const createDateTimeString = (dayOfWeek: number, time: string): string => {
    const now = new Date();
    const currentDay = now.getDay();
    
    // Calculate how many days until the target day
    let daysUntil = dayOfWeek - currentDay;
    if (daysUntil < 0) daysUntil += 7;
    
    // Create target date
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + daysUntil);
    
    // Set the time
    const [hours, minutes] = time.split(':').map(Number);
    targetDate.setHours(hours, minutes, 0, 0);
    
    return targetDate.toLocaleString('sv-SE').replace(' ', 'T');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const startDateTime = createDateTimeString(formData.dayOfWeek, formData.startTime);
      const endDateTime = createDateTimeString(formData.dayOfWeek, formData.endTime);

      const lessonDataToSend = {
        title: formData.title,
        lessonAbout: formData.lessonAbout,
        startTime: startDateTime,
        endTime: endDateTime,
      };

      console.log('Sending lesson data:', lessonDataToSend);
      await onSave(lessonDataToSend);
      onClose();
    } catch (error) {
      console.error('Lesson save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      dayOfWeek: parseInt(value),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {lesson ? 'Edit Lesson' : 'Create New Lesson'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Lesson Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g., Algebra Basics"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="lessonAbout"
              value={formData.lessonAbout}
              onChange={handleInputChange}
              placeholder="Brief description of the lesson..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dayOfWeek">Day of Week</Label>
            <Select value={formData.dayOfWeek.toString()} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : (lesson ? 'Update Lesson' : 'Create Lesson')}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
