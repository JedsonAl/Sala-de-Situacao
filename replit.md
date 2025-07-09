# Sala de Situação - Plataforma de Monitoramento de Indicadores da APS

## Overview

This is a comprehensive web platform for monitoring Primary Health Care (APS) indicators, designed for health managers and administrators to track performance metrics across health units. The system provides real-time dashboards, detailed indicator analysis, and patient-level monitoring capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context for authentication, React Query for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Simple session-based authentication
- **API**: REST API with Express routes

### Project Structure
```
├── client/           # React frontend
├── server/           # Express backend
├── shared/           # Shared types and schemas
├── migrations/       # Database migrations
└── attached_assets/  # Project documentation
```

## Key Components

### Authentication System
- Role-based access control (RBAC)
- Two user types: "admin" (system administrator) and "responsible" (unit manager)
- Simple login system with username/password authentication

### Dashboard Components
- **Gauge Charts**: Performance indicators with visual meters
- **Line Charts**: Historical trend analysis
- **Bar Charts**: Component breakdown analysis
- **Data Tables**: Patient nominal lists with filtering

### UI Components
- Built on shadcn/ui component library
- Responsive design with mobile support
- Accessible components with proper ARIA labels
- Consistent design system with CSS variables

### Database Schema
- **Users**: Authentication and role management
- **Municipalities**: Geographic organization
- **Health Units**: Healthcare facilities
- **Indicators**: Performance metrics
- **Patients**: Individual patient records
- **Patient Status**: Individual criterion tracking

## Data Flow

### Authentication Flow
1. User submits credentials via login form
2. Server validates against user database
3. User context updated with role and permissions
4. Route access controlled by user role

### Dashboard Data Flow
1. User selects dashboard view
2. React Query fetches indicator data from API
3. Data processed for visualization components
4. Real-time updates via query invalidation

### Indicator Detail Flow
1. User navigates to specific indicator
2. Multiple API calls fetch:
   - Current performance metrics
   - Historical trend data
   - Patient nominal lists
   - Component breakdowns
3. Data rendered in standardized indicator layout

## External Dependencies

### Database Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **connect-pg-simple**: Session storage

### Frontend Dependencies
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Deployment Strategy

### Development
- Vite dev server for frontend hot reloading
- tsx for TypeScript execution in development
- Automatic database migrations via Drizzle

### Production Build
- Vite builds optimized React bundle
- esbuild compiles Node.js backend
- Static assets served from Express

### Database Management
- Drizzle migrations for schema changes
- Environment-based configuration
- Connection pooling for performance

### Environment Configuration
- DATABASE_URL for PostgreSQL connection
- NODE_ENV for environment detection
- Build artifacts in `dist/` directory

## Notable Features

### Health Indicator System
- 15 predefined health indicators across 3 categories
- Standardized indicator layout with performance metrics
- Historical trend analysis with 12-month views
- Patient-level criterion tracking

### Administrative Features
- Municipality and health unit management
- User role assignment and permissions
- Database connection configuration
- Bulk patient data import capabilities

### Responsive Design
- Mobile-first approach with breakpoint handling
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements
- Accessibility compliance with WCAG guidelines