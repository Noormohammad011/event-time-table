# Event Time Table

A modern, interactive event scheduling application built with React and TypeScript. Manage events across multiple venues with an intuitive weekly time table interface.

## Features

- 📅 **Weekly View**: Navigate through weeks with a tabbed interface showing 7 days
- 🏢 **Multi-Venue Support**: Manage events across 3 independent venues
- ⏰ **15-Minute Time Slots**: Precise scheduling with 15-minute interval precision
- 🎨 **Customizable Events**: Color-coded events with customizable colors
- 💾 **Local Storage**: All data persists in browser localStorage
- ✏️ **CRUD Operations**: Create, read, update, and delete events seamlessly
- 📱 **Responsive Design**: Clean, modern UI built with Ant Design and Tailwind CSS

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Ant Design** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Day.js** - Date manipulation and formatting

## Project Structure

```
src/
├── components/          # React components
│   ├── EventForm.tsx           # Event creation/editing form
│   ├── EventTimeTable.tsx      # Main time table component
│   ├── WeekNavigationHeader.tsx # Week navigation tabs
│   └── StickyDateScroller.tsx  # Date scrolling component
├── pages/               # Page components
│   └── Home.tsx                # Home page
├── types/               # TypeScript type definitions
│   └── event.ts                # Event and Venue interfaces
├── utils/               # Utility functions
│   ├── event-storage.ts        # Event CRUD operations
│   ├── local-storage.ts        # localStorage helpers
│   └── time-utils.ts           # Time formatting and calculations
├── config/              # Configuration files
│   └── theme.ts                # Ant Design theme configuration
├── router/              # Routing configuration
│   └── index.tsx               # React Router setup
├── App.tsx              # Root component
└── main.tsx             # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd event-time-table
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Creating an Event

1. Click on a venue column or the venue header to add an event
2. Fill in the event details:
   - Title (required)
   - Date (required)
   - Venues (select one or more)
   - Start time (required, 15-minute intervals)
   - End time (required, must be after start time)
   - Color (optional, defaults to blue)
3. Click "Create" to save the event

### Editing an Event

1. Click on an event card to open the edit form
2. Modify the event details
3. Click "Update" to save changes

### Deleting an Event

1. Right-click on an event card and select "Delete"
2. Or click on the event, then click "Delete Event" in the form
3. Confirm the deletion

### Navigating Weeks

- Use the "Previous Week" and "Next Week" buttons to navigate
- Click on any day tab to view events for that specific day
- The selected day is highlighted

## Data Storage

All events and venues are stored in browser localStorage:
- Events: `event-time-table-events`
- Venues: `event-time-table-venues`

Data persists across browser sessions and page refreshes.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

This project uses:
- ESLint for code linting
- TypeScript for type checking
- Prettier-friendly formatting (via ESLint)
