
# TeacherPro - Lesson Management System

A responsive React frontend application that allows teachers to manage their weekly lesson timetables with real-time notifications.

## Features

- **Authentication**: Teacher registration and login
- **Profile Management**: View and edit teacher profiles
- **Lesson Management**: Create, update, and delete lessons
- **Weekly Calendar View**: Visual timetable with lesson details
- **Real-time Notifications**: Popup alerts 30 minutes and 10 minutes before lessons
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Notifications**: Custom toast system with Sonner
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
- **npm** (version 8.0.0 or higher) or **yarn** (version 1.22.0 or higher)

You can check your versions by running:
```bash
node --version
npm --version
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Build

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Backend Requirements

This frontend application requires a backend API with the following endpoints:

### Authentication Endpoints
- `POST /api/auth/register` - Teacher registration
- `POST /api/auth/login` - Teacher login

### Teacher Profile Endpoints
- `GET /api/teacher` - Get teacher profile
- `PUT /api/teacher` - Update teacher profile

### Lesson Management Endpoints
- `POST /api/lesson` - Create a new lesson
- `GET /api/lesson/teacher` - Get paginated lessons for teacher
- `PUT /api/lesson/{lessonId}` - Update a lesson
- `DELETE /api/lesson/{lessonId}` - Delete a lesson

### Expected Data Formats

**User/Teacher Object**:
```typescript
{
  id: string;
  email: string;
  name: string;
  subject?: string;
  bio?: string;
}
```

**Lesson Object**:
```typescript
{
  id: string;
  title: string;
  description: string;
  startTime: string; // ISO format
  endTime: string;   // ISO format
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
}
```

## Environment Variables

No environment variables are required for the frontend. The application assumes the backend API is available at `/api/*` endpoints.

If you need to configure a different API base URL, you can modify the `API_BASE_URL` constant in `src/services/api.ts`.

## Key Features Explained

### Real-time Notifications
The application polls lesson times every minute and shows notifications:
- **30 minutes before**: Warning notification
- **10 minutes before**: Urgent notification

### Responsive Design
- Mobile-first approach using Tailwind CSS
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements

### Weekly Calendar View
- Visual representation of lessons throughout the week
- Time slots from 6 AM to 10 PM
- Drag-and-drop functionality (future enhancement)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Header.tsx      # Navigation header
│   ├── LoginForm.tsx   # Authentication form
│   ├── LessonModal.tsx # Lesson creation/editing
│   ├── ProfileModal.tsx# Profile management
│   ├── ProtectedRoute.tsx # Route protection
│   └── WeeklyCalendar.tsx # Calendar view
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Authentication state
├── hooks/              # Custom React hooks
├── services/           # API service functions
│   └── api.ts         # Lesson API calls
├── types/              # TypeScript type definitions
│   └── index.ts       # Shared types
├── pages/              # Page components
└── lib/                # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

### Custom Deployment
You can deploy the built application to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

