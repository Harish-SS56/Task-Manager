# Task Manager Application

## Overview

This is a full-stack Task Manager application built with a modern tech stack. The application allows users to register, login, and manage their personal tasks with full CRUD operations. The backend uses Express.js with MongoDB for data persistence, while the frontend is built with React and styled using Tailwind CSS with Shadcn/ui components.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with Shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication with bcryptjs for password hashing
- **API Design**: RESTful API endpoints with proper HTTP methods
- **Middleware**: CORS enabled, JWT verification middleware for protected routes

### Data Storage Solutions
- **Primary Database**: MongoDB Atlas (cloud-hosted)
- **Schema Design**: 
  - User model with email and password fields
  - Task model with userId reference, title, description, and completion status
- **Connection**: Mongoose for MongoDB object modeling

## Key Components

### Authentication System
- JWT-based authentication with 7-day token expiration
- Password hashing using bcryptjs
- Protected routes with middleware verification
- AuthContext for client-side authentication state management

### Task Management
- Full CRUD operations for tasks
- Task completion toggle functionality
- User-specific task isolation
- Real-time UI updates with optimistic mutations

### UI/UX Components
- Responsive design with mobile-first approach
- Modern component library (Shadcn/ui)
- Toast notifications for user feedback
- Form validation and error handling
- Loading states and error boundaries

## Data Flow

1. **Authentication Flow**:
   - User registers/logs in → Server validates → JWT token generated → Client stores token → Protected routes accessible

2. **Task Management Flow**:
   - Client request with JWT → Server validates token → Database operation → Response with updated data → Client UI updates

3. **Client-Server Communication**:
   - TanStack Query handles API requests with caching and synchronization
   - Automatic retry logic and background refetching
   - Optimistic updates for better user experience

## External Dependencies

### Backend Dependencies
- Express.js for server framework
- Mongoose for MongoDB integration
- bcryptjs for password security
- jsonwebtoken for authentication
- cors for cross-origin requests
- dotenv for environment configuration

### Frontend Dependencies
- React ecosystem (React, React DOM)
- Vite for build tooling
- TanStack Query for server state
- Wouter for routing
- Tailwind CSS for styling
- Radix UI for accessible components
- Various utility libraries (clsx, date-fns, etc.)

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR (Hot Module Replacement)
- tsx for TypeScript execution in development
- Concurrent backend and frontend development on port 5000

### Production Build
- Frontend: Vite build process creating optimized static assets
- Backend: esbuild bundling for Node.js production deployment
- Static file serving from Express for SPA routing
- Environment-specific configuration via dotenv

### Replit Configuration
- Autoscale deployment target
- PostgreSQL module included (though MongoDB is currently used)
- Port 5000 exposed for external access
- Parallel workflow execution for development

## Changelog
- June 19, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.