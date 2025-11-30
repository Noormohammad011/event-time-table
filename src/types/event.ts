export interface Event {
  id: string;
  title: string;
  startTime: string; 
  endTime: string; 
  venueIds: string[]; 
  date: string;
  color?: string; 
  venueId?: string;
}

export interface Venue {
  id: string;
  name: string;
}

export interface TimeSlot {
  time: string; // Format: "HH:mm"
  displayTime: string; // Display format
}

