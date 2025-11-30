import dayjs, { Dayjs } from 'dayjs';

export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  return slots;
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const getMinutesFromTime = (time: string): number => {
  const [hours, minutes] = time.split(':');
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
};

export const getTimeFromMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const getDurationInMinutes = (startTime: string, endTime: string): number => {
  return getMinutesFromTime(endTime) - getMinutesFromTime(startTime);
};

export const getTopPosition = (time: string, minutesPerPixel: number = 1): number => {
  const minutes = getMinutesFromTime(time);
  return minutes * minutesPerPixel;
};

export const getHeightInPixels = (startTime: string, endTime: string, minutesPerPixel: number = 1): number => {
  const duration = getDurationInMinutes(startTime, endTime);
  return duration * minutesPerPixel;
};

export const getWeekDates = (startDate: Dayjs = dayjs()): Dayjs[] => {
  const dates: Dayjs[] = [];
  const startOfWeek = startDate.startOf('week').add(1, 'day'); // Start from Monday
  
  for (let i = 0; i < 7; i++) {
    dates.push(startOfWeek.add(i, 'days'));
  }
  
  return dates;
};

export const formatDate = (date: Dayjs): string => {
  return date.format('YYYY-MM-DD');
};

export const formatDateDisplay = (date: Dayjs): string => {
  return date.format('MMM DD');
};

export const getDayName = (date: Dayjs): string => {
  return date.format('dddd');
};


