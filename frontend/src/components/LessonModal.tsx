
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Lesson, LessonFormData } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { 
  parseJavaLocalDateTime, 
  extractDateString, 
  extractTimeString, 
  validateTimeRange, 
  createDateTimeFromInputs 
} from '../lib/dateUtils';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lessonData: LessonFormData) => Promise<void>;
  lesson?: Lesson | null;
}

export const LessonModal = ({ isOpen, onClose, onSave, lesson }: LessonModalProps) => {
  const [formData, setFormData] = useState<LessonFormData>({
    title: '',
    lessonAbout: '',
    lessonDate: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (lesson) {
      try {
        const startDate = parseJavaLocalDateTime(lesson.startTime);
        const endDate = parseJavaLocalDateTime(lesson.endTime);

        const lessonDate = extractDateString(startDate);
        const startTime = extractTimeString(startDate);
        const endTime = extractTimeString(endDate);

        setFormData({
          title: lesson.title,
          lessonAbout: lesson.lessonAbout || '',
          lessonDate,
          startTime,
          endTime,
        });
        setSelectedDate(startDate);
      } catch (error) {
        console.error('Error parsing lesson dates:', error);
        // Reset to defaults if parsing fails
        const today = new Date();
        setFormData({
          title: lesson.title,
          lessonAbout: lesson.lessonAbout || '',
          lessonDate: format(today, 'yyyy-MM-dd'),
          startTime: '09:00',
          endTime: '10:00',
        });
        setSelectedDate(today);
      }
    } else {
      // Reset form for new lesson
      const today = new Date();
      setFormData({
        title: '',
        lessonAbout: '',
        lessonDate: format(today, 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '10:00',
      });
      setSelectedDate(today);
    }
    setErrors({});
  }, [lesson, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.lessonDate) {
      newErrors.lessonDate = 'Date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    // Validate time range
    if (formData.startTime && formData.endTime && formData.lessonDate) {
      const startDateTime = createDateTimeFromInputs(formData.lessonDate, formData.startTime);
      const endDateTime = createDateTimeFromInputs(formData.lessonDate, formData.endTime);
      
      if (!validateTimeRange(startDateTime, endDateTime)) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting lesson data:', formData);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Lesson save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setFormData(prev => ({
        ...prev,
        lessonDate: format(date, 'yyyy-MM-dd'),
      }));
      
      if (errors.lessonDate) {
        setErrors(prev => ({ ...prev, lessonDate: '' }));
      }
    }
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
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
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
            <Label>Lesson Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                    errors.lessonDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.lessonDate && <p className="text-sm text-red-500">{errors.lessonDate}</p>}
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
                className={errors.startTime ? 'border-red-500' : ''}
              />
              {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
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
                className={errors.endTime ? 'border-red-500' : ''}
              />
              {errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
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
