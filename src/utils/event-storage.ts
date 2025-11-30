import type { Event, Venue } from '../types/event';
import { getFromLocalStorage, setToLocalStorage } from './local-storage';

const EVENTS_STORAGE_KEY = 'event-time-table-events';
const VENUES_STORAGE_KEY = 'event-time-table-venues';

export const getEventsFromStorage = (): Event[] => {
  const stored = getFromLocalStorage(EVENTS_STORAGE_KEY);
  if (!stored) return [];
  try {
    const events = JSON.parse(stored);
    // Migrate old events with venueId to venueIds
    const migratedEvents = events.map((event: Event) => {
      if (!event.venueIds && event.venueId) {
        return {
          ...event,
          venueIds: [event.venueId],
        };
      }
      return event;
    });
    
    // Save migrated events back if migration occurred
    const needsMigration = migratedEvents.some((e: Event) => e.venueId && !e.venueIds);
    if (needsMigration) {
      saveEventsToStorage(migratedEvents);
    }
    
    return migratedEvents;
  } catch {
    return [];
  }
};

export const saveEventsToStorage = (events: Event[]): void => {
  setToLocalStorage(EVENTS_STORAGE_KEY, JSON.stringify(events));
};

export const getVenuesFromStorage = (): Venue[] => {
  const stored = getFromLocalStorage(VENUES_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveVenuesToStorage = (venues: Venue[]): void => {
  setToLocalStorage(VENUES_STORAGE_KEY, JSON.stringify(venues));
};

export const addEvent = (event: Event): void => {
  const events = getEventsFromStorage();
  events.push(event);
  saveEventsToStorage(events);
};

export const updateEvent = (eventId: string, updatedEvent: Partial<Event>): void => {
  const events = getEventsFromStorage();
  const index = events.findIndex((e) => e.id === eventId);
  if (index !== -1) {
    events[index] = { ...events[index], ...updatedEvent };
    saveEventsToStorage(events);
  }
};

export const deleteEvent = (eventId: string): void => {
  const events = getEventsFromStorage();
  const filtered = events.filter((e) => e.id !== eventId);
  saveEventsToStorage(filtered);
};

export const getEventsByDate = (date: string): Event[] => {
  const events = getEventsFromStorage();
  return events.filter((e) => e.date === date);
};

