import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Event, Venue } from '../types/event';
import {
  deleteEvent,
  getEventsFromStorage,
  getVenuesFromStorage,
  saveEventsToStorage,
  saveVenuesToStorage,
} from '../utils/event-storage';
import {
  formatDate,
  formatTime,
  formatTimeRange,
  generateTimeSlots,
  getHeightInPixels,
  getTopPosition,
  getWeekDates
} from '../utils/time-utils';
import { EventForm } from './EventForm';
import { WeekNavigationHeader } from './WeekNavigationHeader';

const MINUTES_PER_PIXEL = 0.5; // 15 minutes = 7.5px, 1 hour = 30px (for event positioning)
const TIME_COLUMN_WIDTH = 100;
const VENUE_COLUMN_WIDTH = 200;
const VISIBLE_TIME_ROWS = 8; // Show 8 rows at a time (e.g., 9:00 to 10:45)
const TIME_SLOT_DISPLAY_HEIGHT = 30; // Display height per time slot (30px for better visibility)
const VISIBLE_TIME_HEIGHT = VISIBLE_TIME_ROWS * TIME_SLOT_DISPLAY_HEIGHT; // 240px for 8 visible rows
// Scale factor to convert event positions to match display height
const TIME_SCALE_FACTOR = TIME_SLOT_DISPLAY_HEIGHT / (15 * MINUTES_PER_PIXEL); // 30 / 7.5 = 4

function EventTimeTable() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs().startOf('week').add(1, 'day'));
  const [weekStart, setWeekStart] = useState<Dayjs>(dayjs().startOf('week').add(1, 'day'));
  
  // Initialize venues from localStorage - 10 independent venues
  const [venues] = useState<Venue[]>(() => {
    const storedVenues = getVenuesFromStorage();
    if (storedVenues.length === 0) {
      const defaultVenues: Venue[] = [
        { id: '1', name: 'Venue 1' },
        { id: '2', name: 'Venue 2' },
        { id: '3', name: 'Venue 3' },
        { id: '4', name: 'Venue 4' },
        { id: '5', name: 'Venue 5' },
        { id: '6', name: 'Venue 6' },
        { id: '7', name: 'Venue 7' },
        { id: '8', name: 'Venue 8' },
        { id: '9', name: 'Venue 9' },
        { id: '10', name: 'Venue 10' },
      ];
      saveVenuesToStorage(defaultVenues);
      return defaultVenues;
    }
    // Ensure we have at least 10 venues, but limit to 10
    if (storedVenues.length < 10) {
      const additionalVenues: Venue[] = [];
      for (let i = storedVenues.length + 1; i <= 10; i++) {
        additionalVenues.push({ id: i.toString(), name: `Venue ${i}` });
      }
      const updatedVenues = [...storedVenues, ...additionalVenues];
      saveVenuesToStorage(updatedVenues);
      return updatedVenues;
    }
    // Limit to 10 venues if more exist
    return storedVenues.slice(0, 10);
  });

  // Initialize events from localStorage - make it reactive
  const [events, setEvents] = useState<Event[]>(() => {
    const storedEvents = getEventsFromStorage();
    
    if (storedEvents.length === 0) {
      const today = dayjs();
      const sampleEvents: Event[] = [
        {
          id: '1',
          title: 'Meeting',
          startTime: '09:00',
          endTime: '10:30',
          venueIds: ['1'],
          date: formatDate(today),
          color: '#2563eb',
        },
        {
          id: '2',
          title: 'Workshop',
          startTime: '14:00',
          endTime: '16:00',
          venueIds: ['2'],
          date: formatDate(today),
          color: '#10b981',
        },
      ];
      saveEventsToStorage(sampleEvents);
      return sampleEvents;
    }
    return storedEvents;
  });

  // Event form state
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formInitialDate, setFormInitialDate] = useState<Dayjs | null>(null);
  const [formInitialVenueIds, setFormInitialVenueIds] = useState<string[] | undefined>(undefined);
  
  const timeColumnRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const venuesScrollRef = useRef<HTMLDivElement>(null);

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Helper function to ensure selectedDate is within the current week
  const ensureSelectedDateInWeek = (newWeekStart: Dayjs, currentSelectedDate: Dayjs) => {
    const newWeekDates = getWeekDates(newWeekStart);
    const isDateInWeek = newWeekDates.some((d) => formatDate(d) === formatDate(currentSelectedDate));
    return isDateInWeek ? currentSelectedDate : newWeekDates[0];
  };

  // Sync vertical scroll between time column and content area
  useEffect(() => {
    const timeColumn = timeColumnRef.current;
    const contentArea = contentAreaRef.current;

    if (!timeColumn || !contentArea) return;

    const handleTimeScroll = () => {
      contentArea.scrollTop = timeColumn.scrollTop;
    };

    const handleContentScroll = () => {
      timeColumn.scrollTop = contentArea.scrollTop;
    };

    timeColumn.addEventListener('scroll', handleTimeScroll);
    contentArea.addEventListener('scroll', handleContentScroll);

    return () => {
      timeColumn.removeEventListener('scroll', handleTimeScroll);
      contentArea.removeEventListener('scroll', handleContentScroll);
    };
  }, []);

  // Sync horizontal scroll between venue header bar and venue columns grid
  useEffect(() => {
    const venuesBar = venuesScrollRef.current;
    const contentArea = contentAreaRef.current;

    if (!venuesBar || !contentArea) return;

    const handleVenuesScroll = () => {
      if (contentArea.scrollLeft !== venuesBar.scrollLeft) {
        contentArea.scrollLeft = venuesBar.scrollLeft;
      }
    };

    const handleContentScroll = () => {
      if (venuesBar.scrollLeft !== contentArea.scrollLeft) {
        venuesBar.scrollLeft = contentArea.scrollLeft;
      }
    };

    venuesBar.addEventListener('scroll', handleVenuesScroll);
    contentArea.addEventListener('scroll', handleContentScroll);

    return () => {
      venuesBar.removeEventListener('scroll', handleVenuesScroll);
      contentArea.removeEventListener('scroll', handleContentScroll);
    };
  }, []);

  // Get events for the selected date only
  const selectedDateEvents = useMemo(() => {
    const selectedDateString = formatDate(selectedDate);
    return events.filter((e) => e.date === selectedDateString);
  }, [selectedDate, events]);

  // Refresh events from storage
  const refreshEvents = () => {
    setEvents(getEventsFromStorage());
  };

  // Handle event click
  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  // Handle add event
  const handleAddEvent = (date?: Dayjs, venueIds?: string[]) => {
    setEditingEvent(null);
    setFormInitialDate(date || selectedDate);
    setFormInitialVenueIds(venueIds);
    setIsEventFormOpen(true);
  };

  // Handle delete event
  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    refreshEvents();
  };

  // Handle form close
  const handleFormClose = () => {
    setIsEventFormOpen(false);
    setEditingEvent(null);
    setFormInitialDate(null);
    setFormInitialVenueIds(undefined);
    refreshEvents();
  };

  // Handle venue column click (to add event)
  const handleVenueColumnClick = (venueId: string, date: Dayjs) => {
    setEditingEvent(null);
    setFormInitialDate(date);
    setFormInitialVenueIds([venueId]);
    setIsEventFormOpen(true);
  };

  const handleTabChange = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const handlePrevWeek = () => {
    setWeekStart((prev) => {
      const newWeekStart = prev.subtract(7, 'days');
      const newSelectedDate = ensureSelectedDateInWeek(newWeekStart, selectedDate);
      setSelectedDate(newSelectedDate);
      return newWeekStart;
    });
  };

  const handleNextWeek = () => {
    setWeekStart((prev) => {
      const newWeekStart = prev.add(7, 'days');
      const newSelectedDate = ensureSelectedDateInWeek(newWeekStart, selectedDate);
      setSelectedDate(newSelectedDate);
      return newWeekStart;
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 1. Top Tab Bar - 7 days, horizontally scrollable, sticky vertically */}
      <WeekNavigationHeader
        weekStart={weekStart}
        selectedDate={selectedDate}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onTabChange={handleTabChange}
      />

      {/* 2. Venue Section - Below tabbar, horizontally scrollable, sticky vertically */}
      <div className="sticky top-[73px] z-40 bg-white border-b border-gray-200">
        <div
          ref={venuesScrollRef}
          className="flex overflow-x-auto ml-[100px]"
          style={{ scrollbarWidth: 'thin' }}
        >
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="shrink-0 border-r border-gray-200 p-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              style={{ width: `${VENUE_COLUMN_WIDTH}px`, minWidth: `${VENUE_COLUMN_WIDTH}px` }}
              onClick={() => handleAddEvent(selectedDate, [venue.id])}
              title={`Click to add event in ${venue.name}`}
            >
              <div className="text-sm font-semibold text-gray-900 text-center">{venue.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 5. Time Column - Fixed left position, scrollable vertically, 15-minute intervals */}
        {/* Shows only 8 rows at a time (e.g., 9:00 to 10:45), scrollable to see more */}
        <div
          ref={timeColumnRef}
          className="shrink-0 overflow-y-auto border-r border-gray-200 bg-white sticky left-0 z-20"
          style={{ 
            width: `${TIME_COLUMN_WIDTH}px`,
            height: `${VISIBLE_TIME_HEIGHT + 40}px`, // 8 rows visible + header height
          }}
        >
          
          
          {/* Time Slots - Every 15 minutes - Full height for scrolling, but only 8 rows visible */}
          <div style={{ height: `${timeSlots.length * TIME_SLOT_DISPLAY_HEIGHT}px` }}>
            {timeSlots.map((time) => (
              <div
                key={time}
                className="border-b border-gray-100 px-2 relative"
                style={{
                  height: `${TIME_SLOT_DISPLAY_HEIGHT}px`,
                  minHeight: `${TIME_SLOT_DISPLAY_HEIGHT}px`,
                }}
              >
                {/* Display time for every 15-minute slot */}
                <div className="text-xs text-gray-600 font-medium absolute top-0 left-2">
                  {formatTime(time)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Venue Columns and Events - Scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable Content Area - Vertical scroll synced with time column */}
          <div
            ref={contentAreaRef}
            className="overflow-y-auto overflow-x-auto relative bg-white"
            style={{ height: `${VISIBLE_TIME_HEIGHT + 40}px` }}
          >
            {/* Main Grid Container - Venues as independent columns */}
            <div className="flex" style={{ height: `${timeSlots.length * TIME_SLOT_DISPLAY_HEIGHT}px` }}>
              {venues.map((venue) => (
                <div 
                  key={venue.id} 
                  className="shrink-0 relative border-r border-gray-200 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  style={{ width: `${VENUE_COLUMN_WIDTH}px` }}
                  onClick={() => handleVenueColumnClick(venue.id, selectedDate)}
                >
                  {/* Time Grid Lines for this venue */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        to bottom,
                        transparent 0,
                        transparent ${TIME_SLOT_DISPLAY_HEIGHT - 1}px,
                        #e5e7eb ${TIME_SLOT_DISPLAY_HEIGHT - 1}px,
                        #e5e7eb ${TIME_SLOT_DISPLAY_HEIGHT}px
                      )`,
                    }}
                  >
                    {/* Event Cards for this venue - events for selected date only */}
                    {selectedDateEvents
                      .filter((e) => {
                        // Support both venueIds (new) and venueId (legacy)
                        const venueIds = e.venueIds || (e.venueId ? [e.venueId] : []);
                        return venueIds.includes(venue.id);
                      })
                      .map((event) => {

                        // Position event vertically by time, full width of venue column
                        const top = getTopPosition(event.startTime, MINUTES_PER_PIXEL) * TIME_SCALE_FACTOR;
                        const height = getHeightInPixels(event.startTime, event.endTime, MINUTES_PER_PIXEL) * TIME_SCALE_FACTOR;

                        const style = {
                          top: `${top}px`,
                          height: `${height}px`,
                          left: '0px',
                          width: `${VENUE_COLUMN_WIDTH}px`,
                          backgroundColor: event.color || '#2563eb',
                        };

                        const menuItems: MenuProps['items'] = [
                          {
                            key: 'edit',
                            label: 'Edit',
                            icon: <EditOutlined />,
                            onClick: () => {
                              setEditingEvent(event);
                              setIsEventFormOpen(true);
                            },
                          },
                          {
                            key: 'delete',
                            label: 'Delete',
                            icon: <DeleteOutlined />,
                            danger: true,
                            onClick: () => {
                              handleDeleteEvent(event.id);
                            },
                          },
                        ];

                        return (
                          <Dropdown
                            key={event.id}
                            menu={{ items: menuItems }}
                            trigger={['contextMenu']}
                          >
                            <div
                              className="absolute rounded-md shadow-sm border border-white/30 p-2 text-white text-xs overflow-hidden cursor-pointer hover:shadow-lg transition-all group text-center"
                              style={style}
                              onClick={(e) => handleEventClick(event, e)}
                              title={`${event.title} (${event.date} ${event.startTime} - ${event.endTime})`}
                            >
                              <div className="font-semibold truncate">{event.title}</div>
                              <div className="text-xs opacity-90 mt-0.5">
                                {formatTimeRange(event.startTime, event.endTime)}
                              </div>
                            </div>
                          </Dropdown>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Form Modal */}
      {isEventFormOpen && (
        <EventForm
          open={isEventFormOpen}
          event={editingEvent}
          initialDate={formInitialDate || selectedDate}
          initialVenueIds={formInitialVenueIds}
          venues={venues}
          onClose={handleFormClose}
          onSave={refreshEvents}
        />
      )}
    </div>
  );
}

export default EventTimeTable;

